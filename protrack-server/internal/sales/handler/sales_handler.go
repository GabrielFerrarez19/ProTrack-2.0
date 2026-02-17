package handler

import (
	"net/http"

	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/auth/adapters/jwt"
	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/sales/domain"
	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/sales/service"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Handler struct {
	service    *service.Service
	jwtManager *jwt.JWTManager
}

func NewHandler(service *service.Service, jwtManager *jwt.JWTManager) *Handler {
	return &Handler{
		service:    service,
		jwtManager: jwtManager,
	}
}

func (h *Handler) CreateSale(c *gin.Context) {
	companyIdAny, exists := c.Get("company_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "company_id is null"})
	}

	companyId := companyIdAny.(uuid.UUID)

	userIdAny, exists := c.Get("sub")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "sub is null"})
	}

	userIdStr := userIdAny.(string)

	userId, err := uuid.Parse(userIdStr)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user_id is null"})
	}

	var req domain.CreateSaleRequest

	req.CompanyID = companyId

	req.CreatedBy = userId

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
}

func (h *Handler) DeleteSale(c *gin.Context) {
	companyIdAny, exists := c.Get("company_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "company_id is null"})
	}

	companyId := companyIdAny.(uuid.UUID)

	userIdAny, exists := c.Get("sub")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "sub is null"})
	}

	userIdStr := userIdAny.(string)

	userId, err := uuid.Parse(userIdStr)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user_id is null"})
	}

	idStr := c.Param("id")

	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var req domain.DeleteSaleRequest

	req.CompanyID = companyId

	req.DeletedBy = userId

	if err := h.service.DeleteSale(c.Request.Context(), id ,req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)

}

func (h *Handler) GetSaleById(c *gin.Context){
	idStr := c.Param("id")

	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	companyIdAny, exists := c.Get("company_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "company_id is null"})
	}

	companyId := companyIdAny.(uuid.UUID)

	var req domain.GetSaleByIdRequest

	req.CompanyID = companyId

	req.ID = id

	sale, err := h.service.GetSaleById(c.Request.Context(), req )
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"sale": sale})
}

func (h *Handler) ListSales(c *gin.Context){
	companyIdAny, exists := c.Get("company_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "company_id is null"})
	}

	companyId := companyIdAny.(uuid.UUID)


	sales, err := h.service.ListSales(c.Request.Context(), companyId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"sales": sales})
}

func (h *Handler) UpdateSaleStatus(c *gin.Context){
	idStr := c.Param("id")

	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	companyIdAny, exists := c.Get("company_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "company_id is null"})
	}

	companyId := companyIdAny.(uuid.UUID)

	userIdAny, exists := c.Get("sub")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "sub is null"})
	}

	userIdStr := userIdAny.(string)

	userId, err := uuid.Parse(userIdStr)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user_id is null"})
	}


	var req domain.UpdateSaleStatusRequest

	req.CompanyID = companyId

	req.UpdatedBy = userId

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	if err := h.service.UpdateSaleStatus(c.Request.Context(), id, req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}

}