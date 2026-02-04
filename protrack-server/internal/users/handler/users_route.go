package handler

import "github.com/gin-gonic/gin"

func (h *Handler) RegisterRoutes(r *gin.RouterGroup) {
	users := r.Group("/users")
	{
		users.POST("", h.CreateUser)
		users.DELETE("/:id", h.DeleteUser)
		users.GET("/email/:email", h.GetUserByEmail)
		users.GET("/:id", h.GetUserById)
		users.PUT("/password", h.UpdatePasswordHash)
		users.PUT("/:id", h.UpdateUser)
	}
}
