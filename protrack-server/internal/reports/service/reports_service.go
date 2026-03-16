package service

import (
	"context"
	"errors"
	"fmt"
	"time"

	paymentHistoryService "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/payment_history/service"
	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/reports/domain"
	saleService "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/sales/service"
	"github.com/google/uuid"
)

type Service struct {
	saleService           *saleService.Service
	paymentHistoryService *paymentHistoryService.Service
}

func NewService(saleService *saleService.Service, paymentHistoryService *paymentHistoryService.Service) *Service {
	return &Service{
		saleService:           saleService,
		paymentHistoryService: paymentHistoryService,
	}
}

func (s *Service) GenerateReports(ctx context.Context, reportType string, companyId uuid.UUID, At time.Time, At2 time.Time) (domain.ReportResponse, error) {
	var response domain.ReportResponse
	var headers []string
	var rows [][]any
	var fileName string
	switch reportType {
	case string(domain.ReportSales):
		report, err := s.saleService.GetPendingSalesDetailedReport(ctx, companyId, At, At2)
		if err != nil {
			return domain.ReportResponse{}, errors.New("erro ao gerar relatório de vendas pendentes")
		}

		headers = []string{
			"Data da Venda",
			"Subtotal",
			"Desconto",
			"Total",
			"Parcelas",
			"Método de Pagamento",
			"Status da Venda",
			"Nome do Cliente",
			"Quantidade",
			"Preço Unitário",
			"Desconto do Item",
			"Nome do Produto",
			"Total da Parcela",
			"Saldo da Parcela",
			"Data de Vencimento",
			"Número da Parcela",
			"Status da Parcela",
		}
		rows = [][]any{}
		for _, row := range report {
			rows = append(rows, []any{
				row.SaleAt.Format("02/01/2006"),
				row.Subtotal,
				row.DiscountAmount,
				row.TotalAmount,
				row.InstallmentsCount,
				row.PaymentMethod,
				row.SaleStatus,
				row.CustomerName,
				row.Quantity,
				row.UnitPrice,
				row.ItemDiscount,
				row.ProductName,
				row.InstallmentTotalAmount,
				row.InstallmentBalance,
				row.DueDate,
				row.InstallmentNumber,
				row.InstallmentStatus,
			})
		}
		fileName = fmt.Sprintf("sales_%s.xlsx", At.Format("02-01-2006"))
		response = domain.ReportResponse{
			Headers:  headers,
			Rows:     rows,
			FileName: fileName,
		}
		return response, nil
	case string(domain.ReportPayments):
		history, err := s.paymentHistoryService.GetPaymentsHistoryReport(ctx, companyId, At, At2)
		if err != nil {
			return domain.ReportResponse{}, err
		}

		header, row := domain.MapStructToReport(history)

		fileName = fmt.Sprintf("paymentHistory_%s.xlsx", At.Format("02-01-2006"))

		return domain.ReportResponse{
			Headers:  header,
			Rows:     row,
			FileName: fileName,
		}, nil

	}

	return domain.ReportResponse{}, errors.New("relatório não encontrado")
}
