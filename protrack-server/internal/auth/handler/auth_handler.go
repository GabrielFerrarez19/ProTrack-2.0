package handler

import (
	"net/http"

	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/auth/adapters/jwt"
	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/auth/domain"
	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/auth/service"
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

func (h *Handler) Login(c *gin.Context) {
	var req domain.LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := h.service.Login(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	c.SetSameSite(http.SameSiteLaxMode)

	c.SetCookie(
		"access_token",
		response.AccessToken,
		int(response.ExpiresIn),
		"/",
		"",
		false, // alterar para true para produção
		true,
	)

	c.SetCookie(
		"refresh_token",
		response.RefreshToken,
		int(response.ExpiresIn),
		"/",
		"",
		false, // alterar para true para produção
		true,
	)

	c.JSON(http.StatusOK, response)
}

func (h *Handler) RefreshToken(c *gin.Context) {
	var req struct {
		RefreshToken string `json:"refresh_token" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := h.service.RefreshToken(c.Request.Context(), req.RefreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid refresh token"})
		return
	}

	c.SetCookie(
		"access_token",
		response.AccessToken,
		int(response.ExpiresIn),
		"/",
		"",
		false, // alterar para true para produção
		true,
	)

	c.SetCookie(
		"refresh_token",
		response.RefreshToken,
		int(response.ExpiresIn),
		"/",
		"",
		false, // alterar para true para produção
		true,
	)

	c.JSON(http.StatusOK, response)
}

/* func (h *Handler) Me(c *gin.Context){
	user, err := h.service.
} */

func (h *Handler) GetUserFromContext(c *gin.Context) {
	idAny, exists := c.Get("sub")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
		return
	}

	idStr, ok := idAny.(string)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error parse any to string"})
		return
	}

	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.service.GetUserFromContext(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user": user})
}
