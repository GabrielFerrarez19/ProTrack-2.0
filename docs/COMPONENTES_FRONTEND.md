# 🎨 Componentes Frontend - ProTrack 2.0

## 📖 Visão Geral

Este documento detalha todos os componentes React implementados no frontend do ProTrack 2.0, organizados por funcionalidade e categoria.

## 🏗️ Estrutura de Componentes

### **Componentes Base (UI)**

#### **Button Component**

- **Arquivo**: `components/button.tsx`
- **Descrição**: Componente de botão customizado
- **Props**: `Text`, `type`, `onClick`, `disabled`
- **Uso**: Botões em formulários e ações

#### **Input Component**

- **Arquivo**: `components/input.tsx`
- **Descrição**: Componente de input customizado
- **Props**: `type`, `placeholder`, `value`, `onChange`
- **Uso**: Campos de entrada em formulários

### **Componentes de Layout**

#### **Header Component**

- **Arquivo**: `components/header/`
- **Descrição**: Cabeçalho das páginas
- **Props**: `title`, `text`
- **Uso**: Títulos e descrições de páginas

#### **Sidebar Components**

- **Arquivos**:
  - `components/Sidebar/Sidebar.tsx`
  - `components/Sidebar/SidebarItem.tsx`
  - `components/Sidebar/SidebarContext.tsx`
- **Descrição**: Navegação lateral da aplicação
- **Funcionalidades**: Menu responsivo, itens ativos, contexto de estado

#### **DefaultLayout**

- **Arquivo**: `layout/DefaultLayout/Index.tsx`
- **Descrição**: Layout padrão da aplicação
- **Funcionalidades**: Sidebar, área de conteúdo, roteamento

### **Componentes de Roteamento**

#### **ProtectedRoute**

- **Arquivo**: `components/ProtectedRoute.tsx`
- **Descrição**: Proteção de rotas autenticadas
- **Funcionalidades**: Verificação de autenticação, redirecionamento

#### **PublicRoute**

- **Arquivo**: `components/PublicRoute.tsx`
- **Descrição**: Rotas públicas (login, etc.)
- **Funcionalidades**: Redirecionamento se autenticado

## 📱 Componentes por Página

### **Login**

#### **Login Component**

- **Arquivo**: `pages/Login/index.tsx`
- **Descrição**: Página de autenticação
- **Funcionalidades**: Formulário de login, validação, redirecionamento

### **Status/Dashboard**

#### **CardsStatus**

- **Arquivo**: `pages/Status/CardsStatus/index.tsx`
- **Descrição**: Cards de resumo do dashboard
- **Funcionalidades**: Métricas principais, indicadores visuais

#### **CardsClientes**

- **Arquivo**: `pages/Status/CardsClientes/index.tsx`
- **Descrição**: Cards relacionados a clientes
- **Funcionalidades**: Estatísticas de clientes

#### **TableData**

- **Arquivo**: `pages/Status/TabelaDados/index.tsx`
- **Descrição**: Tabela de dados do dashboard
- **Funcionalidades**: Dados tabulares, ordenação

### **Clientes**

#### **ClientTable**

- **Arquivo**: `pages/Clientes/components/ClientTable.tsx`
- **Descrição**: Tabela de clientes
- **Funcionalidades**: Listagem, edição, exclusão

#### **SearchFilter**

- **Arquivo**: `pages/Clientes/components/SearchFilter.tsx`
- **Descrição**: Filtro de busca de clientes
- **Funcionalidades**: Busca em tempo real

#### **DialogAlterCliente**

- **Arquivo**: `pages/Clientes/components/DialogAlterCliente.tsx`
- **Descrição**: Modal de edição de cliente
- **Funcionalidades**: Formulário de edição

#### **ResumoVendas**

- **Arquivo**: `pages/Clientes/components/ResumoVendas.tsx`
- **Descrição**: Resumo de vendas do cliente
- **Funcionalidades**: Histórico de vendas

#### **ClientForm**

- **Arquivo**: `pages/CadClient/components/ClientForm.tsx`
- **Descrição**: Formulário de cadastro de cliente
- **Funcionalidades**: Validação, submissão

### **Produtos/Estoque**

#### **ProductTable**

- **Arquivo**: `pages/Estoque/Components/ProductTable.tsx`
- **Descrição**: Tabela de produtos
- **Funcionalidades**: Listagem, edição, controle de estoque

#### **SearchFilter**

- **Arquivo**: `pages/Estoque/Components/SearchFilter.tsx`
- **Descrição**: Filtro de busca de produtos
- **Funcionalidades**: Busca por nome, categoria, código

#### **DialogAlter**

- **Arquivo**: `pages/Estoque/Components/DialogAlter.tsx`
- **Descrição**: Modal de edição de produto
- **Funcionalidades**: Formulário de edição

#### **ProductForm**

- **Arquivo**: `pages/CadProduct/components/ProductForm.tsx`
- **Descrição**: Formulário de cadastro de produto
- **Funcionalidades**: Validação, upload de imagens

### **Vendas**

#### **ProdutoSelect**

- **Arquivo**: `pages/Vendas/components/ProdutoSelect.tsx`
- **Descrição**: Seleção de produtos para venda
- **Funcionalidades**: Busca, seleção múltipla

#### **ClienteSelect**

- **Arquivo**: `pages/Vendas/components/clienteSelect.tsx`
- **Descrição**: Seleção de cliente
- **Funcionalidades**: Busca de clientes

#### **ProdutosTable**

- **Arquivo**: `pages/Vendas/components/ProdutosTable.tsx`
- **Descrição**: Tabela de produtos da venda
- **Funcionalidades**: Adicionar/remover, calcular totais

#### **ProdutoRow**

- **Arquivo**: `pages/Vendas/components/ProdutoRow.tsx`
- **Descrição**: Linha de produto na venda
- **Funcionalidades**: Edição de quantidade, preço

#### **ResumoVenda**

- **Arquivo**: `pages/Vendas/components/ResumoVenda.tsx`
- **Descrição**: Resumo da venda
- **Funcionalidades**: Cálculos, totais, desconto

#### **InformacoesVenda**

- **Arquivo**: `pages/Vendas/components/InformacoesVenda.tsx`
- **Descrição**: Informações gerais da venda
- **Funcionalidades**: Data, cliente, forma de pagamento

### **Total de Vendas**

#### **VendasTable**

- **Arquivo**: `pages/TotalVenda/components/VendasTable.tsx`
- **Descrição**: Tabela de todas as vendas
- **Funcionalidades**: Listagem, filtros, ações

#### **SearchFilter**

- **Arquivo**: `pages/TotalVenda/components/SearchFilter.tsx`
- **Descrição**: Filtro de vendas
- **Funcionalidades**: Busca por cliente, data, status

#### **DialogAlter**

- **Arquivo**: `pages/TotalVenda/components/DialogAlter.tsx`
- **Descrição**: Modal de edição de venda
- **Funcionalidades**: Edição de status, forma de pagamento

#### **ProdutoSelect**

- **Arquivo**: `pages/TotalVenda/components/ProdutoSelect.tsx`
- **Descrição**: Seleção de produtos
- **Funcionalidades**: Busca e seleção

### **Financeiro**

#### **SaldoCards**

- **Arquivo**: `pages/Financeiro/components/SaldoCards.tsx`
- **Descrição**: Cards de saldo financeiro
- **Funcionalidades**: Saldo atual, receitas, despesas

#### **ResumoVendas**

- **Arquivo**: `pages/Financeiro/components/ResumoVendas.tsx`
- **Descrição**: Resumo de vendas financeiras
- **Funcionalidades**: Gráficos, métricas

#### **FluxoCaixaChart**

- **Arquivo**: `pages/Financeiro/components/FluxoCaixaChart.tsx`
- **Descrição**: Gráfico de fluxo de caixa
- **Funcionalidades**: Visualização temporal

#### **TopProdutosChart**

- **Arquivo**: `pages/Financeiro/components/TopProdutosChart.tsx`
- **Descrição**: Gráfico dos produtos mais vendidos
- **Funcionalidades**: Ranking de produtos

#### **DistribuicaoVendasChart**

- **Arquivo**: `pages/Financeiro/components/DistribuicaoVendasChart.tsx`
- **Descrição**: Gráfico de distribuição de vendas
- **Funcionalidades**: Distribuição por categoria

#### **ValorEstoqueCard**

- **Arquivo**: `pages/Financeiro/components/ValorEstoqueCard.tsx`
- **Descrição**: Card de valor do estoque
- **Funcionalidades**: Valor investido, potencial

#### **ContasPagarCard**

- **Arquivo**: `pages/Financeiro/components/ContasPagarCard.tsx`
- **Descrição**: Card de contas a pagar
- **Funcionalidades**: Resumo de obrigações

#### **AlertasDashboard**

- **Arquivo**: `pages/Financeiro/components/AlertasDashboard.tsx`
- **Descrição**: Alertas do dashboard
- **Funcionalidades**: Notificações importantes

### **Contas a Pagar**

#### **SummaryCards**

- **Arquivo**: `pages/ContasPagar/components/SummaryCards.tsx`
- **Descrição**: Cards de resumo de contas
- **Funcionalidades**: Totais, status, indicadores

#### **FiltersBar**

- **Arquivo**: `pages/ContasPagar/components/FiltersBar.tsx`
- **Descrição**: Barra de filtros
- **Funcionalidades**: Busca, filtros por status/categoria

#### **AccountsTable**

- **Arquivo**: `pages/ContasPagar/components/AccountsTable.tsx`
- **Descrição**: Tabela de contas a pagar
- **Funcionalidades**: Listagem, ações, pagamento

#### **StatusMonitoramento**

- **Arquivo**: `pages/ContasPagar/components/StatusMonitoramento.tsx`
- **Descrição**: Status do monitoramento
- **Funcionalidades**: Indicador de sistema

#### **FormContasPagar**

- **Arquivo**: `pages/CadastroContasPagar/components/FormContasPagar.tsx`
- **Descrição**: Formulário de contas a pagar
- **Funcionalidades**: Cadastro, validação

#### **FormActions**

- **Arquivo**: `pages/CadastroContasPagar/components/FormActions.tsx`
- **Descrição**: Ações do formulário
- **Funcionalidades**: Salvar, cancelar, limpar

### **Contas a Receber**

#### **ResumoCards**

- **Arquivo**: `pages/ContasReceber/components/ResumoCards.tsx`
- **Descrição**: Cards de resumo
- **Funcionalidades**: Totais, status

#### **FiltrosContas**

- **Arquivo**: `pages/ContasReceber/components/FiltrosContas.tsx`
- **Descrição**: Filtros de contas
- **Funcionalidades**: Busca, filtros

#### **TabelaContas**

- **Arquivo**: `pages/ContasReceber/components/TabelaContas.tsx`
- **Descrição**: Tabela de contas a receber
- **Funcionalidades**: Listagem, ações

#### **StatusBadge**

- **Arquivo**: `pages/ContasReceber/components/StatusBadge.tsx`
- **Descrição**: Badge de status
- **Funcionalidades**: Indicador visual de status

#### **CardMonitoramento**

- **Arquivo**: `pages/ContasReceber/components/CardMonitoramento.tsx`
- **Descrição**: Card de monitoramento
- **Funcionalidades**: Status do sistema

#### **StatusMonitoramento**

- **Arquivo**: `pages/ContasReceber/components/StatusMonitoramento.tsx`
- **Descrição**: Status do monitoramento
- **Funcionalidades**: Indicador de execução

### **Fluxo de Caixa**

#### **ResumoCards**

- **Arquivo**: `pages/FluxoCaixa/components/ResumoCards.tsx`
- **Descrição**: Cards de resumo do fluxo
- **Funcionalidades**: Saldo, entradas, saídas

#### **GraficoFluxo**

- **Arquivo**: `pages/FluxoCaixa/components/GraficoFluxo.tsx`
- **Descrição**: Gráfico principal do fluxo
- **Funcionalidades**: Visualização temporal

#### **Categorias**

- **Arquivo**: `pages/FluxoCaixa/components/Categorias.tsx`
- **Descrição**: Análise por categorias
- **Funcionalidades**: Distribuição por categoria

#### **ComparativoPeriodos**

- **Arquivo**: `pages/FluxoCaixa/components/ComparativoPeriodos.tsx`
- **Descrição**: Comparação entre períodos
- **Funcionalidades**: Análise comparativa

### **Relatórios Financeiros**

#### **CardsResumo**

- **Arquivo**: `pages/RelatoriosFinanceiros/components/CardsResumo.tsx`
- **Descrição**: Cards de resumo dos relatórios
- **Funcionalidades**: Métricas principais

#### **GraficosPrincipais**

- **Arquivo**: `pages/RelatoriosFinanceiros/components/GraficosPrincipais.tsx`
- **Descrição**: Gráficos principais
- **Funcionalidades**: Visualizações de dados

#### **AnalisesDetalhadas**

- **Arquivo**: `pages/RelatoriosFinanceiros/components/AnalisesDetalhadas.tsx`
- **Descrição**: Análises detalhadas
- **Funcionalidades**: Tabelas de dados

#### **RelatorioConfig**

- **Arquivo**: `pages/RelatoriosFinanceiros/components/RelatorioConfig.tsx`
- **Descrição**: Configuração de relatórios
- **Funcionalidades**: Filtros, período, tipo

### **Configurações Financeiras**

#### **ContasBancarias**

- **Arquivo**: `pages/ConfigFinanceiro/components/ContasBancarias.tsx`
- **Descrição**: Gestão de contas bancárias
- **Funcionalidades**: CRUD de contas

#### **MetodosPagamento**

- **Arquivo**: `pages/ConfigFinanceiro/components/MetodosPagamento.tsx`
- **Descrição**: Gestão de métodos de pagamento
- **Funcionalidades**: CRUD, ativação/desativação

#### **Categorias**

- **Arquivo**: `pages/ConfigFinanceiro/components/Categorias.tsx`
- **Descrição**: Gestão de categorias
- **Funcionalidades**: CRUD, cores, tipos

#### **CategoriaDialog**

- **Arquivo**: `pages/ConfigFinanceiro/components/CategoriaDialog.tsx`
- **Descrição**: Modal de categoria
- **Funcionalidades**: Formulário de categoria

#### **LimitesFluxoCaixa**

- **Arquivo**: `pages/ConfigFinanceiro/components/LimitesFluxoCaixa.tsx`
- **Descrição**: Configuração de limites
- **Funcionalidades**: Definição de limites

#### **Alertas**

- **Arquivo**: `pages/ConfigFinanceiro/components/Alertas.tsx`
- **Descrição**: Configuração de alertas
- **Funcionalidades**: Toggle de alertas

### **Configurações de Usuários**

#### **AvatarCard**

- **Arquivo**: `pages/ConfigUsers/components/AvatarCard.tsx`
- **Descrição**: Card de avatar do usuário
- **Funcionalidades**: Foto, informações básicas

#### **ProfileFormCard**

- **Arquivo**: `pages/ConfigUsers/components/ProfileFormCard.tsx`
- **Descrição**: Formulário de perfil
- **Funcionalidades**: Edição de dados pessoais

## 🎯 Padrões de Componentes

### **Nomenclatura**

- **Componentes**: PascalCase (`UserProfile.tsx`)
- **Arquivos de componentes**: PascalCase com sufixo (`UserProfile.tsx`)
- **Props**: camelCase (`userName`, `onSubmit`)
- **Estados**: camelCase (`isLoading`, `userData`)

### **Estrutura de Arquivos**

```
components/
├── ComponentName/
│   ├── ComponentName.tsx
│   ├── ComponentName.types.ts
│   ├── ComponentName.styles.ts
│   └── index.ts
```

### **Props Interface**

```typescript
interface ComponentNameProps {
  // Props obrigatórias primeiro
  title: string;
  onAction: () => void;

  // Props opcionais depois
  className?: string;
  disabled?: boolean;

  // Props de estado
  loading?: boolean;
  error?: string;
}
```

### **Hooks Customizados**

- **useState**: Para estado local
- **useEffect**: Para efeitos colaterais
- **useCallback**: Para funções memoizadas
- **useMemo**: Para valores calculados
- **Custom hooks**: Para lógica reutilizável

### **Validação**

- **Zod**: Para validação de formulários
- **React Hook Form**: Para gerenciamento de formulários
- **Validação em tempo real**: Para feedback imediato

## 🚀 Performance

### **Otimizações Implementadas**

- **React.memo**: Para componentes que não precisam re-renderizar
- **useMemo**: Para cálculos pesados
- **useCallback**: Para funções passadas como props
- **Lazy loading**: Para componentes grandes
- **Code splitting**: Para reduzir bundle inicial

### **Boas Práticas**

- **Componentes pequenos**: Foco em uma responsabilidade
- **Props tipadas**: TypeScript para type safety
- **Estado local**: Quando possível, usar estado local
- **Cleanup**: Limpar efeitos e listeners
- **Error boundaries**: Para capturar erros

## 📱 Responsividade

### **Breakpoints**

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### **Hook de Detecção**

```typescript
// hooks/use-mobile.ts
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
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

## 🎨 Estilização

### **Tailwind CSS**

- **Classes utilitárias**: Para estilização rápida
- **Responsive design**: Prefixos sm:, md:, lg:
- **Dark mode**: Suporte a tema escuro
- **Customização**: Configuração personalizada

### **Componentes UI**

- **shadcn/ui**: Biblioteca de componentes base
- **Radix UI**: Componentes acessíveis
- **Lucide React**: Ícones consistentes

## 🔧 Manutenção

### **Versionamento**

- **Semantic versioning**: Para mudanças de API
- **Changelog**: Para documentar mudanças
- **Breaking changes**: Documentados claramente

### **Testes**

- **Unit tests**: Para lógica de componentes
- **Integration tests**: Para fluxos completos
- **Visual regression**: Para mudanças de UI

### **Documentação**

- **Storybook**: Para documentar componentes
- **Props documentation**: Para cada componente
- **Examples**: Para casos de uso

---

**Este documento é atualizado regularmente conforme novos componentes são adicionados ao sistema.**
