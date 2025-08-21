use protrack

CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (id, name, email, password, created_at)
VALUES (8, 'Gabriel Ferrarez', 'gabriel@example.com', '123456', '2025-07-30 17:50:52');

CREATE TABLE produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  categoria VARCHAR(100),
  codigo_barras VARCHAR(50),
  quantidade INT DEFAULT 0,
  tamanho VARCHAR(50),
  preco_custo DECIMAL(10,2),
  preco_venda DECIMAL(10,2)
);

ALTER TABLE produtos
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

INSERT INTO produtos (nome, descricao, categoria, codigo_barras, quantidade, tamanho, preco_custo, preco_venda)
VALUES 
('Camiseta Básica', 'Camiseta 100% algodão', 'Vestuário', '789123456001', 50, 'M', 20.00, 39.90),
('Calça Jeans Slim', 'Calça jeans masculina', 'Vestuário', '789123456002', 30, '42', 60.00, 129.90),
('Tênis Esportivo', 'Tênis para corrida', 'Calçados', '789123456003', 20, '41', 90.00, 199.90),
('Jaqueta Corta-Vento', 'Jaqueta leve impermeável', 'Vestuário', '789123456004', 15, 'G', 80.00, 179.90),
('Mochila Escolar', 'Mochila com compartimento para notebook', 'Acessórios', '789123456005', 25, 'Único', 50.00, 99.90),
('Relógio Digital', 'Relógio com cronômetro e iluminação', 'Acessórios', '789123456006', 10, 'Único', 30.00, 79.90),
('Camisa Social', 'Camisa social manga longa', 'Vestuário', '789123456007', 40, 'M', 35.00, 69.90),
('Sandália Feminina', 'Sandália rasteira confortável', 'Calçados', '789123456008', 18, '37', 25.00, 59.90),
('Boné Trucker', 'Boné com tela traseira', 'Acessórios', '789123456009', 22, 'Único', 12.00, 34.90),
('Calça Moletom', 'Calça de moletom com bolsos', 'Vestuário', '789123456010', 28, 'G', 40.00, 89.90),
('Óculos de Sol', 'Óculos com proteção UV', 'Acessórios', '789123456011', 15, 'Único', 20.00, 49.90),
('Tênis Casual', 'Tênis estilo casual urbano', 'Calçados', '789123456012', 12, '40', 85.00, 179.90),
('Vestido Floral', 'Vestido com estampa floral', 'Vestuário', '789123456013', 35, 'P', 45.00, 99.90),
('Chinelo Slide', 'Chinelo estilo slide', 'Calçados', '789123456014', 40, '39', 18.00, 39.90),
('Camisa Polo', 'Camisa polo masculina', 'Vestuário', '789123456015', 32, 'G', 28.00, 59.90);

CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  data_nascimento DATE NOT NULL,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  rg VARCHAR(20),
  estado_civil VARCHAR(20),
  sexo ENUM('Masculino', 'Feminino', 'Outro'),
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
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE clientes
ADD COLUMN valor_a_pagar DECIMAL(10,2) DEFAULT 0;

INSERT INTO clientes (nome, data_nascimento, cpf, rg, estado_civil, sexo, telefone_whatsapp, telefone_celular, telefone_residencial, email, cep, endereco, numero, complemento, bairro, cidade)
VALUES 
('Ana Beatriz Silva', '1990-05-12', '123.456.789-00', 'MG-12.345.678', 'Solteira', 'Feminino', '31999998888', '31988887777', '31333334444', 'ana.silva@email.com', '30140-110', 'Rua das Flores', '123', 'Apto 202', 'Savassi', 'Belo Horizonte'),
('Carlos Eduardo Lima', '1985-11-23', '987.654.321-00', 'SP-98.765.432', 'Casado', 'Masculino', '11999995555', '11988886666', '11333332222', 'carlos.lima@email.com', '04567-000', 'Av. Paulista', '456', '', 'Bela Vista', 'São Paulo'),
('Fernanda Souza', '1993-07-08', '321.654.987-00', 'RJ-32.165.498', 'Solteira', 'Feminino', '21999994444', '21888883333', '21333331111', 'fernanda.souza@email.com', '22041-001', 'Rua Barata Ribeiro', '789', 'Cobertura', 'Copacabana', 'Rio de Janeiro'),
('João Pedro Martins', '1978-03-15', '456.789.123-00', 'RS-45.678.912', 'Divorciado', 'Masculino', '51999993333', '51888882222', '51333330000', 'joao.martins@email.com', '90010-000', 'Rua dos Andradas', '321', '', 'Centro', 'Porto Alegre'),
('Mariana Costa', '2000-09-30', '789.123.456-00', 'BA-78.912.345', 'Solteira', 'Feminino', '71999992222', '71888881111', '71333339999', 'mariana.costa@email.com', '40100-000', 'Av. Sete de Setembro', '654', 'Casa', 'Campo Grande', 'Salvador'),
('Lucas Almeida', '1995-01-20', '159.753.486-00', 'PR-15.975.348', 'Casado', 'Masculino', '41999991111', '41888880000', '41333338888', 'lucas.almeida@email.com', '80010-000', 'Rua XV de Novembro', '987', '', 'Centro', 'Curitiba'),
('Patrícia Ramos', '1988-06-05', '258.369.147-00', 'PE-25.836.914', 'Viúva', 'Feminino', '81999990000', '81888887777', '81333336666', 'patricia.ramos@email.com', '50010-000', 'Rua da Aurora', '741', 'Apto 101', 'Boa Vista', 'Recife'),
('Rafael Torres', '1992-12-18', '369.258.147-00', 'CE-36.925.814', 'Solteiro', 'Masculino', '85999998877', '85888886666', '85333335555', 'rafael.torres@email.com', '60010-000', 'Av. Beira Mar', '852', '', 'Meireles', 'Fortaleza'),
('Juliana Mendes', '1983-04-27', '741.852.963-00', 'DF-74.185.296', 'Casada', 'Feminino', '61999997766', '61888885555', '61333334444', 'juliana.mendes@email.com', '70040-010', 'SQS 308 Bloco A', '101', 'Apto 301', 'Asa Sul', 'Brasília'),
('Thiago Oliveira', '1998-08-14', '852.963.741-00', 'GO-85.296.374', 'Solteiro', 'Masculino', '62999996655', '62888884444', '62333333333', 'thiago.oliveira@email.com', '74000-000', 'Rua 9', '369', '', 'Setor Oeste', 'Goiânia');

CREATE TABLE vendas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  data_venda DATE NOT NULL,
  desconto DECIMAL(5, 2) DEFAULT 0, -- desconto total percentual da venda
  total DECIMAL(10, 2) NOT NULL, -- total antes do desconto
  total_com_desconto DECIMAL(10, 2) NOT NULL, -- total após desconto
  data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

ALTER TABLE vendas
MODIFY COLUMN status ENUM('pendente', 'pago', 'cancelado', 'aprazo') DEFAULT 'pendente';

ALTER TABLE vendas
ADD COLUMN forma_pagamento ENUM('À Vista', 'Cartão', 'Parcelado', 'Outro') DEFAULT 'À Vista';

CREATE TABLE itens_venda (
  id INT AUTO_INCREMENT PRIMARY KEY,
  venda_id INT NOT NULL,
  produto_id INT NOT NULL,
  quantidade INT NOT NULL,
  preco_unitario DECIMAL(10, 2) NOT NULL,
  desconto DECIMAL(5, 2) DEFAULT 0, -- desconto percentual no item
  FOREIGN KEY (venda_id) REFERENCES vendas(id),
  FOREIGN KEY (produto_id) REFERENCES produtos(id)
);