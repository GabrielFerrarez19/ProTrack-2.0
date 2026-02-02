package repository

import (
	"context"

	db "github.com/GabrielFerrarez19/ProTrack-2.0/internal/database/sqlc"
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

func (r *Repository) CreateUsers(ctx context.Context, arg db.CreateUserParams) (db.User, error) {
	return r.q.CreateUser(ctx, arg)
}

func (r *Repository) DeleteUser(ctx context.Context, id pgtype.UUID) error {
	return r.q.DeleteUser(ctx, id)
}

func (r *Repository) GetUserByEmail(ctx context.Context, email string) (db.User, error) {
	return r.q.GetUserByEmail(ctx, email)
}

func (r *Repository) GetUserById(ctx context.Context, id pgtype.UUID) (db.User, error) {
	return r.q.GetUserByID(ctx, id)
}

func (r *Repository) ListUsers(ctx context.Context) ([]db.User, error) {
	return r.q.ListUsers(ctx)
}

func (r *Repository) UpdatePasswordHash(ctx context.Context, arg db.UpdatePasswordHashParams) error {
	return r.q.UpdatePasswordHash(ctx, arg)
}

func (r *Repository) UpdateUser(ctx context.Context, arg db.UpdateUserParams) (db.User, error) {
	return r.q.UpdateUser(ctx, arg)
}
