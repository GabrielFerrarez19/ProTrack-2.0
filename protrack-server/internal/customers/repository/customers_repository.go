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

func (r *Repository) CreateCustomer(ctx context.Context, arg db.CreateCustomersParams) (pgtype.UUID, error) {
	q := db.New(r.db)
	return q.CreateCustomers(ctx, arg)
}

func (r *Repository) DeleteCustomer(ctx context.Context, arg db.DeleteCustomerParams) error {
	q := db.New(r.db)
	return q.DeleteCustomer(ctx, arg)
}

func (r *Repository) GetCustomerByCPF(ctx context.Context, cpf string) (db.Customer, error) {
	q := db.New(r.db)
	return q.GetCustomerByCPF(ctx, cpf)
}

func (r *Repository) GetCustomerById(ctx context.Context, id pgtype.UUID) (db.Customer, error) {
	q := db.New(r.db)
	return q.GetCustomerById(ctx, id)
}

func (r *Repository) ListCustomers(ctx context.Context, companyID pgtype.UUID) ([]db.Customer, error) {
	q := db.New(r.db)
	return q.ListCustomers(ctx, companyID)
}

func (r *Repository) UpdateBalanceDueCustomer(ctx context.Context, arg db.UpdateBalanceDueCustomerParams) error {
	q := db.New(r.db)
	return q.UpdateBalanceDueCustomer(ctx, arg)
}

func (r *Repository) UpdateCustomer(ctx context.Context, arg db.UpdateCustomerParams) error {
	q := db.New(r.db)
	return q.UpdateCustomer(ctx, arg)
}
