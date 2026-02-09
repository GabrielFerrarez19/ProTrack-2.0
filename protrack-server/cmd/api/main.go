package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	companiesHandler "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/companies/handler"
	companiesRepository "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/companies/repository"
	companiesService "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/companies/service"
	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/config"
	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/database"
	departmentsHandler "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/departments/handler"
	departmentsRepository "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/departments/repository"
	departmentsService "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/departments/service"
	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/logger"
	productsHandler "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/products/handler"
	productsRepository "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/products/repository"
	productsService "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/products/service"
	productsCategoriesHandler "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/products_categories/handler"
	productsCategoriesRepository "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/products_categories/repository"
	productsCategoriesService "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/products_categories/service"
	usersHandler "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/users/handler"
	usersRepository "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/users/repository"
	usersService "github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/users/service"

	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	logger.InitLogger("development")

	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatal().Err(err).Msg("Error loading settings")
	}

	db, err := database.NewConnect(cfg)
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to connect to database")
	}
	defer db.Close()

	usersRepository := usersRepository.NewRepository(db.Pool)
	companiesRepository := companiesRepository.NewRepository(db.Pool)
	departmentsRepository := departmentsRepository.NewRepository(db.Pool)
	productsCategoriesRepository := productsCategoriesRepository.NewRepository(db.Pool)
	productsRepository := productsRepository.NewRepository(db.Pool)

	usersService := usersService.NewService(usersRepository)
	companiesService := companiesService.NewService(companiesRepository)
	departmentsService := departmentsService.NewService(departmentsRepository)
	productsCategoriesService := productsCategoriesService.NewService(productsCategoriesRepository)
	productsService := productsService.NewService(productsRepository)

	usersHandler := usersHandler.NewHandler(usersService)
	companiesHandler := companiesHandler.NewHandler(companiesService)
	departmentsHandler := departmentsHandler.NewHandler(departmentsService)
	productsCategoriesHandler := productsCategoriesHandler.NewHandler(productsCategoriesService)
	productsHandler := productsHandler.NewHandler(productsService)

	api := r.Group("/api/v1")
	usersHandler.RegisterRoutes(api)
	companiesHandler.RegisterRoutes(api)
	departmentsHandler.RegisterRoutes(api)
	productsCategoriesHandler.RegisterRoutes(api)
	productsHandler.RegisterRoute(api)

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	srv := &http.Server{
		Addr:    ":" + cfg.ApiPort,
		Handler: r,
	}

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)

	go func() {
		log.Info().Msgf("GoFinance running at the port %s", cfg.ApiPort)
		log.Info().Msgf("Data Base: %s@%s:%s/%s", cfg.DBUser, cfg.DBHost, cfg.DBPort, cfg.DBName)

		// ListenAndServe bloqueia até que o servidor seja fechado
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal().Err(err).Msg("Failed to start server")
		}
	}()

	<-sigChan
	log.Info().Msg("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal().Err(err).Msg("Server forced to shutdown")
	}

	log.Info().Msg("Server exited")
}
