package domain

import (
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
)

type CreateSaleRequest struct {
	CustomerID     uuid.UUID               `json:"customer_id"`
	CompanyID      uuid.UUID               `json:"company_id"`
	DiscountAmount float64                 `json:"discount_amount"`
	Subtotal       float64                 `json:"subtotal"`
	TotalAmount    float64                 `json:"total_amount"`
	DueDays        int32                   `json:"due_days"`
	CreatedBy      uuid.UUID               `json:"created_by"`
	PaymentMethod  interface{}             `json:"payment_method"`
	Status         interface{}             `json:"status"`
	Items          []CreateSaleItemRequest `json:"items"`
}

type CreateSaleItemRequest struct {
	SaleID    uuid.UUID `json:"sale_id"`
	ProductID uuid.UUID `json:"product_id"`
	Quantity  int32     `json:"quantity"`
	UnitPrice float64   `json:"unit_price"`
	Discount  float64   `json:"discount"`
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

type ListSalesByCompanyAndStatusRequest struct {
	CompanyID uuid.UUID `json:"company_id"`
	Status    string    `json:"status"`
}

type ListSalesByCompanyAndStatusRow struct {
	SaleID         uuid.UUID   `json:"sale_id"`
	TotalAmount    float64     `json:"total_amount"`
	DiscountAmount float64     `json:"discount_amount"`
	Status         interface{} `json:"status"`
	SaleDate       time.Time   `json:"sale_date"`
	ItemID         uuid.UUID   `json:"item_id"`
	ProductID      uuid.UUID   `json:"product_id"`
	Quantity       int32       `json:"quantity"`
	UnitPrice      float64     `json:"unit_price"`
	Discount       float64     `json:"discount"`
	ProductName    string      `json:"product_name"`
	CustomerName   string      `json:"customer_name"`
}

type GetSalesPerformanceSummaryRow struct {
	CurrentMonthCount   int64 `json:"current_month_count"`
	CurrentMonthRevenue int64 `json:"current_month_revenue"`
	LastMonthCount      int64 `json:"last_month_count"`
	LastMonthRevenue    int64 `json:"last_month_revenue"`
}

func ValidateCreateSaleRequest(req CreateSaleRequest) error {
	if req.CustomerID == uuid.Nil {
		return errors.New("customer_id is required")
	}
	if req.CompanyID == uuid.Nil {
		return errors.New("company_id is required")
	}
	if req.CreatedBy == uuid.Nil {
		return errors.New("created_by is required")
	}
	if len(req.Items) == 0 {
		return errors.New("the sale must have at least one item")
	}
	if req.DiscountAmount < 0 || req.Subtotal < 0 || req.TotalAmount < 0 {
		return errors.New("values cannot be negative")
	}
	for i, item := range req.Items {
		if item.ProductID == uuid.Nil {
			return fmt.Errorf("item[%d]: product_id is required", i)
		}
		if item.Quantity <= 0 {
			return fmt.Errorf("item[%d]: quantity must be greater than zero", i)
		}
		if item.UnitPrice < 0 || item.Discount < 0 {
			return fmt.Errorf("item[%d]: unit_price and discount cannot be negative", i)
		}
	}
	return nil
}
