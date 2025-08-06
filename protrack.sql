use protrack

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

