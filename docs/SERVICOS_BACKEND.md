# ⚙️ Serviços Backend - ProTrack 2.0

## 📖 Visão Geral

Este documento detalha todos os serviços implementados no backend do ProTrack 2.0, organizados por funcionalidade e responsabilidade.

## 🏗️ Estrutura dos Serviços

### **Localização**

Todos os serviços estão localizados em `src/services/` e seguem o padrão de nomenclatura `[nomeFuncionalidade].service.ts`.

## 🎯 Serviços Implementados

### **1. user.service.ts**

**Responsabilidade**: Gestão de usuários

```typescript
export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  criado_por?: bigint;
}

export const createUserDb = async (
  userData: CreateUserData
): Promise<number> => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const [result] = await connection.execute(
      "INSERT INTO users (name, email, password, criado_por) VALUES (?, ?, ?, ?)",
      [userData.name, userData.email, hashedPassword, userData.criado_por]
    );

    await connection.commit();
    return (result as any).insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const findUserById = async (id: number): Promise<User | null> => {
  // Implementação
};

export const updateUser = async (
  id: number,
  userData: Partial<CreateUserData>
): Promise<void> => {
  // Implementação
};

export const updateUserStatus = async (
  id: number,
  status: string
): Promise<void> => {
  // Implementação
};

export const getAllUsers = async (): Promise<User[]> => {
  // Implementação
};
```

**Funcionalidades**:

- Criação de usuários com hash de senha
- Busca por ID
- Atualização de dados
- Controle de status
- Listagem de usuários
- Transações de banco

### **2. client.service.ts**

**Responsabilidade**: Gestão de clientes

```typescript
export interface ClienteData {
  nome: string;
  dataNascimento: string;
  cpf: string;
  rg?: string;
  estadoCivil?: string;
  sexo?: string;
  telefoneWhatsapp?: string;
  telefoneCelular?: string;
  telefoneResidencial?: string;
  email: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  valorAPagar?: number;
}

export const createClienteDb = async (
  cliente: ClienteData
): Promise<number> => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      `INSERT INTO clientes (
        nome, data_nascimento, cpf, rg, estado_civil, sexo,
        telefone_whatsapp, telefone_celular, telefone_residencial,
        email, cep, endereco, numero, complemento, bairro, cidade, valor_a_pagar
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cliente.nome,
        cliente.dataNascimento,
        cliente.cpf,
        cliente.rg,
        cliente.estadoCivil,
        cliente.sexo,
        cliente.telefoneWhatsapp,
        cliente.telefoneCelular,
        cliente.telefoneResidencial,
        cliente.email,
        cliente.cep,
        cliente.endereco,
        cliente.numero,
        cliente.complemento,
        cliente.bairro,
        cliente.cidade,
        cliente.valorAPagar || 0,
      ]
    );

    await connection.commit();
    return (result as any).insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const updateClienteDb = async (
  id: number,
  cliente: ClienteData
): Promise<void> => {
  // Implementação
};

export const getTotalClientesDb = async (): Promise<number> => {
  // Implementação
};

export const getAllClientesDb = async (): Promise<Cliente[]> => {
  // Implementação
};

export const getVendasByClienteId = async (
  clienteId: number
): Promise<Venda[]> => {
  // Implementação
};

export const getTotalAPagarGeral = async (): Promise<number> => {
  // Implementação
};

export const getClientesEmAbertoCountDb = async (): Promise<number> => {
  // Implementação
};
```

**Funcionalidades**:

- CRUD completo de clientes
- Validação de dados
- Busca de vendas por cliente
- Cálculo de totais
- Contagem de clientes em aberto
- Transações de banco

### **3. product.service.ts**

**Responsabilidade**: Gestão de produtos

```typescript
export interface ProductData {
  nome: string;
  descricao?: string;
  categoria?: string;
  codigo_barras?: string;
  quantidade: number;
  tamanho?: string;
  preco_custo: number;
  preco_venda: number;
}

export const createProductDb = async (
  product: ProductData
): Promise<number> => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      `INSERT INTO produtos (
        nome, descricao, categoria, codigo_barras, quantidade,
        tamanho, preco_custo, preco_venda
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.nome,
        product.descricao,
        product.categoria,
        product.codigo_barras,
        product.quantidade,
        product.tamanho,
        product.preco_custo,
        product.preco_venda,
      ]
    );

    await connection.commit();
    return (result as any).insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const getAllProdutosDb = async (): Promise<Product[]> => {
  // Implementação
};

export const updateProductDb = async (
  id: number,
  product: Partial<ProductData>
): Promise<void> => {
  // Implementação
};

export const getTotalEstoqueDb = async (): Promise<number> => {
  // Implementação
};

export const getTotalEstoquePrecoDb = async (): Promise<number> => {
  // Implementação
};

export const getGiroEstoqueDb = async (): Promise<number> => {
  // Implementação
};

export const getProdutosMaisVendidosDb = async (): Promise<Product[]> => {
  // Implementação
};

export const getProdutosMelhorMargemLucroDb = async (): Promise<Product[]> => {
  // Implementação
};

export const getMargemLucroTotalDb = async (): Promise<number> => {
  // Implementação
};

export const getEvolucaoLucroMensalDb = async (): Promise<any[]> => {
  // Implementação
};

export const getValorInvestidoPorCategoriaDb = async (): Promise<any[]> => {
  // Implementação
};

export const getDistribuicaoMargemLucroDb = async (): Promise<any[]> => {
  // Implementação
};

export const contarProdutosQuantidadeBaixaDb = async (): Promise<number> => {
  // Implementação
};
```

**Funcionalidades**:

- CRUD completo de produtos
- Controle de estoque
- Cálculos de margem de lucro
- Análise de vendas
- Relatórios de performance
- Métricas de giro de estoque

### **4. venda.service.ts**

**Responsabilidade**: Gestão de vendas

```typescript
export interface VendaData {
  clienteId: string;
  dataVenda: string;
  desconto: number;
  total: number;
  totalComDesconto: number;
  status: string;
  formaPagamento: string;
  diasVencimento?: number;
  produtos: Array<{
    produtoId: string;
    quantidade: number;
    precoUnitario: number;
    desconto?: number;
  }>;
}

export const criarVendaDb = async (vendaData: VendaData): Promise<number> => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Inserir venda principal
    const [vendaResult] = await connection.execute(
      `INSERT INTO vendas (
        cliente_id, data_venda, desconto, total, total_com_desconto,
        status, forma_pagamento, dias_vencimento, data_vencimento
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        vendaData.clienteId,
        vendaData.dataVenda,
        vendaData.desconto,
        vendaData.total,
        vendaData.totalComDesconto,
        vendaData.status,
        vendaData.formaPagamento,
        vendaData.diasVencimento,
        vendaData.diasVencimento
          ? new Date(
              new Date(vendaData.dataVenda).getTime() +
                vendaData.diasVencimento * 24 * 60 * 60 * 1000
            )
          : null,
      ]
    );

    const vendaId = (vendaResult as any).insertId;

    // 2. Inserir itens da venda
    for (const item of vendaData.produtos) {
      await connection.execute(
        `INSERT INTO itens_venda (
          venda_id, produto_id, quantidade, preco_unitario, desconto
        ) VALUES (?, ?, ?, ?, ?)`,
        [
          vendaId,
          item.produtoId,
          item.quantidade,
          item.precoUnitario,
          item.desconto || 0,
        ]
      );

      // 3. Atualizar estoque
      await connection.execute(
        "UPDATE produtos SET quantidade = quantidade - ? WHERE id = ?",
        [item.quantidade, item.produtoId]
      );
    }

    await connection.commit();
    return vendaId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const getAllVendasDb = async (): Promise<Venda[]> => {
  // Implementação
};

export const getVendaByIdDb = async (id: number): Promise<Venda | null> => {
  // Implementação
};

export const updateVendaDb = async (
  id: number,
  vendaData: Partial<VendaData>
): Promise<void> => {
  // Implementação
};

export const getTotalVendasDb = async (): Promise<number> => {
  // Implementação
};

export const getVendasDashboardDb = async (): Promise<any> => {
  // Implementação
};

export const getFormasPagamentoDb = async (): Promise<any[]> => {
  // Implementação
};

export const getVendasVencidasDb = async (): Promise<Venda[]> => {
  // Implementação
};

export const getTotalVendasVencidasDb = async (): Promise<number> => {
  // Implementação
};
```

**Funcionalidades**:

- Criação de vendas com itens
- Atualização automática de estoque
- Controle de vencimentos
- Relatórios de vendas
- Análise de formas de pagamento
- Transações complexas

### **5. contasPagar.service.ts**

**Responsabilidade**: Gestão de contas a pagar

```typescript
export interface ContaPagarCreate {
  fornecedor_nome: string;
  valor: number;
  data_vencimento: string;
  categoria_id: string;
  descricao: string;
  status?: string;
  observacoes?: string;
}

export const criarContaDb = async (
  contaData: ContaPagarCreate
): Promise<ContaPagar> => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Verificar se fornecedor existe, senão criar
    let fornecedorId = await buscarFornecedorPorNome(contaData.fornecedor_nome);

    if (!fornecedorId) {
      fornecedorId = await criarFornecedorDb({
        nome: contaData.fornecedor_nome,
      });
    }

    // 2. Inserir conta
    const [result] = await connection.execute(
      `INSERT INTO contas_pagar (
        fornecedor_id, valor, data_vencimento, categoria_id,
        descricao, status, observacoes
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        fornecedorId,
        contaData.valor,
        contaData.data_vencimento,
        contaData.categoria_id,
        contaData.descricao,
        contaData.status || "pendente",
        contaData.observacoes,
      ]
    );

    await connection.commit();
    return await buscarContaPorIdDb((result as any).insertId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const listarContasDb = async (
  filtros?: ContaPagarFiltros
): Promise<ContaPagar[]> => {
  // Implementação
};

export const buscarContaPorIdDb = async (
  id: string
): Promise<ContaPagar | null> => {
  // Implementação
};

export const atualizarContaDb = async (
  id: string,
  contaData: Partial<ContaPagarCreate>
): Promise<void> => {
  // Implementação
};

export const excluirContaDb = async (id: string): Promise<void> => {
  // Implementação
};

export const marcarComoPagaDb = async (
  id: string,
  valorPago: number,
  formaPagamento: string
): Promise<void> => {
  // Implementação
};

export const obterResumoDb = async (): Promise<ContaPagarResumo> => {
  // Implementação
};

export const buscarContasVencimentoDb = async (): Promise<ContasVencimento> => {
  // Implementação
};

export const atualizarStatusContasDb = async (): Promise<void> => {
  // Implementação
};

// Fornecedores
export const criarFornecedorDb = async (
  fornecedorData: FornecedorCreate
): Promise<number> => {
  // Implementação
};

export const listarFornecedoresDb = async (): Promise<Fornecedor[]> => {
  // Implementação
};

export const buscarFornecedorPorIdDb = async (
  id: string
): Promise<Fornecedor | null> => {
  // Implementação
};

export const atualizarFornecedorDb = async (
  id: string,
  fornecedorData: Partial<FornecedorCreate>
): Promise<void> => {
  // Implementação
};

export const excluirFornecedorDb = async (id: string): Promise<void> => {
  // Implementação
};
```

**Funcionalidades**:

- CRUD completo de contas a pagar
- Gestão de fornecedores
- Cálculo automático de vencimentos
- Sistema de resumos
- Atualização de status
- Transações complexas

### **6. contasPagarMonitoramento.service.ts**

**Responsabilidade**: Monitoramento de contas a pagar

```typescript
export const executarMonitoramentoContas =
  async (): Promise<MonitoramentoResult> => {
    try {
      const hoje = new Date();
      const hojeStr = hoje.toISOString().split("T")[0];

      // 1. Identificar contas vencidas
      const contasVencidas = await identificarContasVencidas();

      // 2. Marcar como vencidas
      if (contasVencidas.length > 0) {
        await marcarContasComoVencidas(contasVencidas);
      }

      // 3. Atualizar status do sistema
      await atualizarStatusSistema("ativo", new Date());

      return {
        contasProcessadas: contasVencidas.length,
        contasAtualizadas: contasVencidas.length,
        timestamp: new Date(),
        status: "sucesso",
      };
    } catch (error) {
      console.error("Erro no monitoramento:", error);
      await atualizarStatusSistema("erro", new Date());
      throw error;
    }
  };

export const obterStatusSistema = async (): Promise<StatusSistema> => {
  // Implementação
};

export const obterDadosMonitoramento =
  async (): Promise<DadosMonitoramento> => {
    // Implementação
  };

const identificarContasVencidas = async (): Promise<ContaPagar[]> => {
  // Implementação
};

const marcarContasComoVencidas = async (
  contas: ContaPagar[]
): Promise<void> => {
  // Implementação
};

const atualizarStatusSistema = async (
  status: string,
  timestamp: Date
): Promise<void> => {
  // Implementação
};
```

**Funcionalidades**:

- Execução de monitoramento automático
- Identificação de contas vencidas
- Atualização de status
- Controle de sistema
- Logs de execução

### **7. vendasMonitoramento.service.ts**

**Responsabilidade**: Monitoramento de vendas

```typescript
export const executarMonitoramentoVendas =
  async (): Promise<MonitoramentoResult> => {
    try {
      // 1. Identificar vendas vencidas
      const vendasVencidas = await identificarVendasVencidas();

      // 2. Marcar como vencidas
      if (vendasVencidas.length > 0) {
        await marcarVendasComoVencidas(vendasVencidas);
      }

      // 3. Retornar estatísticas
      return {
        vendasIdentificadas: vendasVencidas.length,
        vendasProcessadas: vendasVencidas.length,
        timestamp: new Date(),
        status: "sucesso",
      };
    } catch (error) {
      console.error("Erro no monitoramento:", error);
      throw error;
    }
  };

export const obterStatusMonitoramentoVendas =
  async (): Promise<StatusMonitoramento> => {
    // Implementação
  };

const identificarVendasVencidas = async (): Promise<Venda[]> => {
  // Implementação
};

const marcarVendasComoVencidas = async (vendas: Venda[]): Promise<void> => {
  // Implementação
};
```

**Funcionalidades**:

- Monitoramento de vendas vencidas
- Atualização de status
- Controle de execução
- Estatísticas de processamento

### **8. config.service.ts**

**Responsabilidade**: Configurações do sistema

```typescript
export const getMetodosPagamento = async (): Promise<MetodoPagamento[]> => {
  // Implementação
};

export const toggleMetodoPagamento = async (
  id: string,
  ativo: boolean
): Promise<void> => {
  // Implementação
};

export const getMetodosPagamentoAtivos = async (): Promise<
  MetodoPagamento[]
> => {
  // Implementação
};

export const getCategorias = async (): Promise<Categoria[]> => {
  // Implementação
};

export const addCategoria = async (categoria: CategoriaData): Promise<void> => {
  // Implementação
};

export const updateCategoria = async (
  id: string,
  categoria: Partial<CategoriaData>
): Promise<void> => {
  // Implementação
};

export const removeCategoria = async (id: string): Promise<void> => {
  // Implementação
};
```

**Funcionalidades**:

- Gestão de métodos de pagamento
- Controle de categorias
- Configurações do sistema
- Toggle de status

### **9. relatorio.service.ts**

**Responsabilidade**: Geração de relatórios

```typescript
export const getRelatorioLucroProduto = async (): Promise<
  RelatorioLucroProduto[]
> => {
  // Implementação
};

export const getRelatorioLucroCategoria = async (): Promise<
  RelatorioLucroCategoria[]
> => {
  // Implementação
};

export const getRelatorioLucroPeriodo = async (
  dataInicio: string,
  dataFim: string
): Promise<RelatorioLucroPeriodo[]> => {
  // Implementação
};

export const getRelatorioEstoqueInvestimento = async (): Promise<
  RelatorioEstoqueInvestimento[]
> => {
  // Implementação
};

export const getRelatorioCompleto = async (
  dataInicio: string,
  dataFim: string
): Promise<RelatorioCompleto> => {
  // Implementação
};

export const getRelatorioPorTipo = async (
  tipo: string,
  dataInicio?: string,
  dataFim?: string
): Promise<any> => {
  // Implementação
};
```

**Funcionalidades**:

- Relatórios de lucro por produto
- Relatórios de lucro por categoria
- Relatórios por período
- Análise de estoque vs investimento
- Relatórios completos
- Relatórios dinâmicos por tipo

### **10. pagamento.service.ts**

**Responsabilidade**: Gestão de pagamentos

```typescript
export const getMetodosPagamento = async (): Promise<MetodoPagamento[]> => {
  // Implementação
};

export const criarMetodoPagamento = async (
  metodo: MetodoPagamentoData
): Promise<number> => {
  // Implementação
};

export const atualizarMetodoPagamento = async (
  id: string,
  metodo: Partial<MetodoPagamentoData>
): Promise<void> => {
  // Implementação
};

export const toggleMetodoPagamento = async (id: string): Promise<void> => {
  // Implementação
};

export const getMetodosPagamentoAtivos = async (): Promise<
  MetodoPagamento[]
> => {
  // Implementação
};
```

**Funcionalidades**:

- CRUD de métodos de pagamento
- Controle de status ativo/inativo
- Validação de dados
- Filtros por status

## 🎯 Padrões de Implementação

### **Estrutura Padrão**

```typescript
export const [nomeFuncao]Db = async (params: Type): Promise<ReturnType> => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Lógica de negócio

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
```

### **Tratamento de Transações**

```typescript
const connection = await db.getConnection();
try {
  await connection.beginTransaction();

  // Operações de banco

  await connection.commit();
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  connection.release();
}
```

### **Validação de Dados**

```typescript
const validateData = (data: any, requiredFields: string[]) => {
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Campo obrigatório: ${field}`);
    }
  }
};
```

### **Tratamento de Erros**

```typescript
const handleError = (error: any, context: string) => {
  console.error(`Erro em ${context}:`, error);

  if (error.code === "ER_DUP_ENTRY") {
    throw new Error("Registro duplicado");
  }

  if (error.code === "ER_NO_REFERENCED_ROW_2") {
    throw new Error("Referência inválida");
  }

  throw new Error("Erro interno do servidor");
};
```

## 🚀 Performance

### **Otimizações Implementadas**

- **Connection pooling**: Para reutilização de conexões
- **Prepared statements**: Para segurança e performance
- **Transações**: Para consistência de dados
- **Índices**: Para consultas otimizadas
- **Batch operations**: Para operações em lote

### **Exemplo de Query Otimizada**

```typescript
const getRelatorioCompleto = async (dataInicio: string, dataFim: string) => {
  const connection = await db.getConnection();

  try {
    const [rows] = await connection.execute(`
      SELECT 
        p.id,
        p.nome,
        p.categoria,
        p.preco_custo,
        p.preco_venda,
        (p.preco_venda - p.preco_custo) as lucro_unitario,
        ((p.preco_venda - p.preco_custo) / p.preco_venda * 100) as margem_lucro,
        p.quantidade,
        (p.quantidade * p.preco_custo) as valor_investido,
        (p.quantidade * (p.preco_venda - p.preco_custo)) as lucro_potencial
      FROM produtos p
      WHERE p.ativo = 1
      ORDER BY margem_lucro DESC
    `);

    return rows;
  } finally {
    connection.release();
  }
};
```

## 🔧 Manutenção

### **Logs e Monitoramento**

```typescript
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`, data || "");
  },
  error: (message: string, error?: any) => {
    console.error(
      `[ERROR] ${new Date().toISOString()}: ${message}`,
      error || ""
    );
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, data || "");
  },
};
```

### **Versionamento**

- **Semantic versioning**: Para mudanças de API
- **Migration scripts**: Para mudanças de schema
- **Backward compatibility**: Quando possível

### **Testes**

- **Unit tests**: Para lógica de negócio
- **Integration tests**: Para operações de banco
- **Mocking**: Para dependências externas

---

**Este documento é atualizado regularmente conforme novos serviços são adicionados ao sistema.**
