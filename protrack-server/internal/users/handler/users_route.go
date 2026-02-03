package handler

import "github.com/gin-gonic/gin"

func (h *Handler) RegisterRoutes(c *gin.RouterGroup) {
	c.Group("/users")
	{
		c.POST("", h.CreateUser)
		c.DELETE("/:id", h.DeleteUser)
		c.GET("/email/:email", h.GetUserByEmail)
		c.GET("/:id", h.GetUserById)
		c.PUT("/password", h.UpdatePasswordHash)
		c.PUT("/:id", h.UpdateUser)
	}
}
