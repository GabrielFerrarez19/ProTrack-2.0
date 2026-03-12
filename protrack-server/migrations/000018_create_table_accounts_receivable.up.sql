CREATE TABLE IF NOT EXISTS accounts_receivable (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    customer_id UUID NOT NULL,
    sale_id UUID NOT NULL,
    -- Vínculo obrigatório com a venda que gerou a dívida
    -- Controle de Valores
    total_amount NUMERIC(10, 2) NOT NULL,
    -- Valor original da parcela ou venda
    balance NUMERIC(10, 2) NOT NULL,
    -- O que ainda falta pagar (ex: 400.00)
    -- Informações de Prazo
    due_date DATE NOT NULL,
    -- Data de vencimento
    installment_number INT DEFAULT 1,
    -- Ex: 1 (para parcela 1 de 3)
    total_installments INT DEFAULT 1,
    -- Ex: 3 (para parcela 1 de 3)
    -- Estados da Conta
    -- Sugestão de valores: 'pending', 'partial', 'paid', 'canceled'
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- Auditoria Básica
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID,
    deleted_at TIMESTAMPTZ,
    -- Chaves Estrangeiras
    CONSTRAINT fk_receivable_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    CONSTRAINT fk_receivable_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
    CONSTRAINT fk_receivable_sale FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE
);
-- Índices para performance em relatórios e buscas de cobrança
CREATE INDEX IF NOT EXISTS idx_receivable_customer ON accounts_receivable(customer_id);
CREATE INDEX IF NOT EXISTS idx_receivable_status ON accounts_receivable(status);
CREATE INDEX IF NOT EXISTS idx_receivable_due_date ON accounts_receivable(due_date);