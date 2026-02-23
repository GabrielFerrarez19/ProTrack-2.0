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
-- name: ListProductsByCompany :many
SELECT p.*,
    c.name AS category_name
FROM products p
    INNER JOIN product_categories c ON p.category_id = c.id
WHERE p.company_id = $1
    AND p.deleted_at IS NULL;
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
-- name: DecrementStock :exec
UPDATE products
SET quantity = quantity - $1
WHERE id = $2
    AND quantity >= $1;
-- name: CountProducts :one
SELECT SUM(quantity)
FROM products
WHERE company_id = $1
    AND deleted_at IS NULL;
-- name: GetProductsPerformanceSummary :one
SELECT COALESCE(
        SUM(quantity) FILTER (
            WHERE date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE)
        ),
        0
    )::FLOAT AS current_month_qty,
    COALESCE(
        SUM(quantity) FILTER (
            WHERE date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
        ),
        0
    )::FLOAT AS last_month_qty
FROM products
WHERE company_id = $1
    AND deleted_at IS NULL
    AND created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month');
-- name: GetCostTotalStock :one
SELECT COALESCE(SUM(cost_price * quantity), 0)::FLOAT AS total_stock_value
FROM products
WHERE company_id = $1
    AND deleted_at IS NULL
    AND quantity > 0;