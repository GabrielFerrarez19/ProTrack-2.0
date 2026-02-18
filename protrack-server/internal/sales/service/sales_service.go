package service

import (
	"context"

	pgconv "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/adapters/pgtype"
	customerDomain "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/customers/domain"
	customerService "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/customers/service"
	db "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/database/sqlc"
	saleItemDomain "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/sale_items/domain"
	saleItemsService "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/sale_items/service"
	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/sales/domain"
	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/sales/repository"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type RepositoryInterface interface {
	CreateSales(ctx context.Context, arg db.CreateSaleParams) (pgtype.UUID, error)
	DeleteSales(ctx context.Context, arg db.DeleteSaleParams) error
	GetSaleById(ctx context.Context, arg db.GetSaleByIdParams) (db.GetSaleByIdRow, error)
	ListSales(ctx context.Context, companyId pgtype.UUID) ([]db.ListSalesRow, error)
	UpdateSaleStatus(ctx context.Context, arg db.UpdateSaleStatusParams) error
	ListSalesByCompanyAndStatus(ctx context.Context, arg db.ListSalesByCompanyAndStatusParams) ([]db.ListSalesByCompanyAndStatusRow, error)
	WithTx(tx db.DBTX) *repository.Repository
}

type Service struct {
	repo             RepositoryInterface
	pool             *pgxpool.Pool
	saleItemsService *saleItemsService.Service
	customerService  *customerService.Service
}

func NewService(repo *repository.Repository, pool *pgxpool.Pool, saleItemsService *saleItemsService.Service, customerService *customerService.Service) *Service {
	return &Service{
		repo:             repo,
		pool:             pool,
		saleItemsService: saleItemsService,
		customerService:  customerService,
	}
}

func (s *Service) CreateSale(ctx context.Context, req domain.CreateSaleRequest) (uuid.UUID, error) {
	if err := domain.ValidateCreateSaleRequest(req); err != nil {
		return uuid.Nil, err
	}

	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return uuid.Nil, err
	}
	defer tx.Rollback(ctx)

	txRepo := s.repo.WithTx(tx)

	if req.PaymentMethod == "installments" {
		if err := s.customerService.UpdateBalanceDueCustomer(ctx, req.CustomerID, customerDomain.UpdateBalanceDueCustomerRequest{
			BalanceDue: req.Subtotal,
			UpdatedBy:  req.CreatedBy,
		}); err != nil {
			return uuid.Nil, err
		}
		req.Status = "pending"
	}

	id, err := txRepo.CreateSales(ctx, db.CreateSaleParams{
		CustomerID:     pgconv.ParseUUIDToPgType(req.CustomerID),
		CompanyID:      pgconv.ParseUUIDToPgType(req.CompanyID),
		DiscountAmount: pgconv.Float64ToPgNumeric(req.DiscountAmount),
		Subtotal:       pgconv.Float64ToPgNumeric(req.Subtotal),
		TotalAmount:    pgconv.Float64ToPgNumeric(req.TotalAmount),
		DueDays:        pgconv.IntToPgInt4(int(req.DueDays)),
		PaymentMethod:  req.PaymentMethod,
		Status:         req.Status,
		CreatedBy:      pgconv.ParseUUIDToPgType(req.CreatedBy),
	})
	if err != nil {
		return uuid.Nil, err
	}

	for _, itemReq := range req.Items {
		itemReq.SaleID = pgconv.PgUUIDToUUID(id)

		if err := s.saleItemsService.CreateSaleItemInTx(ctx, tx, saleItemDomain.CreateSaleItemRequest(itemReq), req.CompanyID); err != nil {
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
