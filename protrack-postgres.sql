-- =======================
-- TABELA HISTORICO_PAGAMENTOS
-- =======================
CREATE TABLE IF NOT EXISTS historico_pagamentos (
  id SERIAL PRIMARY KEY,
  cliente_id INT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  venda_id INT REFERENCES vendas(id) ON DELETE
  SET NULL,
    valor_pago DECIMAL(10, 2) NOT NULL,
    data_pagamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observacoes TEXT
);
CREATE INDEX idx_historico_cliente ON historico_pagamentos(cliente_id);
CREATE INDEX idx_historico_venda ON historico_pagamentos(venda_id);
CREATE INDEX idx_historico_data ON historico_pagamentos(data_pagamento);