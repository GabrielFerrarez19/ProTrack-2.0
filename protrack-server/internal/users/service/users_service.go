package service

import (
	"context"
	"errors"
	"fmt"

	db "github.com/GabrielFerrarez19/ProTrack-2.0/internal/database/sqlc"
	"github.com/GabrielFerrarez19/ProTrack-2.0/internal/users/domain"
	"github.com/GabrielFerrarez19/ProTrack-2.0/internal/users/repository"
	pgconv "github.com/GabrielFerrarez19/ProTrack-2.0/pkg/pgtype"
	"github.com/GabrielFerrarez19/ProTrack-2.0/pkg/utils"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
)

type RepositoryInterface interface {
	CreateUsers(ctx context.Context, arg db.CreateUserParams) (db.User, error)
	DeleteUser(ctx context.Context, id pgtype.UUID) error
	GetUserByEmail(ctx context.Context, email string) (db.User, error)
	GetUserById(ctx context.Context, id pgtype.UUID) (db.User, error)
	ListUsers(ctx context.Context) ([]db.User, error)
	UpdatePasswordHash(ctx context.Context, arg db.UpdatePasswordHashParams) error
	UpdateUser(ctx context.Context, arg db.UpdateUserParams) (db.User, error)
}

type Service struct {
	repo RepositoryInterface
}

func NewService(repo *repository.Repository) *Service {
	return &Service{
		repo: repo,
	}
}

func (s *Service) CreateUser(ctx context.Context, req domain.CreateUserParams) (domain.UserResponse, error) {
	if err := utils.ValidPassword(req.PasswordHash); err != nil {
		return domain.UserResponse{}, err
	}

	is := utils.IsValidEmail(req.Email)
	if is == false {
		return domain.UserResponse{}, errors.New("invalid email")
	}

	user, err := s.repo.CreateUsers(ctx, db.CreateUserParams{
		Name:         req.Name,
		Email:        req.Email,
		Username:     pgconv.ParseStringToPgText(req.Username),
		PasswordHash: req.PasswordHash,
		Role:         req.Role,
		Status:       req.Status,
		CompanyID:    pgconv.ParseUUIDToPgType(req.CompanyID),
		DepartmentID: pgconv.ParseUUIDToPgType(req.DepartmentID),
		CreatedBy:    pgconv.ParseUUIDToPgType(req.CreatedBy),
		UpdatedBy:    pgconv.ParseUUIDToPgType(req.UpdatedBy),
		CreatedAt:    pgconv.TimeToPgTimestamp(req.CreatedAt),
	})
	if err != nil {
		return domain.UserResponse{}, err
	}

	return domain.UserResponse{
		ID:           pgconv.PgUUIDToUUID(user.ID),
		Name:         user.Name,
		Email:        user.Email,
		Username:     pgconv.ParsePgTextToString(user.Username),
		Role:         user.Role,
		Status:       user.Status,
		CompanyID:    pgconv.PgUUIDToUUID(user.CompanyID),
		DepartmentID: pgconv.PgUUIDToUUID(user.DepartmentID),
		LastLoginAt:  pgconv.PgTimestampToTime(user.LastLoginAt),
		CreatedBy:    pgconv.PgUUIDToUUID(user.CreatedBy),
		UpdatedBy:    pgconv.PgUUIDToUUID(user.UpdatedBy),
		DeletedBy:    pgconv.PgUUIDToUUID(user.DeletedBy),
		CreatedAt:    pgconv.PgTimestampToTime(user.CreatedAt),
		UpdatedAt:    pgconv.PgTimestampToTime(user.UpdatedAt),
		DeletedAt:    pgconv.PgTimestampToTime(user.DeletedAt),
	}, nil
}

func (s *Service) DeleteUser(ctx context.Context, id pgtype.UUID) error {
	return s.repo.DeleteUser(ctx, id)
}

func (s *Service) GetUserByEmail(ctx context.Context, email string) (domain.UserResponse, error) {
	user, err := s.repo.GetUserByEmail(ctx, email)
	if err != nil {
		return domain.UserResponse{}, err
	}

	return domain.UserResponse{
		ID:           pgconv.PgUUIDToUUID(user.ID),
		Name:         user.Name,
		Email:        user.Email,
		Username:     pgconv.ParsePgTextToString(user.Username),
		Role:         user.Role,
		Status:       user.Status,
		CompanyID:    pgconv.PgUUIDToUUID(user.CompanyID),
		DepartmentID: pgconv.PgUUIDToUUID(user.DepartmentID),
		LastLoginAt:  pgconv.PgTimestampToTime(user.LastLoginAt),
		CreatedBy:    pgconv.PgUUIDToUUID(user.CreatedBy),
		UpdatedBy:    pgconv.PgUUIDToUUID(user.UpdatedBy),
		DeletedBy:    pgconv.PgUUIDToUUID(user.DeletedBy),
		CreatedAt:    pgconv.PgTimestampToTime(user.CreatedAt),
		UpdatedAt:    pgconv.PgTimestampToTime(user.UpdatedAt),
		DeletedAt:    pgconv.PgTimestampToTime(user.DeletedAt),
	}, nil
}

func (s *Service) GetUserByID(ctx context.Context, id pgtype.UUID) (domain.UserResponse, error) {
	user, err := s.repo.GetUserById(ctx, id)
	if err != nil {
		return domain.UserResponse{}, err
	}

	return domain.UserResponse{
		ID:           pgconv.PgUUIDToUUID(user.ID),
		Name:         user.Name,
		Email:        user.Email,
		Username:     pgconv.ParsePgTextToString(user.Username),
		Role:         user.Role,
		Status:       user.Status,
		CompanyID:    pgconv.PgUUIDToUUID(user.CompanyID),
		DepartmentID: pgconv.PgUUIDToUUID(user.DepartmentID),
		LastLoginAt:  pgconv.PgTimestampToTime(user.LastLoginAt),
		CreatedBy:    pgconv.PgUUIDToUUID(user.CreatedBy),
		UpdatedBy:    pgconv.PgUUIDToUUID(user.UpdatedBy),
		DeletedBy:    pgconv.PgUUIDToUUID(user.DeletedBy),
		CreatedAt:    pgconv.PgTimestampToTime(user.CreatedAt),
		UpdatedAt:    pgconv.PgTimestampToTime(user.UpdatedAt),
		DeletedAt:    pgconv.PgTimestampToTime(user.DeletedAt),
	}, nil
}

func (s *Service) ListUsers(ctx context.Context) ([]domain.UserResponse, error) {
	users, err := s.repo.ListUsers(ctx)
	if err != nil {
		return []domain.UserResponse{}, err
	}

	var response []domain.UserResponse

	for _, user := range users {
		response = append(response, domain.UserResponse{
			ID:           pgconv.PgUUIDToUUID(user.ID),
			Name:         user.Name,
			Email:        user.Email,
			Username:     pgconv.ParsePgTextToString(user.Username),
			Role:         user.Role,
			Status:       user.Status,
			CompanyID:    pgconv.PgUUIDToUUID(user.CompanyID),
			DepartmentID: pgconv.PgUUIDToUUID(user.DepartmentID),
			LastLoginAt:  pgconv.PgTimestampToTime(user.LastLoginAt),
			CreatedBy:    pgconv.PgUUIDToUUID(user.CreatedBy),
			UpdatedBy:    pgconv.PgUUIDToUUID(user.UpdatedBy),
			DeletedBy:    pgconv.PgUUIDToUUID(user.DeletedBy),
			CreatedAt:    pgconv.PgTimestampToTime(user.CreatedAt),
			UpdatedAt:    pgconv.PgTimestampToTime(user.UpdatedAt),
			DeletedAt:    pgconv.PgTimestampToTime(user.DeletedAt),
		})
	}

	return response, nil
}

func (s *Service) UpdatePasswordHash(ctx context.Context, req domain.UpdatePasswordHashParams) error {
	if err := utils.ValidPassword(req.PasswordHash); err != nil {
		return err
	}

	return s.repo.UpdatePasswordHash(ctx, db.UpdatePasswordHashParams{
		ID:           pgconv.ParseUUIDToPgType(req.ID),
		PasswordHash: req.PasswordHash,
	})
}

func (s *Service) UpdateUser(ctx context.Context, id pgtype.UUID, req domain.UpdateUserParams) (domain.UserResponse, error) {
	user, err := s.repo.GetUserById(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return domain.UserResponse{}, fmt.Errorf("user not found")
		}
		return domain.UserResponse{}, err
	}

	if req.Email != "" {
		if !utils.IsValidEmail(req.Email) {
			return domain.UserResponse{}, errors.New("invalid email format")
		}
		existingUser, errEmail := s.repo.GetUserByEmail(ctx, req.Email)
		if errEmail == nil && existingUser.ID.Bytes != id.Bytes {
			return domain.UserResponse{}, fmt.Errorf("email already in use")
		}
	}

	arg := db.UpdateUserParams{
		ID:           id,
		Name:         user.Name,
		Email:        user.Email,
		Username:     user.Username,
		Role:         user.Role,
		Status:       user.Status,
		DepartmentID: user.DepartmentID,
		UpdatedBy:    user.UpdatedBy,
	}
	if req.Name != "" {
		arg.Name = req.Name
	}
	if req.Email != "" {
		arg.Email = req.Email
	}
	if req.Username != "" {
		arg.Username = pgconv.ParseStringToPgText(req.Username)
	}
	if req.Role != "" {
		arg.Role = req.Role
	}
	if req.Status != nil {
		arg.Status = req.Status
	}
	if req.DepartmentID != (uuid.UUID{}) {
		arg.DepartmentID = pgconv.ParseUUIDToPgType(req.DepartmentID)
	}
	if req.UpdatedBy != (uuid.UUID{}) {
		arg.UpdatedBy = pgconv.ParseUUIDToPgType(req.UpdatedBy)
	}

	updatedUser, err := s.repo.UpdateUser(ctx, arg)
	if err != nil {
		return domain.UserResponse{}, fmt.Errorf("failed to update user: %w", err)
	}

	return domain.UserResponse{
		ID:           pgconv.PgUUIDToUUID(updatedUser.ID),
		Name:         updatedUser.Name,
		Email:        updatedUser.Email,
		Username:     pgconv.ParsePgTextToString(updatedUser.Username),
		Role:         updatedUser.Role,
		Status:       updatedUser.Status,
		CompanyID:    pgconv.PgUUIDToUUID(updatedUser.CompanyID),
		DepartmentID: pgconv.PgUUIDToUUID(updatedUser.DepartmentID),
		LastLoginAt:  pgconv.PgTimestampToTime(updatedUser.LastLoginAt),
		CreatedBy:    pgconv.PgUUIDToUUID(updatedUser.CreatedBy),
		UpdatedBy:    pgconv.PgUUIDToUUID(updatedUser.UpdatedBy),
		DeletedBy:    pgconv.PgUUIDToUUID(updatedUser.DeletedBy),
		CreatedAt:    pgconv.PgTimestampToTime(updatedUser.CreatedAt),
		UpdatedAt:    pgconv.PgTimestampToTime(updatedUser.UpdatedAt),
		DeletedAt:    pgconv.PgTimestampToTime(updatedUser.DeletedAt),
	}, nil
}
