package service

import (
	"context"
	"fmt"
	"time"

	accountsReceivableDomain "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/accounts_receivable/domain"
	accountsReceivableService "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/accounts_receivable/service"
	pgconv "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/adapters/pgtype"
	customerDomain "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/customers/domain"
	customerService "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/customers/service"
	db "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/database/sqlc"
	saleItemDomain "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/sale_items/domain"
	saleItemsService "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/sale_items/service"
	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/sales/domain"
	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/sales/repository"
	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/whatsapp"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/zerolog/log"
)

type RepositoryInterface interface {
	CreateSales(ctx context.Context, arg db.CreateSaleParams) (pgtype.UUID, error)
	DeleteSales(ctx context.Context, arg db.DeleteSaleParams) error
	GetSaleById(ctx context.Context, arg db.GetSaleByIdParams) (db.GetSaleByIdRow, error)
	ListSales(ctx context.Context, companyId pgtype.UUID) ([]db.ListSalesRow, error)
	UpdateSaleStatus(ctx context.Context, arg db.UpdateSaleStatusParams) error
	ListSalesByCompanyAndStatus(ctx context.Context, arg db.ListSalesByCompanyAndStatusParams) ([]db.ListSalesByCompanyAndStatusRow, error)
	CountSales(ctx context.Context, companyId pgtype.UUID) (int64, error)
	GetSalesPerformanceSummary(ctx context.Context, companyId pgtype.UUID) (db.GetSalesPerformanceSummaryRow, error)
	GetTotalAmountSummary(ctx context.Context, companyId pgtype.UUID) (db.GetTotalAmountSummaryRow, error)
	GetTotalAmountByStatus(ctx context.Context, arg db.GetTotalAmountByStatusParams) (float64, error)
	GetSaleByIdWhatsapp(ctx context.Context, id pgtype.UUID) (db.GetSaleByIdWhatsappRow, error)
	UpdateOverdueSalesAndAccounts(ctx context.Context) ([]db.UpdateOverdueSalesAndAccountsGlobalRow, error)
	GetSaleByIdJust(ctx context.Context, saleId pgtype.UUID) (db.GetSaleByIdJustRow, error)
	ContSalesPendingAndOverdue(ctx context.Context, companyId pgtype.UUID) (int64, error)
	ListSalesWithDetails(ctx context.Context, companyID pgtype.UUID) ([]db.ListSalesWithDetailsRow, error)
	ListSalesWithDetailsPendingOverdue(ctx context.Context, companyID pgtype.UUID) ([]db.ListSalesWithDetailsPendingOverdueRow, error)
	GetPendingSalesDetailedReport(ctx context.Context, arg db.GetPendingSalesDetailedReportParams) ([]db.GetPendingSalesDetailedReportRow, error)
	WithTx(tx db.DBTX) *repository.Repository
}

type Service struct {
	repo                      RepositoryInterface
	pool                      *pgxpool.Pool
	saleItemsService          *saleItemsService.Service
	customerService           *customerService.Service
	accountsReceivableService *accountsReceivableService.Service
	whatsApp                  *whatsapp.Whatsapp
}

func NewService(
	repo *repository.Repository,
	pool *pgxpool.Pool,
	saleItemsService *saleItemsService.Service,
	customerService *customerService.Service,
	accountsReceivableService *accountsReceivableService.Service,
	whatsApp *whatsapp.Whatsapp,
) *Service {
	return &Service{
		repo:                      repo,
		pool:                      pool,
		saleItemsService:          saleItemsService,
		customerService:           customerService,
		accountsReceivableService: accountsReceivableService,
		whatsApp:                  whatsApp,
	}
}

func (s *Service) CreateSale(ctx context.Context, userId, companyId uuid.UUID, req domain.CreateSaleRequest) (uuid.UUID, error) {
	if err := domain.ValidateCreateSaleRequest(req); err != nil {
		return uuid.Nil, err
	}

	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return uuid.Nil, err
	}
	defer tx.Rollback(ctx)

	txRepo := s.repo.WithTx(tx)

	// 1. Definição do Status e Atualização de Saldo Devedor
	if req.PaymentMethod == "installments" {
		if err := s.customerService.UpdateCustomerBalanceAddTx(ctx, tx, req.CustomerID, customerDomain.UpdateBalanceDueCustomerRequest{
			BalanceDue: req.Subtotal,
			Prohibited: req.Prohibited,
			UpdatedBy:  userId,
		}); err != nil {
			return uuid.Nil, err
		}
		req.Status = "pending"
	} else {
		req.Status = "paid"
	}

	dueDaysVal := 0
	if req.PaymentMethod == "installments" && req.DueDays > 0 {
		dueDaysVal = int(req.DueDays)
	}

	var installments int32
	if req.PaymentMethod == "installments" {
		installments = req.InstallmentsCount
	}

	id, err := txRepo.CreateSales(ctx, db.CreateSaleParams{
		CustomerID:        pgconv.ParseUUIDToPgType(req.CustomerID),
		CompanyID:         pgconv.ParseUUIDToPgType(companyId),
		DiscountAmount:    pgconv.Float64ToPgNumeric(req.DiscountAmount),
		Subtotal:          pgconv.Float64ToPgNumeric(req.Subtotal),
		TotalAmount:       pgconv.Float64ToPgNumeric(req.TotalAmount),
		DueDays:           pgconv.OptionalIntToPgInt4(dueDaysVal),
		PaymentMethod:     req.PaymentMethod,
		Status:            req.Status,
		CreatedBy:         pgconv.ParseUUIDToPgType(userId),
		InstallmentsCount: installments,
		DownPayment:       pgconv.Float64ToPgNumeric(req.Prohibited),
	})
	if err != nil {
		return uuid.Nil, err
	}

	if req.PaymentMethod == "installments" {

		amountToParcel := req.TotalAmount - req.Prohibited
		installmentValue := amountToParcel / float64(req.InstallmentsCount)
		dataBase := time.Now()

		for i := 0; i < int(req.InstallmentsCount); i++ {
			var maturity time.Time

			if dataBase.Day() >= int(req.DueDays) {
				maturity = time.Date(
					dataBase.Year(),
					dataBase.Month()+time.Month(i+1),
					int(req.DueDays),
					0, 0, 0, 0,
					dataBase.Location(),
				)
			} else {
				maturity = time.Date(
					dataBase.Year(),
					dataBase.Month()+time.Month(i),
					int(req.DueDays),
					0, 0, 0, 0,
					dataBase.Location(),
				)
			}

			var reqAR accountsReceivableDomain.CreateAccountReceivableRequest
			reqAR.CustomerID = req.CustomerID
			reqAR.SaleID = pgconv.PgUUIDToUUID(id)

			reqAR.Balance = installmentValue
			reqAR.TotalAmount = installmentValue

			reqAR.InstallmentNumber = int64(i + 1)
			reqAR.TotalInstallments = int64(req.InstallmentsCount)
			reqAR.DueDate = maturity.Format("2006-01-02")

			if err := s.accountsReceivableService.CreateAccountReceivableInTx(ctx, tx, userId, companyId, reqAR); err != nil {
				return uuid.Nil, err
			}
		}
	}

	for _, itemReq := range req.Items {
		itemReq.SaleID = pgconv.PgUUIDToUUID(id)

		if err := s.saleItemsService.CreateSaleItemInTx(ctx, tx, saleItemDomain.CreateSaleItemRequest(itemReq), companyId); err != nil {
			return uuid.Nil, err
		}
	}

	return pgconv.PgUUIDToUUID(id), tx.Commit(ctx)
}

func (s *Service) DeleteSale(ctx context.Context, id uuid.UUID, req domain.DeleteSaleRequest) error {
	if err := s.repo.DeleteSales(ctx, db.DeleteSaleParams{
		DeletedBy: pgconv.ParseUUIDToPgType(req.DeletedBy),
		ID:        pgconv.ParseUUIDToPgType(id),
		CompanyID: pgconv.ParseUUIDToPgType(req.CompanyID),
	}); err != nil {
		return err
	}

	return nil
}

func (s *Service) GetSaleById(ctx context.Context, req domain.GetSaleByIdRequest) (domain.GetSaleByIdRow, error) {
	sale, err := s.repo.GetSaleById(ctx, db.GetSaleByIdParams{
		ID:        pgconv.ParseUUIDToPgType(req.ID),
		CompanyID: pgconv.ParseUUIDToPgType(req.CompanyID),
	})
	if err != nil {
		return domain.GetSaleByIdRow{}, err
	}

	return domain.GetSaleByIdRow{
		ID:             pgconv.PgUUIDToUUID(sale.ID),
		CustomerID:     pgconv.PgUUIDToUUID(sale.CustomerID),
		CompanyID:      pgconv.PgUUIDToUUID(sale.CompanyID),
		SaleAt:         pgconv.PgTimestamptzToTime(sale.SaleAt),
		DiscountAmount: pgconv.PgNumericToFloat64(sale.DiscountAmount),
		Subtotal:       pgconv.PgNumericToFloat64(sale.Subtotal),
		TotalAmount:    pgconv.PgNumericToFloat64(sale.TotalAmount),
		DueDays:        int32(pgconv.PgInt4ToInt(sale.DueDays)),
		PaymentMethod:  sale.PaymentMethod,
		Status:         sale.Status,
		CreatedAt:      pgconv.PgTimestamptzToTime(sale.CreatedAt),
		CreatedBy:      pgconv.PgUUIDToUUID(sale.CreatedBy),
		UpdatedAt:      pgconv.PgTimestamptzToTime(sale.UpdatedAt),
		UpdatedBy:      pgconv.PgUUIDToUUID(sale.UpdatedBy),
		DeletedAt:      pgconv.PgTimestamptzToTime(sale.DeletedAt),
		DeletedBy:      pgconv.PgUUIDToUUID(sale.DeletedBy),
		CustomerName:   sale.CustomerName,
	}, nil
}

func (s *Service) GetSaleByIdTx(ctx context.Context, tx db.DBTX, id, companyId uuid.UUID) (domain.GetSaleByIdRow, error) {
	repoTx := db.New(tx)

	sale, err := repoTx.GetSaleById(ctx, db.GetSaleByIdParams{
		ID:        pgconv.ParseUUIDToPgType(id),
		CompanyID: pgconv.ParseUUIDToPgType(companyId),
	})
	if err != nil {
		return domain.GetSaleByIdRow{}, err
	}

	return domain.GetSaleByIdRow{
		ID:             pgconv.PgUUIDToUUID(sale.ID),
		CustomerID:     pgconv.PgUUIDToUUID(sale.CustomerID),
		CompanyID:      pgconv.PgUUIDToUUID(sale.CompanyID),
		SaleAt:         pgconv.PgTimestamptzToTime(sale.SaleAt),
		DiscountAmount: pgconv.PgNumericToFloat64(sale.DiscountAmount),
		Subtotal:       pgconv.PgNumericToFloat64(sale.Subtotal),
		TotalAmount:    pgconv.PgNumericToFloat64(sale.TotalAmount),
		DueDays:        int32(pgconv.PgInt4ToInt(sale.DueDays)),
		PaymentMethod:  sale.PaymentMethod,
		Status:         sale.Status,
		CreatedAt:      pgconv.PgTimestamptzToTime(sale.CreatedAt),
		CreatedBy:      pgconv.PgUUIDToUUID(sale.CreatedBy),
		UpdatedAt:      pgconv.PgTimestamptzToTime(sale.UpdatedAt),
		UpdatedBy:      pgconv.PgUUIDToUUID(sale.UpdatedBy),
		DeletedAt:      pgconv.PgTimestamptzToTime(sale.DeletedAt),
		DeletedBy:      pgconv.PgUUIDToUUID(sale.DeletedBy),
		CustomerName:   sale.CustomerName,
	}, nil
}

func (s *Service) ListSales(ctx context.Context, companyId uuid.UUID) ([]domain.ListSalesRow, error) {
	sales, err := s.repo.ListSales(ctx, pgconv.ParseUUIDToPgType(companyId))
	if err != nil {
		return []domain.ListSalesRow{}, err
	}

	var response []domain.ListSalesRow

	for _, sale := range sales {
		response = append(response, domain.ListSalesRow{
			ID:          pgconv.PgUUIDToUUID(sale.ID),
			SaleAt:      pgconv.PgTimestamptzToTime(sale.SaleAt),
			TotalAmount: pgconv.PgNumericToFloat64(sale.TotalAmount),
			Status:      sale.Status,
			CreatedAt:   pgconv.PgTimestamptzToTime(sale.CreatedAt),
		})
	}

	return response, nil
}

func (s *Service) UpdateSaleStatus(ctx context.Context, id uuid.UUID, req domain.UpdateSaleStatusRequest) error {
	sale, err := s.repo.GetSaleById(ctx, db.GetSaleByIdParams{
		ID:        pgconv.ParseUUIDToPgType(req.ID),
		CompanyID: pgconv.ParseUUIDToPgType(req.CompanyID),
	})
	if err != nil {
		return err
	}

	arg := db.UpdateSaleStatusParams{
		Status:    sale.Status,
		UpdatedBy: sale.UpdatedBy,
		ID:        pgconv.ParseUUIDToPgType(id),
		CompanyID: sale.CompanyID,
	}

	if req.Status != "" {
		arg.Status = req.Status
	}

	if err := s.repo.UpdateSaleStatus(ctx, arg); err != nil {
		return err
	}

	return nil
}

func (s *Service) UpdateSaleStatusTx(ctx context.Context, tx db.DBTX, id, company_id, userId uuid.UUID, status string) error {
	repoTx := db.New(tx)

	sale, err := repoTx.GetSaleById(ctx, db.GetSaleByIdParams{
		ID:        pgconv.ParseUUIDToPgType(id),
		CompanyID: pgconv.ParseUUIDToPgType(company_id),
	})
	if err != nil {
		return err
	}

	arg := db.UpdateSaleStatusParams{
		Status:    sale.Status,
		UpdatedBy: sale.UpdatedBy,
		ID:        pgconv.ParseUUIDToPgType(id),
		CompanyID: sale.CompanyID,
	}

	if status != "" {
		arg.Status = status
	}

	if err := repoTx.UpdateSaleStatus(ctx, arg); err != nil {
		return err
	}

	return nil
}

func (s *Service) ListSalesByCustomerAndStatus(ctx context.Context, req domain.ListSalesByCompanyAndStatusRequest) ([]domain.ListSalesByCompanyAndStatusRow, error) {
	sales, err := s.repo.ListSalesByCompanyAndStatus(ctx, db.ListSalesByCompanyAndStatusParams{
		CompanyID: pgconv.ParseUUIDToPgType(req.CompanyID),
		Column2:   req.Status,
	})
	if err != nil {
		return []domain.ListSalesByCompanyAndStatusRow{}, err
	}

	var response []domain.ListSalesByCompanyAndStatusRow

	for _, sale := range sales {
		response = append(response, domain.ListSalesByCompanyAndStatusRow{
			SaleID:         pgconv.PgUUIDToUUID(sale.SaleID),
			TotalAmount:    pgconv.PgNumericToFloat64(sale.TotalAmount),
			DiscountAmount: pgconv.PgNumericToFloat64(sale.DiscountAmount),
			Status:         sale.Status,
			SaleDate:       pgconv.PgTimestamptzToTime(sale.SaleDate),
			ItemID:         pgconv.PgUUIDToUUID(sale.ItemID),
			ProductID:      pgconv.PgUUIDToUUID(sale.ProductID),
			Quantity:       sale.Quantity,
			UnitPrice:      pgconv.PgNumericToFloat64(sale.UnitPrice),
			Discount:       pgconv.PgNumericToFloat64(sale.Discount),
			ProductName:    sale.ProductName,
			CustomerName:   sale.CustomerName,
		})
	}

	return response, nil
}

func (s *Service) CountSales(ctx context.Context, companyId uuid.UUID) (int64, error) {
	count, err := s.repo.CountSales(ctx, pgconv.ParseUUIDToPgType(companyId))
	if err != nil {
		return 0, err
	}

	return count, nil
}

func (s *Service) GetSalesPerformanceSummary(ctx context.Context, companyId uuid.UUID) (float64, error) {
	res, err := s.repo.GetSalesPerformanceSummary(ctx, pgconv.ParseUUIDToPgType(companyId))
	if err != nil {
		log.Err(err).Msg("Debug para error")
		return 0, err
	}

	var percentage float64

	if res.LastMonthCount > 0 {
		percentage = (float64(res.CurrentMonthCount) - float64(res.LastMonthCount)) / float64(res.LastMonthCount) * 100
	} else {
		if res.CurrentMonthCount > 0 {
			percentage = 100.0
		} else {
			percentage = 0.0
		}
	}

	return percentage, nil
}

func (s *Service) GetTotalAmountSummary(ctx context.Context, companyId uuid.UUID) (domain.GetTotalAmountSummaryRow, error) {
	res, err := s.repo.GetTotalAmountSummary(ctx, pgconv.ParseUUIDToPgType(companyId))
	if err != nil {
		return domain.GetTotalAmountSummaryRow{}, err
	}

	return domain.GetTotalAmountSummaryRow{
		CurrentMonthSt: res.CurrentMonthSt,
		LastMonthSt:    res.LastMonthSt,
	}, nil
}

func (s *Service) GetTotalAmountIsPending(ctx context.Context, companyId uuid.UUID) (float64, error) {
	status := "pending"

	total, err := s.repo.GetTotalAmountByStatus(ctx, db.GetTotalAmountByStatusParams{
		CompanyID: pgconv.ParseUUIDToPgType(companyId),
		Status:    status,
	})
	if err != nil {
		return 0, err
	}

	return total, nil
}

func (s *Service) GetTotalAmountIsOverdue(ctx context.Context, req domain.GetTotalAmountByStatusRequest) (float64, error) {
	req.Status = "overdue"

	total, err := s.repo.GetTotalAmountByStatus(ctx, db.GetTotalAmountByStatusParams{
		CompanyID: pgconv.ParseUUIDToPgType(req.CompanyID),
		Status:    req.Status,
	})
	if err != nil {
		return 0, err
	}

	return total, nil
}

func (s *Service) UpdateOverdueSales(ctx context.Context) error {
	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return err
	}

	defer tx.Rollback(ctx)

	repoTx := s.repo.WithTx(tx)

	response, err := repoTx.UpdateOverdueSalesAndAccounts(ctx)
	if err != nil {
		return err
	}

	for _, data := range response {
		customer, err := s.customerService.GetCustomerByIdTx(ctx, tx, pgconv.PgUUIDToUUID(data.CustomerID))
		if err != nil {
			return err
		}

		sale, err := repoTx.GetSaleByIdJust(ctx, data.SaleID)
		if err != nil {
			log.Error().Err(err).Str("sale_id", data.SaleID.String()).Msg("Erro ao buscar venda para WhatsApp")
			continue
		}

		msg := fmt.Sprintf("⚠️ *Aviso de Vencimento*\n\n"+
			"Informamos que a sua parcela com vencimento no dia %d venceu hoje.\n"+
			"Pedimos que entre em contato para realizar a regularização.", sale.DueDays.Int32)

		targetNumber := customer.Whatsapp

		if err := s.whatsApp.SendWhatsAppMessage(targetNumber, msg); err != nil {
			log.Error().Err(err).Str("sale_id", data.SaleID.String()).Msg("Erro ao enviar WhatsApp de vencimento")
		}
	}

	return tx.Commit(ctx)
}

func (s *Service) ContSalesPendingAndOverdue(ctx context.Context, companyId uuid.UUID) (int64, error) {
	return s.repo.ContSalesPendingAndOverdue(ctx, pgconv.ParseUUIDToPgType(companyId))
}

func (s *Service) ListSalesWithDetails(ctx context.Context, companyId uuid.UUID) ([]domain.ListSalesWithInstallmentsResponse, error) {
	rows, err := s.repo.ListSalesWithDetails(ctx, pgconv.ParseUUIDToPgType(companyId))
	if err != nil {
		return []domain.ListSalesWithInstallmentsResponse{}, err
	}

	var response []domain.ListSalesWithInstallmentsResponse

	salesMap := make(map[uuid.UUID]*domain.ListSalesWithInstallmentsResponse)
	var orderedIds []uuid.UUID

	for _, row := range rows {
		saleId := pgconv.PgUUIDToUUID(row.SaleID)

		if _, exists := salesMap[saleId]; !exists {

			salesMap[saleId] = &domain.ListSalesWithInstallmentsResponse{
				Sale: domain.ListSalesResponse{
					SaleID:                 saleId,
					SaleAt:                 pgconv.PgTimestamptzToTime(row.SaleAt),
					Subtotal:               pgconv.PgNumericToFloat64(row.Subtotal),
					DiscountAmount:         pgconv.PgNumericToFloat64(row.DiscountAmount),
					TotalAmount:            pgconv.PgNumericToFloat64(row.TotalAmount),
					InstallmentsCount:      row.InstallmentsCount,
					PaymentMethod:          row.PaymentMethod,
					SaleStatus:             row.SaleStatus,
					CustomerID:             pgconv.PgUUIDToUUID(row.CustomerID),
					CustomerName:           row.CustomerName,
					InstallmentTotalAmount: float64(row.InstallmentsCount),
				},
				Products:      []domain.ListProductResponse{},
				AccReceivable: []domain.ListAccReceivableResponse{},
			}
			orderedIds = append(orderedIds, saleId)
		}
		itemId := pgconv.PgUUIDToUUID(row.SaleItemID)
		isProductNew := true

		for _, p := range salesMap[saleId].Products {
			if p.SaleItemID == itemId {
				isProductNew = false
				break
			}
		}
		if isProductNew && row.ProductID.Valid {
			salesMap[saleId].Products = append(salesMap[saleId].Products, domain.ListProductResponse{
				SaleItemID:   pgconv.PgUUIDToUUID(row.SaleItemID),
				ProductID:    pgconv.PgUUIDToUUID(row.ProductID),
				Quantity:     row.Quantity,
				UnitPrice:    pgconv.PgNumericToFloat64(row.UnitPrice),
				ItemDiscount: pgconv.PgNumericToFloat64(row.ItemDiscount),
				ProductName:  row.ProductName,
			})
		}

		instId := pgconv.PgUUIDToUUID(row.InstallmentID)
		isInstNew := true

		for _, i := range salesMap[saleId].AccReceivable {
			if i.InstallmentID == instId {
				isInstNew = false
				break
			}
		}
		if isInstNew && row.InstallmentID.Valid {
			salesMap[saleId].AccReceivable = append(salesMap[saleId].AccReceivable, domain.ListAccReceivableResponse{
				InstallmentID:      pgconv.PgUUIDToUUID(row.InstallmentID),
				InstallmentBalance: pgconv.PgNumericToFloat64(row.InstallmentBalance),
				DueDate:            pgconv.PgDateToString(row.DueDate),
				InstallmentNumber:  pgconv.PgInt4ToInt(row.InstallmentNumber),
				InstallmentStatus:  pgconv.ParsePgTextToString(row.InstallmentStatus),
			})
		}

	}

	for _, id := range orderedIds {
		response = append(response, *salesMap[id])
	}

	return response, nil
}

func (s *Service) ListSalesWithDetailsPendingOverdue(ctx context.Context, companyId uuid.UUID) ([]domain.ListSalesWithInstallmentsResponse, error) {
	rows, err := s.repo.ListSalesWithDetailsPendingOverdue(ctx, pgconv.ParseUUIDToPgType(companyId))
	if err != nil {
		return []domain.ListSalesWithInstallmentsResponse{}, err
	}

	var response []domain.ListSalesWithInstallmentsResponse

	salesMap := make(map[uuid.UUID]*domain.ListSalesWithInstallmentsResponse)
	var orderedIds []uuid.UUID

	for _, row := range rows {
		saleId := pgconv.PgUUIDToUUID(row.SaleID)

		if _, exists := salesMap[saleId]; !exists {

			salesMap[saleId] = &domain.ListSalesWithInstallmentsResponse{
				Sale: domain.ListSalesResponse{
					SaleID:                 saleId,
					SaleAt:                 pgconv.PgTimestamptzToTime(row.SaleAt),
					Subtotal:               pgconv.PgNumericToFloat64(row.Subtotal),
					DiscountAmount:         pgconv.PgNumericToFloat64(row.DiscountAmount),
					TotalAmount:            pgconv.PgNumericToFloat64(row.TotalAmount),
					InstallmentsCount:      row.InstallmentsCount,
					PaymentMethod:          row.PaymentMethod,
					SaleStatus:             row.SaleStatus,
					CustomerID:             pgconv.PgUUIDToUUID(row.CustomerID),
					CustomerName:           row.CustomerName,
					InstallmentTotalAmount: float64(row.InstallmentsCount),
				},
				Products:      []domain.ListProductResponse{},
				AccReceivable: []domain.ListAccReceivableResponse{},
			}
			orderedIds = append(orderedIds, saleId)
		}
		itemId := pgconv.PgUUIDToUUID(row.SaleItemID)
		isProductNew := true

		for _, p := range salesMap[saleId].Products {
			if p.SaleItemID == itemId {
				isProductNew = false
				break
			}
		}
		if isProductNew && row.ProductID.Valid {
			salesMap[saleId].Products = append(salesMap[saleId].Products, domain.ListProductResponse{
				SaleItemID:   pgconv.PgUUIDToUUID(row.SaleItemID),
				ProductID:    pgconv.PgUUIDToUUID(row.ProductID),
				Quantity:     row.Quantity,
				UnitPrice:    pgconv.PgNumericToFloat64(row.UnitPrice),
				ItemDiscount: pgconv.PgNumericToFloat64(row.ItemDiscount),
				ProductName:  row.ProductName,
			})
		}

		instId := pgconv.PgUUIDToUUID(row.InstallmentID)
		isInstNew := true

		for _, i := range salesMap[saleId].AccReceivable {
			if i.InstallmentID == instId {
				isInstNew = false
				break
			}
		}
		if isInstNew && row.InstallmentID.Valid {
			salesMap[saleId].AccReceivable = append(salesMap[saleId].AccReceivable, domain.ListAccReceivableResponse{
				InstallmentID:      pgconv.PgUUIDToUUID(row.InstallmentID),
				InstallmentBalance: pgconv.PgNumericToFloat64(row.InstallmentBalance),
				DueDate:            pgconv.PgDateToString(row.DueDate),
				InstallmentNumber:  pgconv.PgInt4ToInt(row.InstallmentNumber),
				InstallmentStatus:  pgconv.ParsePgTextToString(row.InstallmentStatus),
			})
		}

	}

	for _, id := range orderedIds {
		response = append(response, *salesMap[id])
	}

	return response, nil
}

func (s *Service) GetPendingSalesDetailedReport(ctx context.Context, companyId uuid.UUID, saleAt time.Time, saleAt2 time.Time) ([]domain.GetPendingSalesDetailedReportResponse, error) {
	report, err := s.repo.GetPendingSalesDetailedReport(ctx, db.GetPendingSalesDetailedReportParams{
		CompanyID: pgconv.ParseUUIDToPgType(companyId),
		SaleAt:    pgconv.TimeToPgTimestamptz(saleAt),
		SaleAt_2:  pgconv.TimeToPgTimestamptz(saleAt2),
	})
	if err != nil {
		return []domain.GetPendingSalesDetailedReportResponse{}, err
	}

	var response []domain.GetPendingSalesDetailedReportResponse

	for _, row := range report {
		response = append(response, domain.GetPendingSalesDetailedReportResponse{
			SaleID:                 pgconv.PgUUIDToUUID(row.SaleID),
			SaleAt:                 pgconv.PgTimestamptzToTime(row.SaleAt),
			Subtotal:               pgconv.PgNumericToFloat64(row.Subtotal),
			DiscountAmount:         pgconv.PgNumericToFloat64(row.DiscountAmount),
			TotalAmount:            pgconv.PgNumericToFloat64(row.TotalAmount),
			InstallmentsCount:      row.InstallmentsCount,
			PaymentMethod:          row.PaymentMethod,
			SaleStatus:             row.SaleStatus,
			CustomerID:             pgconv.PgUUIDToUUID(row.CustomerID),
			CustomerName:           row.CustomerName,
			SaleItemID:             pgconv.PgUUIDToUUID(row.SaleItemID),
			ProductID:              pgconv.PgUUIDToUUID(row.ProductID),
			Quantity:               row.Quantity,
			UnitPrice:              pgconv.PgNumericToFloat64(row.UnitPrice),
			ItemDiscount:           pgconv.PgNumericToFloat64(row.ItemDiscount),
			ProductName:            row.ProductName,
			InstallmentID:          pgconv.PgUUIDToUUID(row.InstallmentID),
			InstallmentTotalAmount: pgconv.PgNumericToFloat64(row.InstallmentTotalAmount),
			InstallmentBalance:     pgconv.PgNumericToFloat64(row.InstallmentBalance),
			DueDate:                pgconv.PgDateToString(row.DueDate),
			InstallmentNumber:      pgconv.PgInt4ToInt(row.InstallmentNumber),
			InstallmentStatus:      pgconv.ParsePgTextToString(row.InstallmentStatus),
		})
	}
	return response, nil
}
