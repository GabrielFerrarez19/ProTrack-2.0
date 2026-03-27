package service

import (
	"context"
	"time"

	pgconv "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/adapters/pgtype"
	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/cash_flow/domain"
	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/cash_flow/repository"
	db "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/database/sqlc"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type RepositoryInterface interface {
	GetTotalInflowByPeriod(ctx context.Context, arg db.GetTotalInflowByPeriodParams) (float64, error)
	GetTotalOutflowByPeriod(ctx context.Context, arg db.GetTotalOutflowByPeriodParams) (float64, error)
}

type Service struct {
	repo RepositoryInterface
	pool *pgxpool.Pool
}

func NewService(repo *repository.Repository, pool *pgxpool.Pool) *Service {
	return &Service{
		repo: repo,
		pool: pool,
	}
}

func (s *Service) CashFlowSummary(ctx context.Context, companyId uuid.UUID, startAt time.Time, endAt time.Time) (domain.CashFlowSummaryResponse, error) {
	totalInFlow, err := s.repo.GetTotalInflowByPeriod(ctx, db.GetTotalInflowByPeriodParams{
		CompanyID:   pgconv.ParseUUIDToPgType(companyId),
		CreatedAt:   pgconv.TimeToPgTimestamptz(startAt),
		CreatedAt_2: pgconv.TimeToPgTimestamptz(endAt),
	})
	if err != nil {
		return domain.CashFlowSummaryResponse{}, err
	}

	totalOutFlow, err := s.repo.GetTotalOutflowByPeriod(ctx, db.GetTotalOutflowByPeriodParams{
		CompanyID:     pgconv.ParseUUIDToPgType(companyId),
		PaymentDate:   pgconv.StringToPgDate(startAt.GoString()),
		PaymentDate_2: pgconv.StringToPgDate(endAt.GoString()),
	})
	if err != nil {
		return domain.CashFlowSummaryResponse{}, err
	}

	netBalance := totalInFlow - totalOutFlow

	return domain.CashFlowSummaryResponse{
		TotalInflow:  totalInFlow,
		TotalOutflow: totalOutFlow,
		NetBalance:   netBalance,
	}, nil
}
