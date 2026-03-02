-- Schema ProTrack para PostgreSQL
-- Banco criado via POSTGRES_DB no Docker; scripts em docker-entrypoint-initdb.d rodam no banco padrão.
-- =======================
-- TIPOS ENUM (criação condicional para permitir reexecução)
-- =======================
DO $$ BEGIN CREATE TYPE sexo_enum AS ENUM ('Masculino', 'Feminino', 'Outro');
EXCEPTION
WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN CREATE TYPE forma_pagamento_enum AS ENUM (
  'dinheiro',
  'cartao',
  'pix',
  'transferencia',
  'aprazo'
);
EXCEPTION
WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN CREATE TYPE venda_status_enum AS ENUM ('pendente', 'pago', 'cancelado', 'vencido');
EXCEPTION
WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN CREATE TYPE metodo_tipo_enum AS ENUM (
  'dinheiro',
  'cartao',
  'pix',
  'transferencia',
  'outro',
  'aprazo'
);
EXCEPTION
WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN CREATE TYPE categoria_tipo_enum AS ENUM ('receita', 'despesa');
EXCEPTION
WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN CREATE TYPE conta_status_enum AS ENUM ('pendente', 'pago', 'vencido', 'agendado');
EXCEPTION
WHEN duplicate_object THEN NULL;
END $$;
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER users_updated_at BEFORE
UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER categorias_updated_at BEFORE
UPDATE ON categorias FOR EACH ROW EXECUTE FUNCTION update_updated_at();
-- =======================
-- TABELA FORNECEDORES
-- =======================
CREATE TABLE IF NOT EXISTS fornecedores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(200) NOT NULL,
  cnpj VARCHAR(18),
  email VARCHAR(100),
  telefone VARCHAR(20),
  endereco TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER fornecedores_updated_at BEFORE
UPDATE ON fornecedores FOR EACH ROW EXECUTE FUNCTION update_updated_at();
INSERT INTO fornecedores (id, nome, cnpj, email, telefone, endereco)
VALUES (
    gen_random_uuid(),
    'Fornecedor ABC Ltda',
    '12.345.678/0001-90',
    'contato@abc.com',
    '(11) 99999-9999',
    'Rua das Flores, 123 - São Paulo/SP'
  ),
  (
    gen_random_uuid(),
    'Energia Elétrica SA',
    '98.765.432/0001-10',
    'fatura@energia.com',
    '(11) 88888-8888',
    'Av. Paulista, 1000 - São Paulo/SP'
  ),
  (
    gen_random_uuid(),
    'Internet Provider',
    '11.222.333/0001-44',
    'suporte@internet.com',
    '(11) 77777-7777',
    'Rua Augusta, 500 - São Paulo/SP'
  ),
  (
    gen_random_uuid(),
    'Distribuidora XYZ',
    '55.666.777/0001-88',
    'vendas@xyz.com',
    '(11) 66666-6666',
    'Rua Consolação, 200 - São Paulo/SP'
  ),
  (
    gen_random_uuid(),
    'Banco Central',
    '00.000.000/0001-91',
    'atendimento@banco.com',
    '(11) 55555-5555',
    'SBS Quadra 3 - Brasília/DF'
  );
-- =======================
-- TABELA CONTAS_PAGAR
-- =======================
CREATE TABLE IF NOT EXISTS contas_pagar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fornecedor_id UUID REFERENCES fornecedores(id),
  fornecedor_nome VARCHAR(200) NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  data_vencimento DATE NOT NULL,
  status conta_status_enum DEFAULT 'pendente',
  categoria_id UUID REFERENCES categorias(id),
  descricao TEXT,
  data_agendamento DATE,
  data_pagamento DATE,
  valor_pago DECIMAL(10, 2),
  forma_pagamento VARCHAR(50),
  observacoes TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER contas_pagar_updated_at BEFORE
UPDATE ON contas_pagar FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE INDEX idx_contas_pagar_status ON contas_pagar(status);
CREATE INDEX idx_contas_pagar_vencimento ON contas_pagar(data_vencimento);
CREATE INDEX idx_contas_pagar_fornecedor ON contas_pagar(fornecedor_id);
CREATE INDEX idx_contas_pagar_categoria ON contas_pagar(categoria_id);
-- Exemplos de contas a pagar (inserir após categorias existirem)
INSERT INTO contas_pagar (
    fornecedor_nome,
    valor,
    data_vencimento,
    status,
    categoria_id,
    descricao
  )
SELECT 'Fornecedor ABC Ltda',
  3500.00,
  '2024-12-15',
  'vencido',
  c.id,
  'Compra de estoque'
FROM categorias c
WHERE c.nome = 'Mercadoria'
LIMIT 1;
INSERT INTO contas_pagar (
    fornecedor_nome,
    valor,
    data_vencimento,
    status,
    categoria_id,
    descricao
  )
SELECT 'Energia Elétrica SA',
  850.75,
  '2024-12-20',
  'pendente',
  c.id,
  'Conta de luz'
FROM categorias c
WHERE c.nome = 'Utilidades'
LIMIT 1;
INSERT INTO contas_pagar (
    fornecedor_nome,
    valor,
    data_vencimento,
    status,
    categoria_id,
    descricao,
    data_agendamento
  )
SELECT 'Internet Provider',
  199.90,
  '2024-12-25',
  'agendado',
  c.id,
  'Internet empresarial',
  '2024-12-24'
FROM categorias c
WHERE c.nome = 'Tecnologia'
LIMIT 1;
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