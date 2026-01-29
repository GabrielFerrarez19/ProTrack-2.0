-- Schema ProTrack para PostgreSQL
-- Banco criado via POSTGRES_DB no Docker; scripts em docker-entrypoint-initdb.d rodam no banco padrão.
-- =======================
-- TIPOS ENUM (criação condicional para permitir reexecução)
-- =======================
DO $$ BEGIN CREATE TYPE user_status_enum AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED');
EXCEPTION
WHEN duplicate_object THEN NULL;
END $$;
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
-- =======================
-- TABELA USERS
-- =======================
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  username VARCHAR(50) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'USER',
  status user_status_enum NOT NULL DEFAULT 'ACTIVE',
  company_id BIGINT NULL,
  department_id BIGINT NULL,
  last_login_at TIMESTAMP NULL,
  created_by BIGINT NULL,
  updated_by BIGINT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER users_updated_at BEFORE
UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
INSERT INTO users (
    name,
    email,
    password_hash,
    username,
    role,
    status,
    created_at
  )
VALUES (
    'Gabriel Ferrarez',
    'gabriel@example.com',
    '$2b$10$dbbAkbWW0DrPFxLQQjE8R.EHB7z7j/LHqYLtNAaSQr465iPl14yki',
    'gabriel',
    'admin',
    'ACTIVE',
    '2025-07-30 17:50:52'
  ) ON CONFLICT (email) DO NOTHING;
-- =======================
-- TABELA PRODUTOS
-- =======================
CREATE TABLE IF NOT EXISTS produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  categoria VARCHAR(100),
  codigo_barras VARCHAR(50),
  quantidade INT DEFAULT 0,
  tamanho VARCHAR(50),
  preco_custo DECIMAL(10, 2),
  preco_venda DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO produtos (
    nome,
    descricao,
    categoria,
    codigo_barras,
    quantidade,
    tamanho,
    preco_custo,
    preco_venda
  )
VALUES (
    'Camiseta Básica',
    'Camiseta 100% algodão',
    'Vestuário',
    '789123456001',
    50,
    'M',
    20.00,
    39.90
  ),
  (
    'Calça Jeans Slim',
    'Calça jeans masculina',
    'Vestuário',
    '789123456002',
    30,
    '42',
    60.00,
    129.90
  ),
  (
    'Tênis Esportivo',
    'Tênis para corrida',
    'Calçados',
    '789123456003',
    20,
    '41',
    90.00,
    199.90
  ),
  (
    'Jaqueta Corta-Vento',
    'Jaqueta leve impermeável',
    'Vestuário',
    '789123456004',
    15,
    'G',
    80.00,
    179.90
  ),
  (
    'Mochila Escolar',
    'Mochila com compartimento para notebook',
    'Acessórios',
    '789123456005',
    25,
    'Único',
    50.00,
    99.90
  ),
  (
    'Relógio Digital',
    'Relógio com cronômetro e iluminação',
    'Acessórios',
    '789123456006',
    10,
    'Único',
    30.00,
    79.90
  ),
  (
    'Camisa Social',
    'Camisa social manga longa',
    'Vestuário',
    '789123456007',
    40,
    'M',
    35.00,
    69.90
  ),
  (
    'Sandália Feminina',
    'Sandália rasteira confortável',
    'Calçados',
    '789123456008',
    18,
    '37',
    25.00,
    59.90
  ),
  (
    'Boné Trucker',
    'Boné com tela traseira',
    'Acessórios',
    '789123456009',
    22,
    'Único',
    12.00,
    34.90
  ),
  (
    'Calça Moletom',
    'Calça de moletom com bolsos',
    'Vestuário',
    '789123456010',
    28,
    'G',
    40.00,
    89.90
  ),
  (
    'Óculos de Sol',
    'Óculos com proteção UV',
    'Acessórios',
    '789123456011',
    15,
    'Único',
    20.00,
    49.90
  ),
  (
    'Tênis Casual',
    'Tênis estilo casual urbano',
    'Calçados',
    '789123456012',
    12,
    '40',
    85.00,
    179.90
  ),
  (
    'Vestido Floral',
    'Vestido com estampa floral',
    'Vestuário',
    '789123456013',
    35,
    'P',
    45.00,
    99.90
  ),
  (
    'Chinelo Slide',
    'Chinelo estilo slide',
    'Calçados',
    '789123456014',
    40,
    '39',
    18.00,
    39.90
  ),
  (
    'Camisa Polo',
    'Camisa polo masculina',
    'Vestuário',
    '789123456015',
    32,
    'G',
    28.00,
    59.90
  );
-- =======================
-- TABELA CLIENTES
-- =======================
CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  data_nascimento DATE NOT NULL,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  rg VARCHAR(20),
  estado_civil VARCHAR(20),
  sexo sexo_enum,
  telefone_whatsapp VARCHAR(20),
  telefone_celular VARCHAR(20),
  telefone_residencial VARCHAR(20),
  email VARCHAR(100) NOT NULL,
  cep VARCHAR(10),
  endereco VARCHAR(100),
  numero VARCHAR(10),
  complemento VARCHAR(50),
  bairro VARCHAR(50),
  cidade VARCHAR(50),
  valor_a_pagar DECIMAL(10, 2) DEFAULT 0,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO clientes (
    nome,
    data_nascimento,
    cpf,
    rg,
    estado_civil,
    sexo,
    telefone_whatsapp,
    telefone_celular,
    telefone_residencial,
    email,
    cep,
    endereco,
    numero,
    complemento,
    bairro,
    cidade
  )
VALUES (
    'Ana Beatriz Silva',
    '1990-05-12',
    '123.456.789-00',
    'MG-12.345.678',
    'Solteira',
    'Feminino',
    '31999998888',
    '31988887777',
    '31333334444',
    'ana.silva@email.com',
    '30140-110',
    'Rua das Flores',
    '123',
    'Apto 202',
    'Savassi',
    'Belo Horizonte'
  ),
  (
    'Carlos Eduardo Lima',
    '1985-11-23',
    '987.654.321-00',
    'SP-98.765.432',
    'Casado',
    'Masculino',
    '11999995555',
    '11988886666',
    '11333332222',
    'carlos.lima@email.com',
    '04567-000',
    'Av. Paulista',
    '456',
    '',
    'Bela Vista',
    'São Paulo'
  ),
  (
    'Fernanda Souza',
    '1993-07-08',
    '321.654.987-00',
    'RJ-32.165.498',
    'Solteira',
    'Feminino',
    '21999994444',
    '21888883333',
    '21333331111',
    'fernanda.souza@email.com',
    '22041-001',
    'Rua Barata Ribeiro',
    '789',
    'Cobertura',
    'Copacabana',
    'Rio de Janeiro'
  ),
  (
    'João Pedro Martins',
    '1978-03-15',
    '456.789.123-00',
    'RS-45.678.912',
    'Divorciado',
    'Masculino',
    '51999993333',
    '51888882222',
    '51333330000',
    'joao.martins@email.com',
    '90010-000',
    'Rua dos Andradas',
    '321',
    '',
    'Centro',
    'Porto Alegre'
  ),
  (
    'Mariana Costa',
    '2000-09-30',
    '789.123.456-00',
    'BA-78.912.345',
    'Solteira',
    'Feminino',
    '71999992222',
    '71888881111',
    '71333339999',
    'mariana.costa@email.com',
    '40100-000',
    'Av. Sete de Setembro',
    '654',
    'Casa',
    'Campo Grande',
    'Salvador'
  ),
  (
    'Lucas Almeida',
    '1995-01-20',
    '159.753.486-00',
    'PR-15.975.348',
    'Casado',
    'Masculino',
    '41999991111',
    '41888880000',
    '41333338888',
    'lucas.almeida@email.com',
    '80010-000',
    'Rua XV de Novembro',
    '987',
    '',
    'Centro',
    'Curitiba'
  ),
  (
    'Patrícia Ramos',
    '1988-06-05',
    '258.369.147-00',
    'PE-25.836.914',
    'Viúva',
    'Feminino',
    '81999990000',
    '81888887777',
    '81333336666',
    'patricia.ramos@email.com',
    '50010-000',
    'Rua da Aurora',
    '741',
    'Apto 101',
    'Boa Vista',
    'Recife'
  ),
  (
    'Rafael Torres',
    '1992-12-18',
    '369.258.147-00',
    'CE-36.925.814',
    'Solteiro',
    'Masculino',
    '85999998877',
    '85888886666',
    '85333335555',
    'rafael.torres@email.com',
    '60010-000',
    'Av. Beira Mar',
    '852',
    '',
    'Meireles',
    'Fortaleza'
  ),
  (
    'Juliana Mendes',
    '1983-04-27',
    '741.852.963-00',
    'DF-74.185.296',
    'Casada',
    'Feminino',
    '61999997766',
    '61888885555',
    '61333334444',
    'juliana.mendes@email.com',
    '70040-010',
    'SQS 308 Bloco A',
    '101',
    'Apto 301',
    'Asa Sul',
    'Brasília'
  ),
  (
    'Thiago Oliveira',
    '1998-08-14',
    '852.963.741-00',
    'GO-85.296.374',
    'Solteiro',
    'Masculino',
    '62999996655',
    '62888884444',
    '62333333333',
    'thiago.oliveira@email.com',
    '74000-000',
    'Rua 9',
    '369',
    '',
    'Setor Oeste',
    'Goiânia'
  ) ON CONFLICT (cpf) DO NOTHING;
-- =======================
-- TABELA VENDAS
-- =======================
CREATE TABLE IF NOT EXISTS vendas (
  id SERIAL PRIMARY KEY,
  cliente_id INT NOT NULL REFERENCES clientes(id),
  data_venda DATE NOT NULL,
  desconto DECIMAL(5, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  total_com_desconto DECIMAL(10, 2) NOT NULL,
  dias_vencimento INT DEFAULT NULL,
  forma_pagamento forma_pagamento_enum DEFAULT 'dinheiro',
  status venda_status_enum DEFAULT 'pendente',
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- =======================
-- TABELA ITENS_VENDA
-- =======================
CREATE TABLE IF NOT EXISTS itens_venda (
  id SERIAL PRIMARY KEY,
  venda_id INT NOT NULL REFERENCES vendas(id),
  produto_id INT NOT NULL REFERENCES produtos(id),
  quantidade INT NOT NULL,
  preco_unitario DECIMAL(10, 2) NOT NULL,
  desconto DECIMAL(5, 2) DEFAULT 0
);
-- =======================
-- TABELA METODOS_PAGAMENTO
-- =======================
CREATE TABLE IF NOT EXISTS metodos_pagamento (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  tipo metodo_tipo_enum NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE
);
INSERT INTO metodos_pagamento (nome, tipo, ativo)
VALUES ('Dinheiro em espécie', 'dinheiro', TRUE),
  ('Cartão de Crédito', 'cartao', TRUE),
  ('Cartão de Débito', 'cartao', TRUE),
  ('PIX', 'pix', TRUE),
  ('Transferência Bancária', 'transferencia', FALSE),
  ('À Prazo', 'aprazo', TRUE);
-- =======================
-- TABELA CATEGORIAS
-- =======================
CREATE TABLE IF NOT EXISTS categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  tipo categoria_tipo_enum NOT NULL,
  cor VARCHAR(7) DEFAULT '#FFFFFF',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER categorias_updated_at BEFORE
UPDATE ON categorias FOR EACH ROW EXECUTE FUNCTION update_updated_at();
INSERT INTO categorias (id, nome, tipo, cor)
VALUES (
    gen_random_uuid(),
    'Mercadoria',
    'despesa',
    '#FF6B6B'
  ),
  (
    gen_random_uuid(),
    'Utilidades',
    'despesa',
    '#4ECDC4'
  ),
  (
    gen_random_uuid(),
    'Tecnologia',
    'despesa',
    '#45B7D1'
  ),
  (
    gen_random_uuid(),
    'Financeiro',
    'despesa',
    '#96CEB4'
  ),
  (
    gen_random_uuid(),
    'Marketing',
    'despesa',
    '#FFEAA7'
  ),
  (
    gen_random_uuid(),
    'Transporte',
    'despesa',
    '#DDA0DD'
  ),
  (
    gen_random_uuid(),
    'Outros',
    'despesa',
    '#F8BBD9'
  );
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