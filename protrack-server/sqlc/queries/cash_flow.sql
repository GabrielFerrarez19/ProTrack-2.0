-- name: GetTotalInflowByPeriod :one
SELECT COALESCE(SUM(total_amount), 0)::FLOAT AS total_inflow
FROM sales
WHERE company_id = $1
    AND created_at BETWEEN $2 AND $3;
-- name: GetTotalOutflowByPeriod :one
SELECT COALESCE(SUM(amount_paid), 0)::FLOAT AS total_outflow
FROM bills_payable
WHERE company_id = $1
    AND status = 'paid'
    AND payment_date BETWEEN $2 AND $3;