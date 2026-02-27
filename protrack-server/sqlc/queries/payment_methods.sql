-- name: CreatePaymentMethod :exec
INSERT INTO payment_methods(
        company_id,
        name,
        type
    )
VALUES ($1, $2, $3);
-- name: TogglePaymentMethodActive :exec
UPDATE payment_methods
SET is_active = $2
WHERE id = $1;
-- name: ListPaymentMethodIsActive :many
SELECT *
FROM payment_methods
WHERE company_id = $1
    AND is_active = TRUE;
-- name: ListPaymentMethod :many
SELECT *
FROM payment_methods
WHERE company_id = $1;
-- name: GetPaymentMethodByID :one
SELECT *
FROM payment_methods
WHERE id = $1;