-- name: CreateSale :one
INSERT INTO sales (
        customer_id,
        company_id,
        sale_at,
        discount_amount,
        subtotal,
        total_amount,
        created_by,
        status
    )
VALUES (
        $1,
        $2,
        CURRENT_DATE,
        $3,
        $4,
        $5,
        $6,
        'pending'
    )
RETURNING id;
-- name: ListSales :many
SELECT id,
    sale_at,
    total_amount,
    status,
    created_at
FROM sales
WHERE company_id = $1
    AND deleted_at IS NULL
ORDER BY created_at DESC;
-- name: GetSaleById :one
SELECT s.*,
    c.full_name as customer_name
FROM sales s
    INNER JOIN customers c ON s.customer_id = c.id
WHERE s.id = $1
    AND s.company_id = $2;
-- name: DeleteSale :exec
UPDATE sales
SET deleted_at = CURRENT_TIMESTAMP,
    deleted_by = $1
WHERE id = $2
    AND company_id = $3;
-- name: UpdateSaleStatus :exec
UPDATE sales
SET status = $1,
    updated_at = CURRENT_TIMESTAMP,
    updated_by = $2
WHERE id = $3
    AND company_id = $4;
-- name: ListSalesByCompanyAndStatus :many
SELECT s.id AS sale_id,
    s.total_amount,
    s.status,
    s.created_at AS sale_date,
    si.id AS item_id,
    si.product_id,
    si.quantity,
    si.unit_price,
    si.discount,
    p.name AS product_name
FROM sales s
    INNER JOIN sale_items si ON s.id = si.sale_id
    INNER JOIN products p ON si.product_id = p.id
WHERE s.company_id = $1
    AND (
        s.status = $2
        OR $2 = ''
    )
ORDER BY s.created_at DESC;