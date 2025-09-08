# Componentes e Hooks - ProTrack 2.0

## Visão Geral

O frontend do ProTrack 2.0 é construído com React 19 e TypeScript, utilizando uma arquitetura baseada em componentes reutilizáveis, hooks customizados e padrões modernos de desenvolvimento. A interface é responsiva, acessível e otimizada para performance.

## Arquitetura de Componentes

### Padrão Atomic Design

O sistema segue o padrão Atomic Design, organizando componentes em diferentes níveis de complexidade:

#### 1. Átomos (Atoms)

Componentes básicos e indivisíveis:

```typescript
// components/atoms/Button.tsx
interface ButtonProps {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  children,
}) => {
  const baseClasses =
    "font-medium rounded-lg transition-colors focus:outline-none focus:ring-2";
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${
        sizeClasses[size]
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

```typescript
// components/atoms/Input.tsx
interface InputProps {
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
}) => {
  return (
    <div className="w-full">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        required={required}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
```

#### 2. Moléculas (Molecules)

Combinação de átomos para formar componentes mais complexos:

```typescript
// components/molecules/SearchBar.tsx
interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  loading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Buscar...",
  onSearch,
  loading = false,
}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1 relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={setQuery}
        />
        <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? <Spinner /> : "Buscar"}
      </Button>
    </form>
  );
};
```

```typescript
// components/molecules/SummaryCard.tsx
interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: "blue" | "green" | "red" | "orange";
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
}) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    red: "bg-red-50 border-red-200",
    orange: "bg-orange-50 border-orange-200",
  };

  const iconColorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
    orange: "text-orange-600",
  };

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p
              className={`text-sm ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${iconColorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
```

#### 3. Organismos (Organisms)

Componentes complexos que combinam moléculas e átomos:

```typescript
// components/organisms/DataTable.tsx
interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onSort?: (key: keyof T, direction: "asc" | "desc") => void;
  onRowClick?: (item: T) => void;
}

export const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  onSort,
  onRowClick,
}: DataTableProps<T>) => {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (key: keyof T) => {
    if (!onSort) return;

    const newDirection =
      sortKey === key && sortDirection === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortDirection(newDirection);
    onSort(key, newDirection);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                }`}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable && <ChevronUpDown className="h-4 w-4" />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr
              key={index}
              className={`hover:bg-gray-50 ${
                onRowClick ? "cursor-pointer" : ""
              }`}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {column.render
                    ? column.render(item[column.key], item)
                    : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

## Componentes de Layout

### Layout Principal

```typescript
// components/layout/MainLayout.tsx
interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
```

### Sidebar

```typescript
// components/layout/Sidebar.tsx
interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Vendas", href: "/vendas", icon: ShoppingCart },
    { name: "Clientes", href: "/clientes", icon: Users },
    { name: "Produtos", href: "/produtos", icon: Package },
    { name: "Contas a Pagar", href: "/contas-pagar", icon: CreditCard },
    { name: "Relatórios", href: "/relatorios", icon: BarChart3 },
    { name: "Usuários", href: "/usuarios", icon: User, adminOnly: true },
  ];

  const filteredNavigation = navigation.filter(
    (item) => !item.adminOnly || user?.role === "admin"
  );

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${open ? "block" : "hidden"}`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={onClose}
        />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <SidebarContent navigation={filteredNavigation} onClose={onClose} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <SidebarContent navigation={filteredNavigation} />
        </div>
      </div>
    </>
  );
};
```

## Componentes de Páginas

### Dashboard

```typescript
// components/pages/Dashboard.tsx
export const Dashboard: React.FC = () => {
  const { dashboard, loading } = useDashboard();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total de Vendas"
          value={dashboard?.totalVendas || 0}
          icon={<ShoppingCart className="h-6 w-6" />}
          color="blue"
          trend={dashboard?.vendasTrend}
        />
        <SummaryCard
          title="Clientes Ativos"
          value={dashboard?.clientesAtivos || 0}
          icon={<Users className="h-6 w-6" />}
          color="green"
          trend={dashboard?.clientesTrend}
        />
        <SummaryCard
          title="Produtos em Estoque"
          value={dashboard?.produtosEstoque || 0}
          icon={<Package className="h-6 w-6" />}
          color="orange"
        />
        <SummaryCard
          title="Contas a Pagar"
          value={dashboard?.contasPagar || 0}
          icon={<CreditCard className="h-6 w-6" />}
          color="red"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VendasChart data={dashboard?.vendasChart} />
        <ProdutosChart data={dashboard?.produtosChart} />
      </div>

      {/* Recent Activity */}
      <RecentActivity activities={dashboard?.recentActivity} />
    </div>
  );
};
```

### Contas a Pagar

```typescript
// components/pages/ContasPagar.tsx
export const ContasPagar: React.FC = () => {
  const { contasVencidas, proximosVencimentos, dashboard, loading, error } =
    useContasPagar();

  const [activeTab, setActiveTab] = useState<"vencidas" | "proximas" | "todas">(
    "vencidas"
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Contas a Pagar</h1>
        <Button onClick={() => navigate("/contas-pagar/nova")}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Conta
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Pendente"
          value={`R$ ${dashboard?.totalPendente?.toFixed(2) || "0,00"}`}
          icon={<DollarSign className="h-6 w-6" />}
          color="blue"
        />
        <SummaryCard
          title="Vencidas Hoje"
          value={`R$ ${dashboard?.vencidasHoje?.toFixed(2) || "0,00"}`}
          icon={<AlertTriangle className="h-6 w-6" />}
          color="red"
        />
        <SummaryCard
          title="Próximos 7 Dias"
          value={`R$ ${dashboard?.proximosVencimentos?.toFixed(2) || "0,00"}`}
          icon={<Calendar className="h-6 w-6" />}
          color="orange"
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            {
              key: "vencidas",
              label: "Vencidas Hoje",
              count: contasVencidas.length,
            },
            {
              key: "proximas",
              label: "Próximos 7 Dias",
              count: proximosVencimentos.length,
            },
            { key: "todas", label: "Todas as Contas", count: 0 },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === "vencidas" && <AccountsTable accounts={contasVencidas} />}
      {activeTab === "proximas" && (
        <AccountsTable accounts={proximosVencimentos} />
      )}
      {activeTab === "todas" && <AllAccountsTable />}
    </div>
  );
};
```

## Hooks Customizados

### useAuth

Hook principal para gerenciamento de autenticação:

```typescript
// hooks/useAuth.ts
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "financeiro" | "vendedor" | "operador";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
  });

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true }));

      const response = await authService.login(email, password);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setState({
        user,
        token,
        isAuthenticated: true,
        loading: false,
      });

      return { success: true };
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false }));
      return { success: false, error: error.message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
  }, []);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        const isValid = await authService.validateToken(token);

        if (isValid) {
          setState({
            user,
            token,
            isAuthenticated: true,
            loading: false,
          });
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
    } else {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [logout]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    ...state,
    login,
    logout,
    checkAuth,
  };
};
```

### useContasPagar

Hook para o sistema inteligente de vencimentos:

```typescript
// hooks/useContasPagar.ts
interface ContaPagar {
  id: number;
  fornecedor: Fornecedor;
  description: string;
  amount: number;
  dueDate: string;
  status: "pendente" | "paga" | "vencida";
  createdAt: string;
  updatedAt: string;
}

interface DashboardData {
  totalPendente: number;
  vencidasHoje: number;
  proximosVencimentos: number;
  contasVencidas: number;
  contasProximas: number;
}

export const useContasPagar = () => {
  const [contasVencidas, setContasVencidas] = useState<ContaPagar[]>([]);
  const [proximosVencimentos, setProximosVencimentos] = useState<ContaPagar[]>(
    []
  );
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContasVencidas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await contasPagarService.getContasVencidasHoje();
      setContasVencidas(response.data);
    } catch (err) {
      setError("Erro ao buscar contas vencidas");
      console.error("Erro ao buscar contas vencidas:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProximosVencimentos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await contasPagarService.getProximosVencimentos();
      setProximosVencimentos(response.data);
    } catch (err) {
      setError("Erro ao buscar próximos vencimentos");
      console.error("Erro ao buscar próximos vencimentos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await contasPagarService.getDashboard();
      setDashboard(response.data);
    } catch (err) {
      setError("Erro ao buscar dados do dashboard");
      console.error("Erro ao buscar dados do dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createContaPagar = useCallback(
    async (contaData: Omit<ContaPagar, "id" | "createdAt" | "updatedAt">) => {
      try {
        setLoading(true);
        setError(null);

        const response = await contasPagarService.createContaPagar(contaData);

        // Atualizar listas relevantes
        if (new Date(contaData.dueDate) <= new Date()) {
          setContasVencidas((prev) => [response.data, ...prev]);
        } else {
          const proximos7Dias = new Date();
          proximos7Dias.setDate(proximos7Dias.getDate() + 7);

          if (new Date(contaData.dueDate) <= proximos7Dias) {
            setProximosVencimentos((prev) => [response.data, ...prev]);
          }
        }

        return { success: true, data: response.data };
      } catch (err) {
        const errorMessage = "Erro ao criar conta a pagar";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateContaPagar = useCallback(
    async (id: number, contaData: Partial<ContaPagar>) => {
      try {
        setLoading(true);
        setError(null);

        const response = await contasPagarService.updateContaPagar(
          id,
          contaData
        );

        // Atualizar listas relevantes
        setContasVencidas((prev) =>
          prev.map((conta) => (conta.id === id ? response.data : conta))
        );
        setProximosVencimentos((prev) =>
          prev.map((conta) => (conta.id === id ? response.data : conta))
        );

        return { success: true, data: response.data };
      } catch (err) {
        const errorMessage = "Erro ao atualizar conta a pagar";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const markAsPaid = useCallback(
    async (id: number) => {
      return updateContaPagar(id, { status: "paga" });
    },
    [updateContaPagar]
  );

  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchContasVencidas(),
      fetchProximosVencimentos(),
      fetchDashboard(),
    ]);
  }, [fetchContasVencidas, fetchProximosVencimentos, fetchDashboard]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    contasVencidas,
    proximosVencimentos,
    dashboard,
    loading,
    error,
    fetchContasVencidas,
    fetchProximosVencimentos,
    fetchDashboard,
    createContaPagar,
    updateContaPagar,
    markAsPaid,
    refreshData,
  };
};
```

### useVendas

Hook para gerenciamento de vendas:

```typescript
// hooks/useVendas.ts
interface Venda {
  id: number;
  cliente: Cliente;
  produtos: Array<{
    produto: Produto;
    quantity: number;
    preco: number;
  }>;
  total: number;
  status: "pendente" | "confirmada" | "enviada" | "entregue" | "cancelada";
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

interface VendasFilters {
  status?: string;
  clienteId?: number;
  dataInicio?: string;
  dataFim?: string;
  page?: number;
  limit?: number;
}

export const useVendas = () => {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchVendas = useCallback(async (filters: VendasFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await vendaService.getVendas(filters);
      setVendas(response.data.vendas);
      setPagination(response.data.pagination);
    } catch (err) {
      setError("Erro ao buscar vendas");
      console.error("Erro ao buscar vendas:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createVenda = useCallback(
    async (vendaData: Omit<Venda, "id" | "createdAt" | "updatedAt">) => {
      try {
        setLoading(true);
        setError(null);

        const response = await vendaService.createVenda(vendaData);
        setVendas((prev) => [response.data, ...prev]);

        return { success: true, data: response.data };
      } catch (err) {
        const errorMessage = "Erro ao criar venda";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateVenda = useCallback(
    async (id: number, vendaData: Partial<Venda>) => {
      try {
        setLoading(true);
        setError(null);

        const response = await vendaService.updateVenda(id, vendaData);
        setVendas((prev) =>
          prev.map((venda) => (venda.id === id ? response.data : venda))
        );

        return { success: true, data: response.data };
      } catch (err) {
        const errorMessage = "Erro ao atualizar venda";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteVenda = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      await vendaService.deleteVenda(id);
      setVendas((prev) => prev.filter((venda) => venda.id !== id));

      return { success: true };
    } catch (err) {
      const errorMessage = "Erro ao deletar venda";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(
    async (id: number, status: Venda["status"]) => {
      return updateVenda(id, { status });
    },
    [updateVenda]
  );

  useEffect(() => {
    fetchVendas();
  }, [fetchVendas]);

  return {
    vendas,
    loading,
    error,
    pagination,
    fetchVendas,
    createVenda,
    updateVenda,
    deleteVenda,
    updateStatus,
  };
};
```

### useDashboard

Hook para dados do dashboard principal:

```typescript
// hooks/useDashboard.ts
interface DashboardData {
  totalVendas: number;
  clientesAtivos: number;
  produtosEstoque: number;
  contasPagar: number;
  vendasChart: Array<{
    date: string;
    value: number;
  }>;
  produtosChart: Array<{
    name: string;
    value: number;
  }>;
  recentActivity: Array<{
    id: number;
    type: string;
    description: string;
    timestamp: string;
  }>;
  vendasTrend: {
    value: number;
    isPositive: boolean;
  };
  clientesTrend: {
    value: number;
    isPositive: boolean;
  };
}

export const useDashboard = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await dashboardService.getDashboard();
      setDashboard(response.data);
    } catch (err) {
      setError("Erro ao buscar dados do dashboard");
      console.error("Erro ao buscar dados do dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    dashboard,
    loading,
    error,
    fetchDashboard,
  };
};
```

### usePermissions

Hook para gerenciamento de permissões:

```typescript
// hooks/usePermissions.ts
interface Permission {
  resource: string;
  actions: string[];
}

export const usePermissions = () => {
  const { user } = useAuth();

  const permissions = useMemo(() => {
    if (!user) return [];

    const rolePermissions: Record<string, Permission[]> = {
      admin: [
        { resource: "vendas", actions: ["read", "write", "delete"] },
        { resource: "clientes", actions: ["read", "write", "delete"] },
        { resource: "produtos", actions: ["read", "write", "delete"] },
        { resource: "contas-pagar", actions: ["read", "write", "delete"] },
        { resource: "relatorios", actions: ["read", "write", "delete"] },
        { resource: "usuarios", actions: ["read", "write", "delete"] },
      ],
      financeiro: [
        { resource: "vendas", actions: ["read"] },
        { resource: "clientes", actions: ["read"] },
        { resource: "produtos", actions: ["read"] },
        { resource: "contas-pagar", actions: ["read", "write", "delete"] },
        { resource: "relatorios", actions: ["read", "write"] },
      ],
      vendedor: [
        { resource: "vendas", actions: ["read", "write"] },
        { resource: "clientes", actions: ["read", "write"] },
        { resource: "produtos", actions: ["read"] },
        { resource: "contas-pagar", actions: ["read"] },
        { resource: "relatorios", actions: ["read"] },
      ],
      operador: [
        { resource: "vendas", actions: ["read"] },
        { resource: "clientes", actions: ["read"] },
        { resource: "produtos", actions: ["read"] },
        { resource: "contas-pagar", actions: ["read"] },
      ],
    };

    return rolePermissions[user.role] || [];
  }, [user]);

  const hasPermission = useCallback(
    (resource: string, action: string) => {
      const permission = permissions.find((p) => p.resource === resource);
      return permission?.actions.includes(action) || false;
    },
    [permissions]
  );

  const canRead = useCallback(
    (resource: string) => hasPermission(resource, "read"),
    [hasPermission]
  );
  const canWrite = useCallback(
    (resource: string) => hasPermission(resource, "write"),
    [hasPermission]
  );
  const canDelete = useCallback(
    (resource: string) => hasPermission(resource, "delete"),
    [hasPermission]
  );

  return {
    permissions,
    hasPermission,
    canRead,
    canWrite,
    canDelete,
  };
};
```

## Otimizações de Performance

### Memoização

```typescript
// components/optimized/ExpensiveComponent.tsx
export const ExpensiveComponent = React.memo<Props>(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      processed: expensiveCalculation(item),
    }));
  }, [data]);

  const handleUpdate = useCallback(
    (id: number) => {
      onUpdate(id);
    },
    [onUpdate]
  );

  return (
    <div>
      {processedData.map((item) => (
        <ItemComponent key={item.id} item={item} onUpdate={handleUpdate} />
      ))}
    </div>
  );
});
```

### Lazy Loading

```typescript
// components/lazy/LazyComponent.tsx
const LazyComponent = React.lazy(() => import("./HeavyComponent"));

export const LazyWrapper: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyComponent />
    </Suspense>
  );
};
```

## Responsividade

### Breakpoints

```typescript
// utils/responsive.ts
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<"sm" | "md" | "lg" | "xl">("lg");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint("sm");
      else if (width < 768) setBreakpoint("md");
      else if (width < 1024) setBreakpoint("lg");
      else setBreakpoint("xl");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
};
```

### Componente Responsivo

```typescript
// components/responsive/ResponsiveGrid.tsx
interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
}) => {
  const breakpoint = useBreakpoint();
  const currentCols = cols[breakpoint] || cols.lg || 3;

  return (
    <div className={`grid gap-6 grid-cols-${currentCols}`}>{children}</div>
  );
};
```

## Acessibilidade

### Componente Acessível

```typescript
// components/accessible/AccessibleButton.tsx
interface AccessibleButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  onClick,
  disabled = false,
  ariaLabel,
  ariaDescribedBy,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {children}
    </button>
  );
};
```

## Conclusão

O sistema de componentes e hooks do ProTrack 2.0 é construído com foco em reutilização, performance e acessibilidade. A arquitetura baseada em Atomic Design permite escalabilidade e manutenibilidade, enquanto as otimizações de performance garantem uma experiência de usuário fluida.

Os componentes são totalmente tipados com TypeScript, responsivos e acessíveis, seguindo as melhores práticas de desenvolvimento React moderno. Os hooks customizados encapsulam lógica complexa, melhoram a reutilização de código e facilitam a manutenção do sistema.
