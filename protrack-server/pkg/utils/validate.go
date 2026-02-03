package utils

import (
	"errors"
	"net/mail"
	"strings"
	"unicode"
)

func IsValidEmail(email string) bool {
	email = strings.TrimSpace(email)

	// Verifica comprimento
	if len(email) < 3 || len(email) > 254 {
		return false
	}

	// Usa o parser da stdlib do Go
	addr, err := mail.ParseAddress(email)
	if err != nil {
		return false
	}

	// Verifica se o endereço parseado é igual ao original (sem nome de exibição)
	return addr.Address == email
}

// ValidPassword valida se a senha do usuario tem mais de 8 caracteres
// E se contem letras e numeros
func ValidPassword(password string) error {
	if len(password) < 8 {
		return errors.New("password must be at least 8 characters long")
	}

	hasNumber := false
	hasLetter := false
	hasSpecialCharacter := false

	for _, c := range password {
		switch {
		case unicode.IsNumber(c):
			hasNumber = true
		case unicode.IsLetter(c):
			hasLetter = true
		case unicode.IsSymbol(c) || unicode.IsPunct(c):
			hasSpecialCharacter = true
		}
	}

	if !hasNumber || !hasLetter || !hasSpecialCharacter {
		return errors.New("password must contain at least one letter and one number and special Character")
	}

	return nil
}
