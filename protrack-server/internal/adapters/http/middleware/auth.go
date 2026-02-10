package middleware

import (
	"net/http"
	"strings"

	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/auth/adapters/jwt"
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
)

func AuthMiddleware(jwtManager *jwt.JWTManager) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Bearer token required"})
			c.Abort()
			return
		}

		claims, err := jwtManager.ValidateToken(tokenString)
		if err != nil {
			log.Error().Err(err).Msg("invalid token")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		c.Set("sub", claims.Subject)

		c.Next()
	}
}
