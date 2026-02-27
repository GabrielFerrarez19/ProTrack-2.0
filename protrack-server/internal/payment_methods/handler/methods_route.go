package handler

import "github.com/gin-gonic/gin"

func (h *Handler) RegisterRoutes(r *gin.RouterGroup) {
	methods := r.Group("/payment-methods")
	{
		methods.POST("", h.CreatePaymentMethod)
		methods.GET("/:id", h.GetPaymentMethodById)
		methods.GET("/", h.ListPaymentMethod)
		methods.GET("/is-active", h.ListPaymentMethodIsActive)
		methods.PUT("/:id", h.TogglePaymentMethodActive)
	}
}
