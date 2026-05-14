package service

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/config"
	"github.com/GabrielFerrarez19/ProTrack-2.0/protrack-server/internal/whatsapp/domain"
	"github.com/google/uuid"
)



type Service struct {
	cfg *config.Config
}


func NewService(cfg *config.Config) *Service {
	return &Service{
		cfg: cfg,
	}
}



func (s *Service) CreateInstance(ctx context.Context, req domain.CreateInstanceRequest,companyID uuid.UUID) (string, error) {
	url := fmt.Sprintf("%s/instance/create", s.cfg.EvolutionApiUrl)
	



	payload := map[string]any{
		"instance_name": req.InstanceName,
		"integration":   req.Integration,
		"token":         companyID.String(),
		"qr_code":       req.QrCode,
	}

	jsonPayload, _ := json.Marshal(payload)

	request, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonPayload))
	if err != nil {
		return "", err
	}

	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("apikey",  s.cfg.EvolutionKey)

	client := &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		return "", err
	}
	defer response.Body.Close()

	body, _ := io.ReadAll(response.Body)
	if response.StatusCode != http.StatusOK  && response.StatusCode != http.StatusCreated {
		return "", fmt.Errorf("failed to create instance: %s", body)
	}

	var result domain.EvolutionResponse

	if err := json.Unmarshal(body, &result); err != nil {
		return "", err
	}
	
	return result.QRCode.Base64, nil
}