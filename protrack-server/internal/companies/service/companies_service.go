package service

import (
	"context"
	"errors"

	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/companies/domain"
	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/companies/repository"
	db "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/database/sqlc"
	pgconv "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/pkg/pgtype"
	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/pkg/utils"
	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/pkg/utils/assign"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

type RepositoryInterface interface {
	CreateCompany(ctx context.Context, arg db.CreateCompanyParams) (db.Company, error)
	DeleteCompany(ctx context.Context, arg db.DeleteCompanyParams) error
	GetCompanyByDocument(ctx context.Context, document pgtype.Text) (db.Company, error)
	GetCompanyByID(ctx context.Context, id pgtype.UUID) (db.Company, error)
	ListCompanies(ctx context.Context) ([]db.Company, error)
	SetCompanyStatus(ctx context.Context, arg db.SetCompanyStatusParams) (int64, error)
	UpdateCompany(ctx context.Context, arg db.UpdateCompanyParams) (db.Company, error)
}

type Service struct {
	repo RepositoryInterface
}

func NewService(repo *repository.Repository) *Service {
	return &Service{
		repo: repo,
	}
}

func (s *Service) CreateCompany(ctx context.Context, req domain.CreateCompanyParams) (domain.CompanyResponse, error) {
	docType, err := utils.ValidateDocument(req.Document)
	if err != nil {
		return domain.CompanyResponse{}, err
	}

	if !utils.IsValidEmail(req.Email) {
		return domain.CompanyResponse{}, errors.New("invalid email")
	}

	company, err := s.repo.CreateCompany(ctx, db.CreateCompanyParams{
		Name:                req.Name,
		TradeName:           pgconv.ParseStringToPgText(req.TradeName),
		Document:            pgconv.ParseStringToPgText(req.Document),
		DocumentType:        pgconv.ParseStringToPgText(docType),
		Email:               pgconv.ParseStringToPgText(req.Email),
		Phone:               pgconv.ParseStringToPgText(req.Phone),
		Website:             pgconv.ParseStringToPgText(req.Website),
		AddressStreet:       pgconv.ParseStringToPgText(req.AddressStreet),
		AddressNumber:       pgconv.ParseStringToPgText(req.AddressNumber),
		AddressComplement:   pgconv.ParseStringToPgText(req.AddressComplement),
		AddressNeighborhood: pgconv.ParseStringToPgText(req.AddressNeighborhood),
		AddressCity:         pgconv.ParseStringToPgText(req.AddressCity),
		AddressState:        pgconv.ParseStringToPgText(req.AddressState),
		AddressZipcode:      pgconv.ParseStringToPgText(req.AddressZipcode),
		AddressCountry:      pgconv.ParseStringToPgText(req.AddressCountry),
		Timezone:            pgconv.ParseStringToPgText(req.Timezone),
		CreatedBy:           pgconv.ParseUUIDToPgType(req.CreatedBy),
		UpdatedBy:           pgconv.ParseUUIDToPgType(req.UpdatedBy),
		DeletedBy:           pgconv.ParseUUIDToPgType(req.DeletedBy),
	})

	return domain.CompanyResponse{
		ID:                  pgconv.PgUUIDToUUID(company.ID),
		Name:                company.Name,
		TradeName:           pgconv.ParsePgTextToString(company.TradeName),
		Document:            pgconv.ParsePgTextToString(company.Document),
		DocumentType:        pgconv.ParsePgTextToString(company.DocumentType),
		Email:               pgconv.ParsePgTextToString(company.Email),
		Phone:               pgconv.ParsePgTextToString(company.Phone),
		Website:             pgconv.ParsePgTextToString(company.Website),
		AddressStreet:       pgconv.ParsePgTextToString(company.AddressStreet),
		AddressNumber:       pgconv.ParsePgTextToString(company.AddressNumber),
		AddressComplement:   pgconv.ParsePgTextToString(company.AddressComplement),
		AddressNeighborhood: pgconv.ParsePgTextToString(company.AddressNeighborhood),
		AddressCity:         pgconv.ParsePgTextToString(company.AddressCity),
		AddressState:        pgconv.ParsePgTextToString(company.AddressState),
		AddressZipcode:      pgconv.ParsePgTextToString(company.AddressZipcode),
		AddressCountry:      pgconv.ParsePgTextToString(company.AddressCountry),
		Status:              company.Status,
		CreatedBy:           pgconv.PgUUIDToUUID(company.CreatedBy),
		CreatedAt:           pgconv.PgTimestamptzToTime(company.CreatedAt),
	}, nil
}

func (s *Service) DeleteCompany(ctx context.Context, req domain.DeleteCompanyParams) error {
	return s.repo.DeleteCompany(ctx, db.DeleteCompanyParams{
		ID:        pgconv.ParseUUIDToPgType(req.ID),
		DeletedBy: pgconv.ParseUUIDToPgType(req.DeletedBy),
	})
}

func (s *Service) GetCompanyByDocument(ctx context.Context, document string) (domain.CompanyResponse, error) {
	_, err := utils.ValidateDocument(document)
	if err != nil {
		return domain.CompanyResponse{}, err
	}

	company, err := s.repo.GetCompanyByDocument(ctx, pgconv.ParseStringToPgText(document))
	if err != nil {
		return domain.CompanyResponse{}, err
	}

	return domain.CompanyResponse{
		ID:                  pgconv.PgUUIDToUUID(company.ID),
		Name:                company.Name,
		TradeName:           pgconv.ParsePgTextToString(company.TradeName),
		Document:            pgconv.ParsePgTextToString(company.Document),
		DocumentType:        pgconv.ParsePgTextToString(company.DocumentType),
		Email:               pgconv.ParsePgTextToString(company.Email),
		Phone:               pgconv.ParsePgTextToString(company.Phone),
		Website:             pgconv.ParsePgTextToString(company.Website),
		AddressStreet:       pgconv.ParsePgTextToString(company.AddressStreet),
		AddressNumber:       pgconv.ParsePgTextToString(company.AddressNumber),
		AddressComplement:   pgconv.ParsePgTextToString(company.AddressComplement),
		AddressNeighborhood: pgconv.ParsePgTextToString(company.AddressNeighborhood),
		AddressCity:         pgconv.ParsePgTextToString(company.AddressCity),
		AddressState:        pgconv.ParsePgTextToString(company.AddressState),
		AddressZipcode:      pgconv.ParsePgTextToString(company.AddressZipcode),
		AddressCountry:      pgconv.ParsePgTextToString(company.AddressCountry),
		Status:              company.Status,
		CreatedBy:           pgconv.PgUUIDToUUID(company.CreatedBy),
		UpdatedBy:           pgconv.PgUUIDToUUID(company.UpdatedBy),
		DeletedBy:           pgconv.PgUUIDToUUID(company.DeletedBy),
		CreatedAt:           pgconv.PgTimestamptzToTime(company.CreatedAt),
		UpdatedAt:           pgconv.PgTimestamptzToTime(company.UpdatedAt),
		DeletedAt:           pgconv.PgTimestamptzToTime(company.DeletedAt),
	}, nil
}

func (s *Service) GetCompanyByID(ctx context.Context, id uuid.UUID) (domain.CompanyResponse, error) {
	company, err := s.repo.GetCompanyByID(ctx, pgconv.ParseUUIDToPgType(id))
	if err != nil {
		return domain.CompanyResponse{}, err
	}

	return domain.CompanyResponse{
		ID:                  pgconv.PgUUIDToUUID(company.ID),
		Name:                company.Name,
		TradeName:           pgconv.ParsePgTextToString(company.TradeName),
		Document:            pgconv.ParsePgTextToString(company.Document),
		DocumentType:        pgconv.ParsePgTextToString(company.DocumentType),
		Email:               pgconv.ParsePgTextToString(company.Email),
		Phone:               pgconv.ParsePgTextToString(company.Phone),
		Website:             pgconv.ParsePgTextToString(company.Website),
		AddressStreet:       pgconv.ParsePgTextToString(company.AddressStreet),
		AddressNumber:       pgconv.ParsePgTextToString(company.AddressNumber),
		AddressComplement:   pgconv.ParsePgTextToString(company.AddressComplement),
		AddressNeighborhood: pgconv.ParsePgTextToString(company.AddressNeighborhood),
		AddressCity:         pgconv.ParsePgTextToString(company.AddressCity),
		AddressState:        pgconv.ParsePgTextToString(company.AddressState),
		AddressZipcode:      pgconv.ParsePgTextToString(company.AddressZipcode),
		AddressCountry:      pgconv.ParsePgTextToString(company.AddressCountry),
		Status:              company.Status,
		CreatedBy:           pgconv.PgUUIDToUUID(company.CreatedBy),
		UpdatedBy:           pgconv.PgUUIDToUUID(company.UpdatedBy),
		DeletedBy:           pgconv.PgUUIDToUUID(company.DeletedBy),
		CreatedAt:           pgconv.PgTimestamptzToTime(company.CreatedAt),
		UpdatedAt:           pgconv.PgTimestamptzToTime(company.UpdatedAt),
		DeletedAt:           pgconv.PgTimestamptzToTime(company.DeletedAt),
	}, nil
}

func (s *Service) ListCompanies(ctx context.Context) ([]domain.CompanyResponse, error) {
	companies, err := s.repo.ListCompanies(ctx)
	if err != nil {
		return []domain.CompanyResponse{}, err
	}

	var response []domain.CompanyResponse

	for _, company := range companies {
		response = append(response, domain.CompanyResponse{
			ID:                  pgconv.PgUUIDToUUID(company.ID),
			Name:                company.Name,
			TradeName:           pgconv.ParsePgTextToString(company.TradeName),
			Document:            pgconv.ParsePgTextToString(company.Document),
			DocumentType:        pgconv.ParsePgTextToString(company.DocumentType),
			Email:               pgconv.ParsePgTextToString(company.Email),
			Phone:               pgconv.ParsePgTextToString(company.Phone),
			Website:             pgconv.ParsePgTextToString(company.Website),
			AddressStreet:       pgconv.ParsePgTextToString(company.AddressStreet),
			AddressNumber:       pgconv.ParsePgTextToString(company.AddressNumber),
			AddressComplement:   pgconv.ParsePgTextToString(company.AddressComplement),
			AddressNeighborhood: pgconv.ParsePgTextToString(company.AddressNeighborhood),
			AddressCity:         pgconv.ParsePgTextToString(company.AddressCity),
			AddressState:        pgconv.ParsePgTextToString(company.AddressState),
			AddressZipcode:      pgconv.ParsePgTextToString(company.AddressZipcode),
			AddressCountry:      pgconv.ParsePgTextToString(company.AddressCountry),
			Status:              company.Status,
			CreatedBy:           pgconv.PgUUIDToUUID(company.CreatedBy),
			UpdatedBy:           pgconv.PgUUIDToUUID(company.UpdatedBy),
			DeletedBy:           pgconv.PgUUIDToUUID(company.DeletedBy),
			CreatedAt:           pgconv.PgTimestamptzToTime(company.CreatedAt),
			UpdatedAt:           pgconv.PgTimestamptzToTime(company.UpdatedAt),
			DeletedAt:           pgconv.PgTimestamptzToTime(company.DeletedAt),
		})
	}

	return response, nil
}

func (s *Service) SetCompanyStatus(ctx context.Context, req domain.SetCompanyStatusParams) (int64, error) {
	count, err := s.repo.SetCompanyStatus(ctx, db.SetCompanyStatusParams{
		ID:     pgconv.ParseUUIDToPgType(req.ID),
		Status: req.Status,
	})
	if err != nil {
		return 0, err
	}

	return count, nil
}

func (s *Service) UpdateCompany(ctx context.Context, id uuid.UUID, req domain.UpdateCompanyParams) (domain.CompanyResponse, error) {
	currentCompany, err := s.repo.GetCompanyByID(ctx, pgconv.ParseUUIDToPgType(id))
	if err != nil {
		return domain.CompanyResponse{}, err
	}

	assign.SetIfNotEmpty(&currentCompany.Name, req.Name)
	assign.SetPgTextIfNotEmpty(&currentCompany.TradeName, req.TradeName)
	assign.SetPgTextIfNotEmpty(&currentCompany.Document, req.Document)
	assign.SetPgTextIfNotEmpty(&currentCompany.DocumentType, req.DocumentType)
	assign.SetPgTextIfNotEmpty(&currentCompany.Email, req.Email)
	assign.SetPgTextIfNotEmpty(&currentCompany.Phone, req.Phone)
	assign.SetPgTextIfNotEmpty(&currentCompany.Website, req.Website)
	assign.SetPgTextIfNotEmpty(&currentCompany.AddressStreet, req.AddressStreet)
	assign.SetPgTextIfNotEmpty(&currentCompany.AddressNumber, req.AddressNumber)
	assign.SetPgTextIfNotEmpty(&currentCompany.AddressComplement, req.AddressComplement)
	assign.SetPgTextIfNotEmpty(&currentCompany.AddressNeighborhood, req.AddressNeighborhood)
	assign.SetPgTextIfNotEmpty(&currentCompany.AddressCity, req.AddressCity)
	assign.SetPgTextIfNotEmpty(&currentCompany.AddressState, req.AddressState)
	assign.SetPgTextIfNotEmpty(&currentCompany.AddressZipcode, req.AddressZipcode)
	assign.SetPgTextIfNotEmpty(&currentCompany.AddressCountry, req.AddressCountry)
	assign.SetPgTextIfNotEmpty(&currentCompany.Timezone, req.Timezone)

	company, err := s.repo.UpdateCompany(ctx, db.UpdateCompanyParams{
		Name:                currentCompany.Name,
		TradeName:           currentCompany.TradeName,
		Document:            currentCompany.Document,
		DocumentType:        currentCompany.DocumentType,
		Email:               currentCompany.Email,
		Phone:               currentCompany.Phone,
		Website:             currentCompany.Website,
		AddressStreet:       currentCompany.AddressStreet,
		AddressNumber:       currentCompany.AddressNumber,
		AddressComplement:   currentCompany.AddressComplement,
		AddressNeighborhood: currentCompany.AddressNeighborhood,
		AddressCity:         currentCompany.AddressCity,
		AddressState:        currentCompany.AddressState,
		AddressZipcode:      currentCompany.AddressZipcode,
		AddressCountry:      currentCompany.AddressCountry,
		Timezone:            currentCompany.Timezone,
	})

	return domain.CompanyResponse{
		ID:                  pgconv.PgUUIDToUUID(company.ID),
		Name:                company.Name,
		TradeName:           pgconv.ParsePgTextToString(company.TradeName),
		Document:            pgconv.ParsePgTextToString(company.Document),
		DocumentType:        pgconv.ParsePgTextToString(company.DocumentType),
		Email:               pgconv.ParsePgTextToString(company.Email),
		Phone:               pgconv.ParsePgTextToString(company.Phone),
		Website:             pgconv.ParsePgTextToString(company.Website),
		AddressStreet:       pgconv.ParsePgTextToString(company.AddressStreet),
		AddressNumber:       pgconv.ParsePgTextToString(company.AddressNumber),
		AddressComplement:   pgconv.ParsePgTextToString(company.AddressComplement),
		AddressNeighborhood: pgconv.ParsePgTextToString(company.AddressNeighborhood),
		AddressCity:         pgconv.ParsePgTextToString(company.AddressCity),
		AddressState:        pgconv.ParsePgTextToString(company.AddressState),
		AddressZipcode:      pgconv.ParsePgTextToString(company.AddressZipcode),
		AddressCountry:      pgconv.ParsePgTextToString(company.AddressCountry),
		UpdatedBy:           pgconv.PgUUIDToUUID(company.UpdatedBy),
		UpdatedAt:           pgconv.PgTimestamptzToTime(company.UpdatedAt),
	}, nil
}
