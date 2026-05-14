package domain


type EvolutionResponse struct {
    Instance struct {
        InstanceName string `json:"instanceName"`
        Status       string `json:"status"`
    } `json:"instance"`
    QRCode struct {
        Base64 string `json:"base64"` // Este é o cara que você quer
        Code   string `json:"code"`   // Versão em texto do QR
    } `json:"qrcode"`
}

type CreateInstanceRequest struct {
	InstanceName string `json:"instance_name"`
	Integration string `json:"integration"`
	QrCode bool `json:"qr_code"`
}