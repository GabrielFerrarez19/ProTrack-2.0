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

func (r *Repository) CreateProduct(ctx context.Context, arg db.CreateProductParams) (db.Product, error) {
	return r.q.CreateProduct(ctx, arg)
}

func (r *Repository) DeleteProduct(ctx context.Context, arg db.DeleteProductParams) error {
	return r.q.DeleteProduct(ctx, arg)
}

func (r *Repository) GetProductByBarcode(ctx context.Context, barcode pgtype.Text) (db.Product, error) {
	return r.q.GetProductByBarcode(ctx, barcode)
}

func (r *Repository) GetProductById(ctx context.Context, id pgtype.UUID) (db.Product, error) {
	return r.q.GetProductById(ctx, id)
}

func (r *Repository) ListProductsByCategoryId(ctx context.Context, arg db.ListProductsByCategoryIdParams) ([]db.Product, error) {
	return r.q.ListProductsByCategoryId(ctx, arg)
}

func (r *Repository) ListProductsByCompany(ctx context.Context, categoryID pgtype.UUID) ([]db.ListProductsByCompanyRow, error) {
	return r.q.ListProductsByCompany(ctx, categoryID)
}

func (r *Repository) UpdateProduct(ctx context.Context, arg db.UpdateProductParams) (db.Product, error) {
	return r.q.UpdateProduct(ctx, arg)
}
