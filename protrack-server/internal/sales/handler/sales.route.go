package handler

import (
	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/adapters/http/middleware"
	"github.com/gin-gonic/gin"
)

func (h *Handler) RegisterRoute(r *gin.RouterGroup) {
	sales := r.Group("/sales").Use(middleware.AuthMiddleware(h.jwtManager, h.blacklist))
	{
		sales.POST("", h.CreateSale)
		sales.DELETE("/:id", h.DeleteSale)
		sales.GET("/:id", h.GetSaleById)
		sales.GET("/list/", h.ListSales)
		sales.GET("/list/company", h.ListSalesByCompanyAndStatus)
		sales.GET("/count", h.CountSales)
		sales.GET("/percentage", h.GetSalesPerformanceSummary)
		sales.GET("/total-amount", h.GetTotalAmountSummary)
		sales.GET("/total-pending", h.GetTotalAmountIsPending)
		sales.GET("/total-overdue", h.GetTotalAmountIsOverdue)
		sales.GET("/count/pending-overdue", h.ContSalesPendingAndOverdue)
		sales.GET("/completed", h.ListSalesWithInstallments)
	}
}
