package domain

import (
	"time"

	"github.com/google/uuid"
)

type Company struct {
	ID                  uuid.UUID `json:"id"`
	Name                string    `json:"name"`
	TradeName           string    `json:"trade_name"`
	Document            string    `json:"document"`
	DocumentType        string    `json:"document_type"`
	Email               string    `json:"email"`
	Phone               string    `json:"phone"`
	Website             string    `json:"website"`
	AddressStreet       string    `json:"address_street"`
	AddressNumber       string    `json:"address_number"`
	AddressComplement   string    `json:"address_complement"`
	AddressNeighborhood string    `json:"address_neighborhood"`
	AddressCity         string    `json:"address_city"`
	AddressState        string    `json:"address_state"`
	AddressZipcode      string    `json:"address_zipcode"`
	AddressCountry      string    `json:"address_country"`
	Status              any       `json:"status"`
	Timezone            string    `json:"timezone"`
	CreatedBy           uuid.UUID `json:"created_by"`
	UpdatedBy           uuid.UUID `json:"updated_by"`
	DeletedBy           uuid.UUID `json:"deleted_by"`
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`
	DeletedAt           time.Time `json:"deleted_at"`
}

type CreateCompanyParams struct {
	Name                string    `json:"name"`
	TradeName           string    `json:"trade_name"`
	Document            string    `json:"document"`
	DocumentType        string    `json:"document_type"`
	Email               string    `json:"email"`
	Phone               string    `json:"phone"`
	Website             string    `json:"website"`
	AddressStreet       string    `json:"address_street"`
	AddressNumber       string    `json:"address_number"`
	AddressComplement   string    `json:"address_complement"`
	AddressNeighborhood string    `json:"address_neighborhood"`
	AddressCity         string    `json:"address_city"`
	AddressState        string    `json:"address_state"`
	AddressZipcode      string    `json:"address_zipcode"`
	AddressCountry      string    `json:"address_country"`
	Status              any       `json:"status"`
	Timezone            string    `json:"timezone"`
	CreatedBy           uuid.UUID `json:"created_by"`
	UpdatedBy           uuid.UUID `json:"updated_by"`
	DeletedBy           uuid.UUID `json:"deleted_by"`
}

type DeleteCompanyParams struct {
	ID        uuid.UUID `json:"id"`
	DeletedBy uuid.UUID `json:"deleted_by"`
}

type UpdateCompanyParams struct {
	ID                  uuid.UUID `json:"id"`
	Name                string    `json:"name"`
	TradeName           string    `json:"trade_name"`
	Document            string    `json:"document"`
	DocumentType        string    `json:"document_type"`
	Email               string    `json:"email"`
	Phone               string    `json:"phone"`
	Website             string    `json:"website"`
	AddressStreet       string    `json:"address_street"`
	AddressNumber       string    `json:"address_number"`
	AddressComplement   string    `json:"address_complement"`
	AddressNeighborhood string    `json:"address_neighborhood"`
	AddressCity         string    `json:"address_city"`
	AddressState        string    `json:"address_state"`
	AddressZipcode      string    `json:"address_zipcode"`
	AddressCountry      string    `json:"address_country"`
	Status              any       `json:"status"`
	Timezone            string    `json:"timezone"`
	UpdatedBy           uuid.UUID `json:"updated_by"`
}

type CompanyResponse struct {
	ID                  uuid.UUID `json:"id"`
	Name                string    `json:"name"`
	TradeName           string    `json:"trade_name"`
	Document            string    `json:"document"`
	DocumentType        string    `json:"document_type"`
	Email               string    `json:"email"`
	Phone               string    `json:"phone"`
	Website             string    `json:"website"`
	AddressStreet       string    `json:"address_street"`
	AddressNumber       string    `json:"address_number"`
	AddressComplement   string    `json:"address_complement"`
	AddressNeighborhood string    `json:"address_neighborhood"`
	AddressCity         string    `json:"address_city"`
	AddressState        string    `json:"address_state"`
	AddressZipcode      string    `json:"address_zipcode"`
	AddressCountry      string    `json:"address_country"`
	Status              any       `json:"status"`
	CreatedBy           uuid.UUID `json:"created_by"`
	UpdatedBy           uuid.UUID `json:"updated_by"`
	DeletedBy           uuid.UUID `json:"deleted_by"`
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`
	DeletedAt           time.Time `json:"deleted_at"`
}

type SetCompanyStatusParams struct {
	ID     uuid.UUID `json:"id"`
	Status any       `json:"status"`
}
