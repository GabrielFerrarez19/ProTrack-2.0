-- name: CreateProduct :one
INSERT INTO products(
        company_id,
        name,
        description,
        category_id,
        barcode,
        quantity,
        size,
        cost_price,
        sale_price,
        created_by
    )
VALUES(
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10
    )
RETURNING *;
-- name: GetProductById :one
SELECT *
FROM products
WHERE id = $1
    AND deleted_at IS NULL;
-- name: GetProductByBarcode :one
SELECT *
FROM products
WHERE barcode = $1
    AND deleted_at IS NULL;
-- name: ListProductsByCompany :one
SELECT *
FROM products
WHERE category_id = $1
    AND deleted_at IS NULL;
-- name: ListProductsByCategoryId :many
SELECT *
FROM products
WHERE category_id = $1
    AND company_id = $2
    AND deleted_at IS NULL;
-- name: UpdateProduct :one
UPDATE products
SET name = $2,
    description = $3,
    category_id = $4,
    barcode = $5,
    quantity = $6,
    size = $7,
    cost_price = $8,
    sale_price = $9,
    updated_by = $10,
    updated_at = NOW()
WHERE id = $1
    AND deleted_at IS NULL
RETURNING *;
-- name: DeleteProduct :exec
UPDATE products
SET deleted_by = $2,
    deleted_at = NOW()
WHERE id = $1;