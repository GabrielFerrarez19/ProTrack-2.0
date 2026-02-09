package handler

import "github.com/gin-gonic/gin"

func (h *Handler) RegisterRoutes(r *gin.RouterGroup) {
	category := r.Group("/products-categories")
	{
		category.POST("/", h.CreateProductCategory)
		category.DELETE("/:id", h.DeleteProductCategory)
		category.GET("/:id", h.GetProductCategoryById)
		category.GET("/list/company/:companyId", h.ListProductCategoryByCompanyId)
		category.PUT("/status/", h.SetProductCategoryStatus)
		category.PUT("/:id", h.UpdateProductCategory)
	}
}
