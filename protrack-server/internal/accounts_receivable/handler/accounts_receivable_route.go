package handler

import "github.com/gin-gonic/gin"

func (h *Handler) RegisterRoute(r *gin.RouterGroup) {
	accountsReceivable := r.Group("/accounts-receivable")
	{
		accountsReceivable.GET("", h.GetCustomerDebtSummary)
		accountsReceivable.GET("/list", h.ListOverdueReceivables)
		accountsReceivable.GET("/customer/:customerId", h.GetPendingReceivablesByCustomer)
		accountsReceivable.GET("/sale/:saleId", h.GetReceivablesBySale)
	}
}
