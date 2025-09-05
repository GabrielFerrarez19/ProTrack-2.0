# 🎣 Hooks Customizados - ProTrack 2.0

## 📖 Visão Geral

Este documento detalha todos os hooks customizados implementados no frontend do ProTrack 2.0, organizados por funcionalidade e responsabilidade.

## 🏗️ Estrutura dos Hooks

### **Localização**

Todos os hooks customizados estão localizados em `src/hooks/` e seguem o padrão de nomenclatura `use[NomeFuncionalidade].ts`.

## 🎯 Hooks Implementados

### **1. useAuth.ts**

**Responsabilidade**: Gerenciamento de autenticação

```typescript
export const useAuth = () => {
  // Estados de autenticação
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Métodos de autenticação
  const login = async (email: string, password: string) => {
    // Implementação do login
  };

  const logout = () => {
    // Implementação do logout
  };

  const checkAuth = async () => {
    // Verificação de autenticação
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user,
  };
};
```

**Funcionalidades**:

- Login/logout de usuários
- Verificação de autenticação
- Gerenciamento de token
- Estado de carregamento
- Tratamento de erros

### **2. useClientes.ts**

**Responsabilidade**: Gestão de clientes

```typescript
export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadClientes = async () => {
    try {
      setLoading(true);
      const data = await fetchAllClientes();
      const clientesNormalizados = (data.clientes ?? []).map(normalizeCliente);
      setClientes(clientesNormalizados);
    } catch (err) {
      console.error("Erro ao carregar clientes:", err);
      setError("Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

  return { clientes, loading, error, reload: loadClientes };
};
```

**Funcionalidades**:

- Carregamento de clientes
- Normalização de dados
- Tratamento de erros
- Função de reload
- Estado de carregamento

### **3. useContasPagar.ts**

**Responsabilidade**: Gestão de contas a pagar

```typescript
export const useContasPagar = () => {
  // Estados principais
  const [contas, setContas] = useState<ContaPagar[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [resumo, setResumo] = useState<ContaPagarResumo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Métodos de CRUD
  const listarContas = async (filtros: ContaPagarFiltros = {}) => {
    // Implementação
  };

  const criarConta = async (contaData: ContaPagarCreate) => {
    // Implementação
  };

  const atualizarConta = async (id: string, contaData: ContaPagarUpdate) => {
    // Implementação
  };

  const excluirConta = async (id: string) => {
    // Implementação
  };

  const marcarComoPaga = async (
    id: string,
    valorPago: number,
    formaPagamento: string
  ) => {
    // Implementação
  };

  // Métodos de análise e relatórios
  const obterResumo = async () => {
    // Implementação
  };

  const obterEstatisticas = async () => {
    // Implementação
  };

  const obterProjecaoPagamentos = async () => {
    // Implementação
  };

  const obterAlertas = async () => {
    // Implementação
  };

  return {
    contas,
    categorias,
    fornecedores,
    resumo,
    loading,
    error,
    listarContas,
    criarConta,
    atualizarConta,
    excluirConta,
    marcarComoPaga,
    obterResumo,
    obterEstatisticas,
    obterProjecaoPagamentos,
    obterAlertas,
  };
};
```

**Funcionalidades**:

- CRUD completo de contas a pagar
- Gestão de categorias e fornecedores
- Resumo e estatísticas
- Projeções de pagamentos
- Sistema de alertas
- Filtros avançados

### **4. useContasPagarVencidas.ts**

**Responsabilidade**: Monitoramento de contas vencidas

```typescript
export const useContasPagarVencidas = () => {
  const [contasVencidas, setContasVencidas] = useState<ContaPagar[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listarContasVencidas = async () => {
    try {
      setLoading(true);
      const response = await api.get("/contas-pagar/contas/vencidas");
      setContasVencidas(response.data.data);
    } catch (err) {
      setError("Erro ao listar contas vencidas");
    } finally {
      setLoading(false);
    }
  };

  return {
    contasVencidas,
    loading,
    error,
    listarContasVencidas,
  };
};
```

**Funcionalidades**:

- Listagem de contas vencidas
- Atualização automática
- Tratamento de erros
- Estado de carregamento

### **5. useContasPagarMonitoramento.ts**

**Responsabilidade**: Status do sistema de monitoramento

```typescript
export const useContasPagarMonitoramento = () => {
  const [dadosMonitoramento, setDadosMonitoramento] =
    useState<DadosMonitoramento | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const obterDadosMonitoramento = async () => {
    try {
      setLoading(true);
      const response = await api.get("/contas-pagar/monitoramento");
      setDadosMonitoramento(response.data.data);
    } catch (err) {
      setError("Erro ao obter dados de monitoramento");
    } finally {
      setLoading(false);
    }
  };

  return {
    dadosMonitoramento,
    loading,
    error,
    obterDadosMonitoramento,
  };
};
```

**Funcionalidades**:

- Status do sistema de monitoramento
- Dados de execução
- Alertas do sistema
- Controle de execução manual

### **6. useDashboard.ts**

**Responsabilidade**: Dados do dashboard principal

```typescript
export const useDashboard = () => {
  const [dados, setDados] = useState<DashboardDados>({
    estoque: null,
    financeiro: null,
    giro: null,
    vendas: null,
    melhorMargem: null,
    margemTotal: null,
    evolucaoLucroMensal: [],
    valorInvestidoPorCategoria: null,
    distribuicaoMargemLucro: null,
    vendasEmAberto: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carrega todos os dados do dashboard em paralelo
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          estoqueRes,
          financeiroRes,
          giroRes,
          vendasRes,
          melhorMargemRes,
          margemTotalRes,
          evolucaoLucroMensalRes,
          valorInvestidoPorCategoriaRes,
          distribuicaoMargemLucroRes,
          vendasEmAbertoRes,
        ] = await Promise.all([
          fetchTotalValorEstoque(),
          fetchTotalAPagar(),
          fetchGiroEstoque(),
          fetchVendasDashboard(),
          getProdutosMelhorMargemLucro(),
          getMargemLucroTotal(),
          getEvolucaoLucroMensal(),
          getValorInvestidoPorCategoria(),
          getDistribuicaoMargemLucro(),
          getQuantidadeVendasEmAberto(),
        ]);

        setDados({
          estoque: estoqueRes,
          financeiro: financeiroRes,
          giro: giroRes,
          vendas: vendasRes,
          melhorMargem: melhorMargemRes,
          margemTotal: margemTotalRes,
          evolucaoLucroMensal: Array.isArray(evolucaoLucroMensalRes)
            ? evolucaoLucroMensalRes
            : evolucaoLucroMensalRes
            ? [evolucaoLucroMensalRes]
            : [],
          valorInvestidoPorCategoria: valorInvestidoPorCategoriaRes,
          distribuicaoMargemLucro: distribuicaoMargemLucroRes,
          vendasEmAberto: vendasEmAbertoRes ?? null,
        });
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard:", err);
        setError("Erro ao carregar informações");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { dados, loading, error };
};
```

**Funcionalidades**:

- Carregamento paralelo de dados
- Métricas de estoque
- Dados financeiros
- Evolução de lucros
- Distribuição de margens
- Vendas em aberto

### **7. useProdutos.ts**

**Responsabilidade**: Gestão de produtos

```typescript
export const useProdutos = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchAllProdutos();
      setProducts(data as Product[]);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      setError("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return { products, loading, error, reload: loadProducts };
};
```

**Funcionalidades**:

- Carregamento de produtos
- Controle de estoque
- Tratamento de erros
- Função de reload

### **8. useRelatorios.ts**

**Responsabilidade**: Geração de relatórios

```typescript
export const useRelatorios = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gerarRelatorio = async (tipo: string, filtros: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/relatorios/${tipo}`, {
        params: filtros,
      });

      return response.data;
    } catch (err) {
      console.error("Erro ao gerar relatório:", err);
      setError("Erro ao gerar relatório");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const exportarRelatorio = async (
    tipo: string,
    formato: string,
    filtros: any
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/relatorios/${tipo}/export`, {
        params: { ...filtros, formato },
        responseType: "blob",
      });

      return response.data;
    } catch (err) {
      console.error("Erro ao exportar relatório:", err);
      setError("Erro ao exportar relatório");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    gerarRelatorio,
    exportarRelatorio,
  };
};
```

**Funcionalidades**:

- Geração de relatórios
- Exportação em diferentes formatos
- Filtros avançados
- Tratamento de erros

### **9. useUsers.ts**

**Responsabilidade**: Gestão de usuários

```typescript
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");
      setUsers(response.data.data);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
      setError("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      setLoading(true);
      const response = await api.put(`/users/${id}`, userData);

      // Atualizar lista local
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, ...response.data.data } : user
        )
      );

      return response.data;
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      setError("Erro ao atualizar usuário");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return { users, loading, error, loadUsers, updateUser };
};
```

**Funcionalidades**:

- Carregamento de usuários
- Atualização de dados
- Gerenciamento de estado local
- Tratamento de erros

### **10. useVendas.ts**

**Responsabilidade**: Gestão de vendas

```typescript
export const useVendas = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitVenda = async (venda: VendaData) => {
    try {
      setLoading(true);
      setError(null);
      const resposta = await criarVenda(venda);
      return resposta;
    } catch (err) {
      console.error("Erro ao cadastrar venda:", err);
      setError("Erro ao cadastrar venda");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitVenda, loading, error };
};
```

**Funcionalidades**:

- Submissão de vendas
- Validação de dados
- Tratamento de erros
- Estado de carregamento

### **11. useVendasList.ts**

**Responsabilidade**: Listagem de vendas

```typescript
export const useVendasList = () => {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadVendas = async (filtros?: VendaFiltros) => {
    try {
      setLoading(true);
      const response = await api.get("/vendas/todas", {
        params: filtros,
      });
      setVendas(response.data);
    } catch (err) {
      console.error("Erro ao carregar vendas:", err);
      setError("Erro ao carregar vendas");
    } finally {
      setLoading(false);
    }
  };

  const updateVenda = async (id: string, vendaData: Partial<Venda>) => {
    try {
      setLoading(true);
      const response = await api.put(`/vendas/altera/${id}`, vendaData);

      // Atualizar lista local
      setVendas((prev) =>
        prev.map((venda) =>
          venda.id === id ? { ...venda, ...response.data } : venda
        )
      );

      return response.data;
    } catch (err) {
      console.error("Erro ao atualizar venda:", err);
      setError("Erro ao atualizar venda");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendas();
  }, []);

  return { vendas, loading, error, loadVendas, updateVenda };
};
```

**Funcionalidades**:

- Carregamento de vendas
- Filtros de busca
- Atualização de vendas
- Gerenciamento de estado local

### **12. useVendasVencidas.ts**

**Responsabilidade**: Monitoramento de vendas vencidas

```typescript
export const useVendasVencidas = () => {
  const [vendas, setVendas] = useState<VendaResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/vendas/vencidas");
      setVendas(response.data.vendas || []);
    } catch (err) {
      console.error("Erro ao carregar vendas vencidas:", err);
      setError("Erro ao carregar vendas vencidas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { vendas, loading, error, loadData };
};
```

**Funcionalidades**:

- Carregamento de vendas vencidas
- Atualização automática
- Tratamento de erros
- Callback para reload

### **13. use-mobile.ts**

**Responsabilidade**: Detecção de dispositivos móveis

```typescript
import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
```

**Funcionalidades**:

- Detecção de dispositivos móveis
- Breakpoint configurável
- Listener de mudanças de tela
- Cleanup automático

## 🎯 Padrões de Implementação

### **Estrutura Padrão**

```typescript
export const use[NomeFuncionalidade] = () => {
  // 1. Estados
  const [data, setData] = useState<Type[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Funções principais
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/endpoint");
      setData(response.data);
    } catch (err) {
      setError("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  // 3. Efeitos
  useEffect(() => {
    loadData();
  }, []);

  // 4. Retorno
  return {
    data,
    loading,
    error,
    loadData,
    // outras funções
  };
};
```

### **Tratamento de Erros**

```typescript
const handleError = (err: any, defaultMessage: string) => {
  console.error("Erro:", err);
  setError(err.response?.data?.message || defaultMessage);
};
```

### **Estados de Loading**

```typescript
const [loading, setLoading] = useState(false);

const executeAction = async () => {
  try {
    setLoading(true);
    // ação
  } finally {
    setLoading(false);
  }
};
```

### **Cleanup de Efeitos**

```typescript
useEffect(() => {
  const controller = new AbortController();

  const fetchData = async () => {
    try {
      const response = await fetch("/api/data", {
        signal: controller.signal,
      });
      // processar dados
    } catch (err) {
      if (err.name !== "AbortError") {
        // tratar erro
      }
    }
  };

  fetchData();

  return () => {
    controller.abort();
  };
}, []);
```

## 🚀 Performance

### **Otimizações Implementadas**

- **useCallback**: Para funções que são passadas como props
- **useMemo**: Para valores calculados
- **Dependency arrays**: Para controlar re-renders
- **Cleanup**: Para evitar memory leaks

### **Exemplo de Otimização**

```typescript
const memoizedData = useMemo(() => {
  return data.filter((item) => item.active);
}, [data]);

const handleAction = useCallback((id: string) => {
  // ação
}, []);
```

## 🔧 Manutenção

### **Versionamento**

- **Semantic versioning**: Para mudanças de API
- **Breaking changes**: Documentados claramente
- **Migration guide**: Para atualizações

### **Testes**

- **Unit tests**: Para lógica de hooks
- **Integration tests**: Para interação com APIs
- **Mocking**: Para dependências externas

### **Documentação**

- **JSDoc**: Para documentar funções
- **TypeScript**: Para type safety
- **Examples**: Para casos de uso

---

**Este documento é atualizado regularmente conforme novos hooks são adicionados ao sistema.**
