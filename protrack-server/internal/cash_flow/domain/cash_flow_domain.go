package domain

import "time"

type CashFlowSummaryResponse struct {
	TotalInflow  float64 `json:"total_inflow"`
	TotalOutflow float64 `json:"total_outflow"`
	NetBalance   float64 `json:"net_balance"` // Inflow - Outflow
}

type CashFlowSummaryRequest struct {
	StartAt time.Time `form:"startAt" time_format:"2006-01-02T15:04:05Z07:00"`
	EndAt   time.Time `form:"endAt"   time_format:"2006-01-02T15:04:05Z07:00"`
}
