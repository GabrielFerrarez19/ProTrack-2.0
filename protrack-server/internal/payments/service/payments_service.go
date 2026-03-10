package service

import (
	"context"
	"errors"

	accReceivableDomain "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/accounts_receivable/domain"
	accReceivableService "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/accounts_receivable/service"
	customerDomain "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/customers/domain"
	customerService "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/customers/service"
	paymentHistoryDomain "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/payment_history/domain"
	paymentHistoryService "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/payment_history/service"
	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/payments/domain"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Service struct {
	pool                  *pgxpool.Pool
	paymentHistoryService *paymentHistoryService.Service
	accReceivableService  *accReceivableService.Service
	customersService      *customerService.Service
}

func NewService(
	pool *pgxpool.Pool,
	paymentHistoryService *paymentHistoryService.Service,
	accReceivableService *accReceivableService.Service,
	customersService *customerService.Service,
) *Service {
	return &Service{
		pool:                  pool,
		paymentHistoryService: paymentHistoryService,
		accReceivableService:  accReceivableService,
		customersService:      customersService,
	}
}

func (s *Service) NewPayment(ctx context.Context, companyId, userId uuid.UUID, req domain.CreatePaymentRequest) error {
	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	balanceCustomer, err := s.customersService.GetCustomerByIdTx(ctx, tx, req.CustomerID)
	if err != nil {
		return err
	}

	if balanceCustomer.BalanceDue < req.AmountPaid {
		return errors.New("The amount entered is greater than the outstanding balance.")
	}

	var reqAcc accReceivableDomain.UpdateAccountReceivableBalanceRequest

	reqAcc.Balance = req.AmountPaid

	saleId, err := s.accReceivableService.UpdateAccountReceivableBalanceTx(ctx, tx, companyId, req.CustomerID, userId, reqAcc)
	if err != nil {
		return err
	}

	var reqCustomer customerDomain.UpdateBalanceDueCustomerRequest

	reqCustomer.BalanceDue = req.AmountPaid
	reqCustomer.UpdatedBy = userId

	if err := s.customersService.UpdateCustomerBalanceSubTx(ctx, tx, req.CustomerID, reqCustomer); err != nil {
		return err
	}

	var reqPH paymentHistoryDomain.CreatePaymentHistoryRequest

	reqPH.AmountPaid = req.AmountPaid
	reqPH.CompanyID = companyId
	reqPH.CustomerID = req.CustomerID
	reqPH.Notes = req.Notes
	reqPH.PaymentMethodID = req.PaymentMethodID
	reqPH.SaleID = saleId
	reqPH.UserID = userId

	if err := s.paymentHistoryService.CreatePaymentHistoryTx(ctx, tx, reqPH); err != nil {
		return err
	}

	return tx.Commit(ctx)
}
