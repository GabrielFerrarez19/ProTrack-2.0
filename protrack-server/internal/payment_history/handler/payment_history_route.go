package handler

import "github.com/gin-gonic/gin"

func (h *Handler) RegisterRoute(r *gin.RouterGroup) {
	paymentHistory := r.Group("/payment-history")
	{
		paymentHistory.POST("", h.CreatePaymentHistory)
		paymentHistory.GET("", h.ListPaymentHistory)
		paymentHistory.GET("/customer/:customerId", h.GetPaymentsByCustomer)
		paymentHistory.GET("/sale/:saleId", h.GetPaymentsBySale)
		paymentHistory.GET("/total", h.GetTotalReceivedByPeriod)
	}
}
