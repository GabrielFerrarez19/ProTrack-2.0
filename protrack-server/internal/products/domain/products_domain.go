package domain

import (
	"time"

	pgconv "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/adapters/pgtype"
	db "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/database/sqlc"
	"github.com/google/uuid"
)

type Product struct {
	ID          uuid.UUID `json:"id"`
	CompanyID   uuid.UUID `json:"company_id"`
	CategoryID  uuid.UUID `json:"category_id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Barcode     string    `json:"barcode"`
	Quantity    int32     `json:"quantity"`
	Size        string    `json:"size"`
	CostPrice   float64   `json:"cost_price"`
	SalePrice   float64   `json:"sale_price"`
	CreatedBy   uuid.UUID `json:"created_by"`
	UpdatedBy   uuid.UUID `json:"updated_by"`
	DeletedBy   uuid.UUID `json:"deleted_by"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	DeletedAt   time.Time `json:"deleted_at"`
}

type CreateProductRequest struct {
	CompanyID   uuid.UUID `json:"company_id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CategoryID  uuid.UUID `json:"category_id"`
	Barcode     string    `json:"barcode"`
	Quantity    int32     `json:"quantity"`
	Size        string    `json:"size"`
	CostPrice   float64   `json:"cost_price"`
	SalePrice   float64   `json:"sale_price"`
	CreatedBy   uuid.UUID `json:"created_by"`
}

type DeleteProductRequest struct {
	ID        uuid.UUID `json:"id"`
	DeletedBy uuid.UUID `json:"deleted_by"`
}

type ListProductsByCategoryIdRequest struct {
	CategoryID uuid.UUID `json:"category_id"`
	CompanyID  uuid.UUID `json:"company_id"`
}

type UpdateProductRequest struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CategoryID  uuid.UUID `json:"category_id"`
	Barcode     string    `json:"barcode"`
	Quantity    int32     `json:"quantity"`
	Size        string    `json:"size"`
	CostPrice   float64   `json:"cost_price"`
	SalePrice   float64   `json:"sale_price"`
	UpdatedBy   uuid.UUID `json:"updated_by"`
}

type ProductResponse struct {
	ID          uuid.UUID `json:"id"`
	CompanyID   uuid.UUID `json:"company_id"`
	CategoryID  uuid.UUID `json:"category_id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Barcode     string    `json:"barcode"`
	Quantity    int32     `json:"quantity"`
	Size        string    `json:"size"`
	CostPrice   float64   `json:"cost_price"`
	SalePrice   float64   `json:"sale_price"`
	CreatedBy   uuid.UUID `json:"created_by"`
	UpdatedBy   uuid.UUID `json:"updated_by"`
	DeletedBy   uuid.UUID `json:"deleted_by"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	DeletedAt   time.Time `json:"deleted_at"`
}

type ListProductsByCompanyRow struct {
	ID           uuid.UUID `json:"id"`
	CompanyID    uuid.UUID `json:"company_id"`
	CategoryID   uuid.UUID `json:"category_id"`
	Name         string    `json:"name"`
	Description  string    `json:"description"`
	Barcode      string    `json:"barcode"`
	Quantity     int32     `json:"quantity"`
	Size         string    `json:"size"`
	CostPrice    float64   `json:"cost_price"`
	SalePrice    float64   `json:"sale_price"`
	CreatedBy    uuid.UUID `json:"created_by"`
	UpdatedBy    uuid.UUID `json:"updated_by"`
	DeletedBy    uuid.UUID `json:"deleted_by"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	DeletedAt    time.Time `json:"deleted_at"`
	CategoryName string    `json:"category_name"`
}

type DecrementStockRequest struct {
	ID       uuid.UUID `json:"id"`
	Quantity int32     `json:"quantity"`
}

type GetTop5BestSellingProductsRow struct {
	ID                uuid.UUID `json:"id"`
	Name              string    `json:"name"`
	TotalQuantitySold int32     `json:"total_quantity_sold"`
}

func ApplyUpdateProductCategoryParams(
	req UpdateProductRequest,
	arg *db.UpdateProductParams,
) {
	if req.Name != "" {
		arg.Name = req.Name
	}

	if req.Description != "" {
		arg.Description = pgconv.ParseStringToPgText(req.Description)
	}

	if req.CategoryID != uuid.Nil {
		arg.CategoryID = pgconv.ParseUUIDToPgType(req.CategoryID)
	}

	if req.Barcode != "" {
		arg.Barcode = pgconv.ParseStringToPgText(req.Barcode)
	}

	if req.Quantity != 0 {
		arg.Quantity = req.Quantity
	}

	if req.Size != "" {
		arg.Size = pgconv.ParseStringToPgText(req.Size)
	}

	if req.CostPrice != 0 {
		arg.CostPrice = pgconv.Float64ToPgNumeric(req.CostPrice)
	}

	if req.SalePrice != 0 {
		arg.SalePrice = pgconv.Float64ToPgNumeric(req.SalePrice)
	}

	if req.UpdatedBy != uuid.Nil {
		arg.UpdatedBy = pgconv.ParseUUIDToPgType(req.UpdatedBy)
	}
}
