package config

import (
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string

	ApiPort string

	SecretKey string
}

func LoadConfig() (*Config, error) {
	// Carrega o arquivo .env
	_ = godotenv.Load(".env")

	config := &Config{
		DBHost:     getEnv("DB_HOST"),
		DBPort:     getEnv("DB_PORT"),
		DBUser:     getEnv("DB_USER"),
		DBPassword: getEnv("DB_PASSWORD"),
		DBName:     getEnv("DB_NAME"),
		ApiPort:    getEnv("API_PORT"),
		SecretKey:  getEnv("JWT_SECRET"),
	}

	return config, nil
}

// getEnv obtém o valor de uma variável de ambiente
// Se a variavel não existir ou estiver vazia, retorna um valor padrão
func getEnv(key string) string {
	if value := os.Getenv(key); value != "" {
		// Remove espaços em branco no início e fim
		value = strings.TrimSpace(value)
		if value != "" {
			return value
		}
	}

	return ""
}
