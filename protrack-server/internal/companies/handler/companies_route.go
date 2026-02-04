package handler

import "github.com/gin-gonic/gin"

func (h *Handler) RegisterRoutes(r *gin.RouterGroup) {
	companies := r.Group("/companies")
	{
		companies.POST("/", h.CreateCompany)
		companies.DELETE("/:id", h.DeleteCompany)
		companies.GET("/document/:document", h.GetCompanyByDocument)
		companies.GET("/:id", h.GetCompanyByID)
		companies.GET("", h.ListCompanies)
		companies.POST("/set/", h.SetCompanyStatus)
		companies.PUT("/:id", h.UpdateCompany)
	}
}
