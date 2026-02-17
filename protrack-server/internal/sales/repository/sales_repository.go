package repository

import (
	"context"

	db "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/database/sqlc"
	"github.com/jackc/pgx/v5/pgtype"
)

type Repository struct {
	db db.DBTX
}

func NewRepository(db db.DBTX) *Repository {
	return &Repository{
		db: db,
	}
}

func (r *Repository) CreateSales(ctx context.Context, arg db.CreateSaleParams) (pgtype.UUID, error) {
	q := db.New(r.db)
	return q.CreateSale(ctx, arg)
}

func (r *Repository) DeleteSales(ctx context.Context, arg db.DeleteSaleParams) error {
	q := db.New(r.db)
	return q.DeleteSale(ctx, arg)
}

func (r *Repository) GetSaleById(ctx context.Context, arg db.GetSaleByIdParams) (db.GetSaleByIdRow, error) {
	q := db.New(r.db)
	return q.GetSaleById(ctx, arg)
}

func (r *Repository) ListSales(ctx context.Context, companyId pgtype.UUID) ([]db.ListSalesRow, error) {
	q := db.New(r.db)
	return q.ListSales(ctx, companyId)
}

func (r *Repository) UpdateSaleStatus(ctx context.Context, arg db.UpdateSaleStatusParams) error {
	q := db.New(r.db)
	return q.UpdateSaleStatus(ctx, arg)
}
