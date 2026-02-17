CREATE TABLE IF NOT EXISTS sales (
  -- Identificadores (UUID)
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL, 
  company_id UUID NOT NULL,
  
  -- Informações da Venda
  -- Mudei para TIMESTAMPTZ para registrar hora exata da transação
  sale_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 
  discount_amount NUMERIC(10, 2) DEFAULT 0.00,
  subtotal NUMERIC(10, 2) NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  
  -- Regras de Negócio
  due_days INT DEFAULT NULL,
  payment_method payment_method_enum DEFAULT 'cash',
  status account_status_enum DEFAULT 'pending', 

  -- Auditoria (Traceability) usando TIMESTAMPTZ
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID DEFAULT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  deleted_by UUID DEFAULT NULL,

  -- Constraints
  CONSTRAINT fk_sale_customer 
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
  
  CONSTRAINT fk_sale_company 
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);