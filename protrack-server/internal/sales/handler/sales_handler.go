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
		c.JSON(http.StatusUnauthorized, gin.H{"error": ""})
	}

	var req domain.CreateSaleRequest

	req.CompanyID = companyId

	req.CreatedBy = userId

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
}
