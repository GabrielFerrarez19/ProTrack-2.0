package domain

import (
	"time"

	"github.com/google/uuid"
)

type CreateSaleRequest struct {
	CustomerID     uuid.UUID `json:"customer_id"`
	CompanyID      uuid.UUID `json:"company_id"`
	DiscountAmount float64   `json:"discount_amount"`
	Subtotal       float64   `json:"subtotal"`
	TotalAmount    float64   `json:"total_amount"`
	CreatedBy      uuid.UUID `json:"created_by"`
}

type DeleteSaleRequest struct {
	DeletedBy uuid.UUID `json:"deleted_by"`
	ID        uuid.UUID `json:"id"`
	CompanyID uuid.UUID `json:"company_id"`
}

type GetSaleByIdRequest struct {
	ID        uuid.UUID `json:"id"`
	CompanyID uuid.UUID `json:"company_id"`
}

type GetSaleByIdRow struct {
	ID             uuid.UUID   `json:"id"`
	CustomerID     uuid.UUID   `json:"customer_id"`
	CompanyID      uuid.UUID   `json:"company_id"`
	SaleAt         time.Time   `json:"sale_at"`
	DiscountAmount float64     `json:"discount_amount"`
	Subtotal       float64     `json:"subtotal"`
	TotalAmount    float64     `json:"total_amount"`
	DueDays        int32       `json:"due_days"`
	PaymentMethod  interface{} `json:"payment_method"`
	Status         interface{} `json:"status"`
	CreatedAt      time.Time   `json:"created_at"`
	CreatedBy      uuid.UUID   `json:"created_by"`
	UpdatedAt      time.Time   `json:"updated_at"`
	UpdatedBy      uuid.UUID   `json:"updated_by"`
	DeletedAt      time.Time   `json:"deleted_at"`
	DeletedBy      uuid.UUID   `json:"deleted_by"`
	CustomerName   string      `json:"customer_name"`
}

type ListSalesRow struct {
	ID          uuid.UUID   `json:"id"`
	SaleAt      time.Time   `json:"sale_date"`
	TotalAmount float64     `json:"total_amount"`
	Status      interface{} `json:"status"`
	CreatedAt   time.Time   `json:"created_at"`
}

type UpdateSaleStatusRequest struct {
	Status    interface{} `json:"status"`
	UpdatedBy uuid.UUID   `json:"updated_by"`
	ID        uuid.UUID   `json:"id"`
	CompanyID uuid.UUID   `json:"company_id"`
}
