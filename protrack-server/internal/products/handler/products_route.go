package handler

import (
	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/adapters/http/middleware"
	"github.com/gin-gonic/gin"
)

func (h *Handler) RegisterRoute(r *gin.RouterGroup) {
	product := r.Group("/product").Use(middleware.AuthMiddleware(h.jwtManager))
	{
		product.POST("", h.CreateProduct)
		product.DELETE("/:id", h.DeleteProduct)
		product.GET("/barcode/:barcode", h.GetProductByBarcode)
		product.GET("/category", h.ListProductsByCategoryId)
		product.GET("/company", h.ListProductsByCompany)
		product.GET("/:id", h.GetProductById)
		product.PUT("/:id", h.UpdateProduct)
	}
}
