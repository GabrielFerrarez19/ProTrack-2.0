package handler

import "github.com/gin-gonic/gin"

func (h *Handler) RegisterRoute(r *gin.RouterGroup) {
	cashFlow := r.Group("/cash-flow")
	{
		cashFlow.GET("", h.CashFlowSummary)
	}
}
