package service

import (
	"context"

	pgconv "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/adapters/pgtype"
	db "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/database/sqlc"
	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/payment_methods/domain"
	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/payment_methods/repository"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type RepositoryInterface interface {
	CreatePaymentMethod(ctx context.Context, arg db.CreatePaymentMethodParams) error
	GetPaymentMethodById(ctx context.Context, id pgtype.UUID) (db.PaymentMethod, error)
	ListPaymentMethod(ctx context.Context, companyId pgtype.UUID) ([]db.PaymentMethod, error)
	ListPaymentMethodIsActive(ctx context.Context, companyId pgtype.UUID) ([]db.PaymentMethod, error)
	TogglePaymentMethodActive(ctx context.Context, arg db.TogglePaymentMethodActiveParams) error
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

func (s *Service) CreatePaymentMethod(ctx context.Context, req domain.CreatePaymentMethodRequest) error {
	return s.repo.CreatePaymentMethod(ctx, db.CreatePaymentMethodParams{
		CompanyID: pgconv.ParseUUIDToPgType(req.CompanyID),
		Name:      req.Name,
		Type:      req.Type,
	})
}

func (s *Service) GetPaymentMethodById(ctx context.Context, companyId uuid.UUID) (domain.PaymentMethodResponse, error) {
	methods, err := s.repo.GetPaymentMethodById(ctx, pgconv.ParseUUIDToPgType(companyId))
	if err != nil {
		return domain.PaymentMethodResponse{}, err
	}

	return domain.PaymentMethodResponse{
		ID:        pgconv.PgUUIDToUUID(methods.ID),
		CompanyID: pgconv.PgUUIDToUUID(methods.CompanyID),
		Name:      methods.Name,
		Type:      methods.Type,
		IsActive:  methods.IsActive,
		CreatedAt: pgconv.PgTimestamptzToTime(methods.CreatedAt),
		UpdatedAt: pgconv.PgTimestamptzToTime(methods.UpdatedAt),
	}, nil
}

func (s *Service) ListPaymentMethod(ctx context.Context, companyId uuid.UUID) ([]domain.PaymentMethodResponse, error) {
	methods, err := s.repo.ListPaymentMethod(ctx, pgconv.ParseUUIDToPgType(companyId))
	if err != nil {
		return []domain.PaymentMethodResponse{}, err
	}

	var response []domain.PaymentMethodResponse

	for _, method := range methods {
		response = append(response, domain.PaymentMethodResponse{
			ID:        pgconv.PgUUIDToUUID(method.ID),
			CompanyID: pgconv.PgUUIDToUUID(method.CompanyID),
			Name:      method.Name,
			Type:      method.Type,
			IsActive:  method.IsActive,
			CreatedAt: pgconv.PgTimestamptzToTime(method.CreatedAt),
			UpdatedAt: pgconv.PgTimestamptzToTime(method.UpdatedAt),
		})
	}

	return response, nil
}

func (s *Service) ListPaymentMethodIsActive(ctx context.Context, companyId uuid.UUID) ([]domain.PaymentMethodResponse, error) {
	methods, err := s.repo.ListPaymentMethodIsActive(ctx, pgconv.ParseUUIDToPgType(companyId))
	if err != nil {
		return []domain.PaymentMethodResponse{}, err
	}

	var response []domain.PaymentMethodResponse

	for _, method := range methods {
		response = append(response, domain.PaymentMethodResponse{
			ID:        pgconv.PgUUIDToUUID(method.ID),
			CompanyID: pgconv.PgUUIDToUUID(method.CompanyID),
			Name:      method.Name,
			Type:      method.Type,
			IsActive:  method.IsActive,
			CreatedAt: pgconv.PgTimestamptzToTime(method.CreatedAt),
			UpdatedAt: pgconv.PgTimestamptzToTime(method.UpdatedAt),
		})
	}

	return response, nil
}

func (s *Service) TogglePaymentMethodActive(ctx context.Context, id uuid.UUID, req domain.TogglePaymentMethodActiveRequest) error {
	return s.repo.TogglePaymentMethodActive(ctx, db.TogglePaymentMethodActiveParams{
		ID:       pgconv.ParseUUIDToPgType(id),
		IsActive: req.IsActive,
	})
}
