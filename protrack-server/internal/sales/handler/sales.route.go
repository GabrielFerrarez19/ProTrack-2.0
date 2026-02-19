package handler

import (
	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/adapters/http/middleware"
	"github.com/gin-gonic/gin"
)

func (h *Handler) RegisterRoute(r *gin.RouterGroup) {
	sales := r.Group("/sales").Use(middleware.AuthMiddleware(h.jwtManager))
	{
		sales.POST("", h.CreateSale)
		sales.DELETE("/:id", h.DeleteSale)
		sales.GET("/:id", h.GetSaleById)
		sales.GET("/list/", h.ListSales)
		sales.PUT("/status/:id", h.UpdateSaleStatus)
		sales.GET("/list/company", h.ListSalesByCompanyAndStatus)
		sales.GET("/count", h.CountSales)
	}
}
