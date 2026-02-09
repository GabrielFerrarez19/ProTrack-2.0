package handler

import "github.com/gin-gonic/gin"

func (h *Handler) RegisterRoute(r *gin.RouterGroup) {
	product := r.Group("/product")
	{
		product.POST("", h.CreateProduct)
		product.DELETE("/:id", h.DeleteProduct)
		product.GET("/barcode/:barcode", h.GetProductByBarcode)
		product.GET("/:id", h.GetProductById)
		product.GET("/category", h.ListProductsByCategoryId)
		product.GET("/company/:companyId", h.ListProductsByCompany)
		product.PUT("/:id", h.UpdateProduct)
	}
}
