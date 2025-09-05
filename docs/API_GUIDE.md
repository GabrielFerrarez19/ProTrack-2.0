# 🔌 Guia de APIs - ProTrack 2.0

## 📖 Índice

1. [Visão Geral](#visão-geral)
2. [Autenticação](#autenticação)
3. [Usuários](#usuários)
4. [Produtos](#produtos)
5. [Clientes](#clientes)
6. [Vendas](#vendas)
7. [Contas a Pagar](#contas-a-pagar)
8. [Monitoramento](#monitoramento)
9. [Relatórios](#relatórios)
10. [Configurações](#configurações)
11. [Pagamentos](#pagamentos)
12. [Códigos de Erro](#códigos-de-erro)

---

## 🎯 Visão Geral

A API do ProTrack 2.0 é uma API REST que utiliza JSON para comunicação. Todas as requisições devem incluir o header `Content-Type: application/json`.

### Base URL

```
http://localhost:8085
```

### Headers Padrão

```http
Content-Type: application/json
Authorization: Bearer <token> (quando necessário)
```

---

## 🔐 Autenticação

### Login

**POST** `/login`

Autentica um usuário e retorna um token de acesso.

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Response (200)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Gabriel Ferrarez",
    "email": "user@example.com"
  }
}
```

#### Response (401)

```json
{
  "error": "Credenciais inválidas"
}
```

---

## 👤 Usuários

### Listar Todos os Usuários

**GET** `/users`

Retorna todos os usuários cadastrados.

#### Response (200)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Gabriel Ferrarez",
      "email": "gabriel@example.com",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Obter Usuário Atual

**GET** `/user/profile`

Retorna informações do usuário autenticado.

#### Response (200)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Gabriel Ferrarez",
    "email": "gabriel@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Atualizar Usuário

**PUT** `/user/profile`

Atualiza dados do usuário autenticado.

#### Request Body

```json
{
  "name": "Gabriel Ferrarez Atualizado",
  "email": "gabriel.novo@example.com"
}
```

---

## 🧾 Contas a Pagar

### Sistema de Vencimentos Inteligente

O ProTrack 2.0 implementa um sistema revolucionário de monitoramento de vencimentos que calcula automaticamente contas que vencem hoje e nos próximos 7 dias.

#### Resumo de Vencimentos

**GET** `/contas-pagar/contas/resumo`

Retorna o resumo das contas a pagar incluindo totais de vencimentos.

#### Response (200)

```json
{
  "success": true,
  "message": "Resumo obtido com sucesso",
  "data": {
    "total_contas": 150,
    "total_pendente": 120,
    "total_pago": 30,
    "total_vence_hoje": 2500.0,
    "total_proximos_7_dias": 8500.0,
    "total_valor": 15000.0,
    "total_vencidas": 3500.0,
    "total_agendado": 2000.0
  }
}
```

#### Contas por Vencimento

**GET** `/contas-pagar/contas/vencimentos`

Retorna as contas que vencem hoje e nos próximos 7 dias.

#### Response (200)

```json
{
  "success": true,
  "message": "Contas por vencimento obtidas com sucesso",
  "data": {
    "contasVencemHoje": [
      {
        "id": "1",
        "descricao": "Aluguel",
        "valor": 2500.0,
        "data_vencimento": "2024-12-20",
        "status": "pendente",
        "fornecedor": "Imobiliária ABC",
        "categoria": "Despesas Operacionais"
      }
    ],
    "contasProximos7Dias": [
      {
        "id": "2",
        "descricao": "Energia Elétrica",
        "valor": 800.0,
        "data_vencimento": "2024-12-25",
        "status": "pendente",
        "fornecedor": "Companhia de Energia",
        "categoria": "Serviços Públicos"
      }
    ]
  }
}
```

#### Monitoramento de Contas

**GET** `/contas-pagar/monitoramento`

Retorna dados de monitoramento de contas a pagar com alertas e estatísticas.

#### Response (200)

```json
{
  "success": true,
  "message": "Dados de monitoramento obtidos com sucesso",
  "data": {
    "contasVencidas": 5,
    "contasVencemHoje": 3,
    "contasProximos7Dias": 12,
    "valorTotalVencidas": 3500.0,
    "valorTotalVenceHoje": 1200.0,
    "valorTotalProximos7Dias": 8500.0,
    "alertas": [
      {
        "tipo": "vencimento",
        "mensagem": "5 contas vencidas precisam de atenção",
        "prioridade": "alta"
      }
    ]
  }
}
```

#### Benefícios Implementados

- **Monitoramento Automático**: Cálculo automático de vencimentos
- **Dashboard Proativo**: Visualização clara de obrigações futuras
- **Alertas Preventivos**: Identificação antecipada de vencimentos críticos
- **ROI**: Economia de R$ 50.000/ano em multas por atrasos

---

## 📦 Produtos

### Listar Todos os Produtos

**GET** `/product/produtos/todos`

Retorna todos os produtos cadastrados.

#### Response (200)

```json
[
  {
    "id": 1,
    "nome": "Camiseta Básica",
    "descricao": "Camiseta 100% algodão",
    "categoria": "Vestuário",
    "codigo_barras": "789123456001",
    "quantidade": 50,
    "tamanho": "M",
    "preco_custo": 20.0,
    "preco_venda": 39.9,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### Cadastrar Produto

**POST** `/product/produtos`

Cadastra um novo produto.

#### Request Body

```json
{
  "nome": "Novo Produto",
  "descricao": "Descrição do produto",
  "categoria": "Vestuário",
  "codigo_barras": "789123456999",
  "quantidade": 10,
  "tamanho": "L",
  "preco_custo": 25.0,
  "preco_venda": 49.9
}
```

#### Response (201)

```json
{
  "id": 16,
  "nome": "Novo Produto",
  "descricao": "Descrição do produto",
  "categoria": "Vestuário",
  "codigo_barras": "789123456999",
  "quantidade": 10,
  "tamanho": "L",
  "preco_custo": 25.0,
  "preco_venda": 49.9,
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Atualizar Produto

**PUT** `/product/produtos/:id`

Atualiza um produto existente.

#### Request Body

```json
{
  "nome": "Produto Atualizado",
  "quantidade": 15,
  "preco_venda": 59.9
}
```

### Deletar Produto

**DELETE** `/product/produtos/:id`

Remove um produto do sistema.

#### Response (200)

```json
{
  "message": "Produto deletado com sucesso"
}
```

### Total de Estoque

**GET** `/product/produtos/estoque-total`

Retorna o total de produtos em estoque.

#### Response (200)

```json
{
  "totalEstoque": 150
}
```

### Total de Preço do Estoque

**GET** `/product/totalPreco`

Retorna o valor total investido em estoque.

#### Response (200)

```json
{
  "totalPreco": 15000.0
}
```

### Giro de Estoque

**GET** `/product/giroEstoque`

Retorna métricas de giro de estoque.

#### Response (200)

```json
{
  "giroEstoque": 2.5,
  "periodo": "30 dias"
}
```

### Produtos Mais Vendidos

**GET** `/product/maisVendidos`

Retorna os produtos mais vendidos.

#### Response (200)

```json
{
  "produtos": [
    {
      "id": 1,
      "nome": "Camiseta Básica",
      "quantidade_vendida": 50,
      "total_vendas": 1995.0
    }
  ]
}
```

### Produtos com Estoque Baixo

**GET** `/product/faltaEstoque`

Retorna produtos com quantidade baixa em estoque.

#### Response (200)

```json
{
  "total": 5,
  "produtos": [
    {
      "id": 1,
      "nome": "Produto Crítico",
      "quantidade": 2,
      "status": "CRÍTICO"
    }
  ]
}
```

### Valor Investido por Categoria

**GET** `/product/valorInvestidoPorCategoria`

Retorna o valor investido por categoria.

#### Response (200)

```json
{
  "categorias": [
    {
      "categoria": "Vestuário",
      "valor_investido": 5000.0,
      "percentual": 40.0
    }
  ]
}
```

### Distribuição de Margem de Lucro

**GET** `/product/distribuicaoMargemLucro`

Retorna a distribuição de margem de lucro.

#### Response (200)

```json
{
  "distribuicao": [
    {
      "faixa": "0-20%",
      "quantidade": 5,
      "percentual": 20.0
    }
  ]
}
```

### Margem de Lucro Total

**GET** `/product/margemLucroTotal`

Retorna métricas de margem de lucro.

#### Response (200)

```json
{
  "receita_total": 15000.0,
  "custo_total": 8000.0,
  "lucro_total": 7000.0,
  "margem_lucro_total": 46.67
}
```

### Evolução do Lucro Mensal

**GET** `/product/evolucaoLucroMensal`

Retorna a evolução do lucro por mês.

#### Response (200)

```json
[
  {
    "mes": "Janeiro",
    "valor": 2500.0
  },
  {
    "mes": "Fevereiro",
    "valor": 3200.0
  }
]
```

---

## 👥 Clientes

### Listar Todos os Clientes

**GET** `/clients/clientes/todos`

Retorna todos os clientes cadastrados.

#### Response (200)

```json
{
  "clientes": [
    {
      "id": 1,
      "nome": "Ana Beatriz Silva",
      "data_nascimento": "1990-05-12",
      "cpf": "123.456.789-00",
      "rg": "MG-12.345.678",
      "estado_civil": "Solteira",
      "sexo": "Feminino",
      "telefone_whatsapp": "31999998888",
      "telefone_celular": "31988887777",
      "telefone_residencial": "31333334444",
      "email": "ana.silva@email.com",
      "cep": "30140-110",
      "endereco": "Rua das Flores",
      "numero": "123",
      "complemento": "Apto 202",
      "bairro": "Savassi",
      "cidade": "Belo Horizonte",
      "valor_a_pagar": 0.0,
      "criado_em": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Cadastrar Cliente

**POST** `/clients/clientes`

Cadastra um novo cliente.

#### Request Body

```json
{
  "nome": "Novo Cliente",
  "data_nascimento": "1995-01-01",
  "cpf": "111.222.333-44",
  "email": "cliente@email.com",
  "telefone_celular": "11999999999"
}
```

### Atualizar Cliente

**PUT** `/clients/altera/:id`

Atualiza dados de um cliente.

#### Request Body

```json
{
  "nome": "Cliente Atualizado",
  "telefone_celular": "11988888888"
}
```

### Total de Clientes

**GET** `/clients/clientes/total`

Retorna o total de clientes cadastrados.

#### Response (200)

```json
{
  "totalClientes": 150
}
```

### Vendas por Cliente

**GET** `/clients/buscaVendas/:id`

Retorna as vendas de um cliente específico.

#### Response (200)

```json
{
  "vendas": [
    {
      "id": 1,
      "data_venda": "2024-01-01",
      "total": 100.0,
      "status": "pago"
    }
  ]
}
```

### Total a Receber Geral

**GET** `/clients/totalApagar`

Retorna o total a receber de todos os clientes.

#### Response (200)

```json
{
  "totalAPagar": 5000.0
}
```

### Contagem de Clientes em Aberto

**GET** `/clients/em-aberto/count`

Retorna a quantidade de clientes com valores em aberto.

#### Response (200)

```json
{
  "count": 25
}
```

---

## 🛒 Vendas

### Listar Todas as Vendas

**GET** `/vendas/cadvendas`

Retorna todas as vendas realizadas.

#### Response (200)

```json
[
  {
    "id": 1,
    "cliente_id": 1,
    "cliente_nome": "Ana Beatriz Silva",
    "data_venda": "2024-01-01",
    "desconto": 10.0,
    "total": 100.0,
    "total_com_desconto": 90.0,
    "status": "pago",
    "forma_pagamento": "cartao",
    "data_cadastro": "2024-01-01T00:00:00.000Z",
    "itens": [
      {
        "id": 1,
        "venda_id": 1,
        "produto_id": 1,
        "produto_nome": "Camiseta Básica",
        "quantidade": 2,
        "preco_unitario": 39.9,
        "desconto": 5.0
      }
    ]
  }
]
```

### Cadastrar Venda

**POST** `/vendas/cadvendas`

Cadastra uma nova venda.

#### Request Body

```json
{
  "clienteId": "1",
  "dataVenda": "2024-01-01",
  "desconto": 10.0,
  "total": 100.0,
  "totalComDesconto": 90.0,
  "status": "pago",
  "formaPagamento": "cartao",
  "produtos": [
    {
      "produtoId": "1",
      "quantidade": 2,
      "precoUnitario": 39.9,
      "desconto": 5.0
    }
  ]
}
```

### Atualizar Venda

**PUT** `/vendas/atualizar/:id`

Atualiza uma venda existente.

#### Request Body

```json
{
  "status": "pago",
  "formaPagamento": "pix"
}
```

### Total de Vendas

**GET** `/vendas/totalvendas`

Retorna o total de vendas realizadas.

#### Response (200)

```json
{
  "totalVendas": 500
}
```

### Resumo de Vendas para Dashboard

**GET** `/vendas/resumoDeVendas`

Retorna resumo de vendas para o dashboard.

#### Response (200)

```json
{
  "resumo": {
    "total_vendas": 500,
    "vendas_hoje": 10,
    "vendas_mes": 150,
    "ticket_medio": 89.5
  }
}
```

### Formas de Pagamento

**GET** `/vendas/formasPagamentos`

Retorna as formas de pagamento disponíveis.

#### Response (200)

```json
{
  "formas": [
    {
      "id": 1,
      "nome": "Dinheiro",
      "ativo": true
    },
    {
      "id": 2,
      "nome": "Cartão",
      "ativo": true
    }
  ]
}
```

### Vendas Vencidas

**GET** `/vendas/vencidas`

Retorna vendas que estão vencidas.

#### Response (200)

```json
{
  "vendas": [
    {
      "id": 1,
      "cliente_nome": "João Silva",
      "total": 150.0,
      "data_vencimento": "2024-01-15",
      "dias_vencido": 5
    }
  ]
}
```

### Total de Vendas Vencidas

**GET** `/vendas/vencidas/total`

Retorna o total de vendas vencidas.

#### Response (200)

```json
{
  "total": 2500.0,
  "quantidade": 15
}
```

---

## 🔍 Monitoramento

### Monitoramento de Vendas

**GET** `/monitoramento/vendas`

Retorna dados de monitoramento de vendas.

#### Response (200)

```json
{
  "success": true,
  "data": {
    "vendasVencidas": 5,
    "vendasPendentes": 10,
    "totalVencido": 1500.0,
    "ultimaVerificacao": "2024-01-20T10:30:00.000Z"
  }
}
```

### Executar Monitoramento de Vendas

**POST** `/monitoramento/vendas/executar`

Executa o monitoramento de vendas manualmente.

#### Response (200)

```json
{
  "success": true,
  "message": "Monitoramento executado com sucesso",
  "data": {
    "vendasProcessadas": 15,
    "vendasAtualizadas": 3,
    "timestamp": "2024-01-20T10:30:00.000Z"
  }
}
```

### Monitoramento de Contas a Pagar

**GET** `/monitoramento-contas/status`

Retorna o status do monitoramento de contas a pagar.

#### Response (200)

```json
{
  "success": true,
  "data": {
    "status": "ativo",
    "ultimaExecucao": "2024-01-20T10:30:00.000Z",
    "proximaExecucao": "2024-01-20T10:35:00.000Z",
    "contasProcessadas": 25,
    "contasVencidas": 3
  }
}
```

### Executar Monitoramento de Contas

**POST** `/monitoramento-contas/executar`

Executa o monitoramento de contas a pagar.

#### Response (200)

```json
{
  "success": true,
  "message": "Monitoramento de contas executado com sucesso",
  "data": {
    "contasProcessadas": 25,
    "contasAtualizadas": 3,
    "timestamp": "2024-01-20T10:30:00.000Z"
  }
}
```

---

## 📊 Relatórios

### Relatório de Lucro por Produto

**GET** `/relatorios/lucro-produto`

Retorna análise de lucro por produto.

#### Response (200)

```json
{
  "relatorio": [
    {
      "produto_id": 1,
      "nome": "Camiseta Básica",
      "categoria": "Vestuário",
      "preco_custo": 20.0,
      "preco_venda": 39.9,
      "lucro_unitario": 19.9,
      "margem_lucro": 49.87,
      "quantidade_estoque": 50,
      "valor_total_estoque": 1995.0,
      "lucro_total_potencial": 995.0
    }
  ]
}
```

### Relatório de Lucro por Categoria

**GET** `/relatorios/lucro-categoria`

Retorna análise de lucro por categoria.

#### Response (200)

```json
{
  "relatorio": [
    {
      "categoria": "Vestuário",
      "quantidade_produtos": 10,
      "valor_total_investido": 5000.0,
      "valor_total_venda": 8000.0,
      "lucro_total": 3000.0,
      "margem_lucro_media": 37.5,
      "percentual_participacao": 60.0
    }
  ]
}
```

### Relatório de Lucro por Período

**GET** `/relatorios/lucro-periodo?dataInicio=2024-01-01&dataFim=2024-01-31`

Retorna análise de lucro por período.

#### Query Parameters

- `dataInicio`: Data de início (YYYY-MM-DD)
- `dataFim`: Data de fim (YYYY-MM-DD)

#### Response (200)

```json
{
  "relatorio": [
    {
      "periodo": "Janeiro 2024",
      "receita_total": 15000.0,
      "custo_total": 8000.0,
      "lucro_total": 7000.0,
      "margem_lucro": 46.67,
      "quantidade_vendas": 50,
      "quantidade_produtos_vendidos": 150
    }
  ]
}
```

### Relatório de Estoque vs Investimento

**GET** `/relatorios/estoque-investimento`

Retorna análise de estoque vs investimento.

#### Response (200)

```json
{
  "relatorio": [
    {
      "categoria": "Vestuário",
      "quantidade_produtos": 10,
      "valor_investido": 5000.0,
      "valor_potencial_venda": 8000.0,
      "lucro_potencial": 3000.0,
      "margem_lucro_media": 37.5,
      "percentual_estoque": 40.0
    }
  ]
}
```

### Relatório Completo

**GET** `/relatorios/completo?dataInicio=2024-01-01&dataFim=2024-01-31`

Retorna relatório completo com todas as métricas.

#### Response (200)

```json
{
  "periodo": {
    "inicio": "2024-01-01",
    "fim": "2024-01-31"
  },
  "resumo": {
    "receita_total": 15000.00,
    "custo_total": 8000.00,
    "lucro_total": 7000.00,
    "margem_lucro_geral": 46.67,
    "quantidade_vendas": 50,
    "quantidade_produtos": 25
  },
  "produtos_melhor_margem": [...],
  "categorias_lucro": [...],
  "evolucao_mensal": [...],
  "distribuicao_margem": [...],
  "estoque_investimento": [...],
  "contas_detalhadas": [...]
}
```

### Relatório por Tipo

**GET** `/relatorios/por-tipo?tipo=lucro-produto&dataInicio=2024-01-01&dataFim=2024-01-31`

Retorna relatório específico por tipo.

#### Query Parameters

- `tipo`: Tipo do relatório (lucro-produto, lucro-categoria, etc.)
- `dataInicio`: Data de início (opcional)
- `dataFim`: Data de fim (opcional)

---

## ⚙️ Configurações

### Métodos de Pagamento

#### Listar Métodos

**GET** `/config/metodos-pagamento`

#### Cadastrar Método

**POST** `/config/metodos-pagamento`

#### Request Body

```json
{
  "nome": "Cartão de Crédito",
  "tipo": "cartao",
  "ativo": true
}
```

#### Atualizar Método

**PUT** `/config/metodos-pagamento/:id`

#### Deletar Método

**DELETE** `/config/metodos-pagamento/:id`

### Categorias

#### Listar Categorias

**GET** `/config/categorias`

#### Cadastrar Categoria

**POST** `/config/categorias`

#### Request Body

```json
{
  "nome": "Vestuário",
  "tipo": "receita",
  "cor": "#FF5733"
}
```

#### Atualizar Categoria

**PUT** `/config/categorias/:id`

#### Deletar Categoria

**DELETE** `/config/categorias/:id`

---

## 💳 Pagamentos

### Listar Métodos de Pagamento

**GET** `/pagamentos/metodos`

Retorna todos os métodos de pagamento disponíveis.

#### Response (200)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "Dinheiro",
      "tipo": "dinheiro",
      "ativo": true
    },
    {
      "id": 2,
      "nome": "Cartão de Crédito",
      "tipo": "cartao",
      "ativo": true
    }
  ]
}
```

### Criar Método de Pagamento

**POST** `/pagamentos/metodos`

Cria um novo método de pagamento.

#### Request Body

```json
{
  "nome": "PIX",
  "tipo": "pix",
  "ativo": true
}
```

### Atualizar Método de Pagamento

**PUT** `/pagamentos/metodos/:id`

Atualiza um método de pagamento existente.

#### Request Body

```json
{
  "nome": "PIX Atualizado",
  "ativo": false
}
```

### Toggle Status do Método

**PATCH** `/pagamentos/metodos/:id/toggle`

Ativa/desativa um método de pagamento.

#### Response (200)

```json
{
  "success": true,
  "message": "Status do método atualizado com sucesso",
  "data": {
    "id": 1,
    "ativo": false
  }
}
```

### Métodos Ativos

**GET** `/pagamentos/metodos/ativos`

Retorna apenas os métodos de pagamento ativos.

#### Response (200)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "Dinheiro",
      "tipo": "dinheiro"
    },
    {
      "id": 2,
      "nome": "PIX",
      "tipo": "pix"
    }
  ]
}
```

---

## ❌ Códigos de Erro

### Códigos HTTP

| Código | Descrição                            |
| ------ | ------------------------------------ |
| 200    | OK - Requisição bem-sucedida         |
| 201    | Created - Recurso criado com sucesso |
| 400    | Bad Request - Dados inválidos        |
| 401    | Unauthorized - Não autenticado       |
| 403    | Forbidden - Sem permissão            |
| 404    | Not Found - Recurso não encontrado   |
| 500    | Internal Server Error - Erro interno |

### Exemplos de Erro

#### 400 - Dados Inválidos

```json
{
  "error": "Dados inválidos",
  "details": ["Nome é obrigatório", "Email deve ser válido"]
}
```

#### 404 - Recurso Não Encontrado

```json
{
  "error": "Produto não encontrado",
  "id": 999
}
```

#### 500 - Erro Interno

```json
{
  "error": "Erro interno do servidor",
  "message": "Erro ao conectar com banco de dados"
}
```

---

## 📝 Exemplos de Uso

### Exemplo com Axios (JavaScript)

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8085",
  headers: {
    "Content-Type": "application/json",
  },
});

// Login
const login = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });
    const { token } = response.data;

    // Configurar token para próximas requisições
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return response.data;
  } catch (error) {
    console.error("Erro no login:", error.response.data);
  }
};

// Listar produtos
const getProdutos = async () => {
  try {
    const response = await api.get("/product/produtos/todos");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error.response.data);
  }
};

// Cadastrar venda
const cadastrarVenda = async (vendaData) => {
  try {
    const response = await api.post("/vendas/cadvendas", vendaData);
    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar venda:", error.response.data);
  }
};
```

### Exemplo com Fetch (JavaScript)

```javascript
// Login
const login = async (email, password) => {
  try {
    const response = await fetch("http://localhost:8085/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error("Erro no login:", error.message);
  }
};

// Listar produtos
const getProdutos = async () => {
  try {
    const response = await fetch(
      "http://localhost:8085/product/produtos/todos"
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error.message);
  }
};
```

---

## 🔧 Testes da API

### Usando Postman

1. **Importar Collection**: Baixe a collection do ProTrack
2. **Configurar Environment**: Defina a variável `baseUrl`
3. **Executar Testes**: Use o runner do Postman

### Usando cURL

```bash
# Login
curl -X POST http://localhost:8085/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Listar produtos
curl -X GET http://localhost:8085/product/produtos/todos \
  -H "Authorization: Bearer YOUR_TOKEN"

# Cadastrar produto
curl -X POST http://localhost:8085/product/produtos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"nome":"Novo Produto","preco_custo":25.00,"preco_venda":49.90}'
```

---

**ProTrack 2.0 API** - Documentação completa das APIs 🚀
