package repository

import (
	"context"

	db "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/database/sqlc"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	pool *pgxpool.Pool
	q    *db.Queries
}

func NewRepository(pool *pgxpool.Pool) *Repository {
	return &Repository{
		pool: pool,
		q:    db.New(pool),
	}
}

func (r *Repository) CreateCompany(ctx context.Context, arg db.CreateCompanyParams) (db.Company, error) {
	return r.q.CreateCompany(ctx, arg)
}

func (r *Repository) DeleteCompany(ctx context.Context, arg db.DeleteCompanyParams) error {
	return r.q.DeleteCompany(ctx, arg)
}

func (r *Repository) GetCompanyByDocument(ctx context.Context, document pgtype.Text) (db.Company, error) {
	return r.q.GetCompanyByDocument(ctx, document)
}

func (r *Repository) GetCompanyByID(ctx context.Context, id pgtype.UUID) (db.Company, error) {
	return r.q.GetCompanyByID(ctx, id)
}

func (r *Repository) ListCompanies(ctx context.Context) ([]db.Company, error) {
	return r.q.ListCompanies(ctx)
}

func (r *Repository) SetCompanyStatus(ctx context.Context, arg db.SetCompanyStatusParams) (int64, error) {
	return r.q.SetCompanyStatus(ctx, arg)
}

func (r *Repository) UpdateCompany(ctx context.Context, arg db.UpdateCompanyParams) (db.Company, error) {
	return r.q.UpdateCompany(ctx, arg)
}
