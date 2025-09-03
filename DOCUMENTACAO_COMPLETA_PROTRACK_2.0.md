# 📚 DOCUMENTAÇÃO COMPLETA PROTRACK 2.0

## 🎯 VISÃO GERAL

O **ProTrack 2.0** é um sistema completo de gestão empresarial desenvolvido com arquitetura moderna, oferecendo controle total sobre vendas, estoque, clientes, financeiro e contas a pagar. A aplicação utiliza tecnologias de ponta como React 19, TypeScript, Node.js e MySQL.

## 🏗️ ARQUITETURA DO SISTEMA

### Estrutura Geral
```
ProTrack-2.0/
├── proTrack-client/          # Frontend React + TypeScript
├── protrack-server/          # Backend Node.js + Express
├── protrack.sql              # Script de criação do banco
└── Documentação/             # Arquivos de documentação
```

### Stack Tecnológico

#### Frontend (proTrack-client)
- **React 19.1.0** - Framework principal
- **TypeScript 5.8.3** - Tipagem estática
- **Vite 4.6.0** - Build tool e dev server
- **Tailwind CSS 4.1.11** - Framework CSS
- **Radix UI** - Componentes acessíveis
- **React Router DOM 7.7.1** - Roteamento
- **React Hook Form 7.62.0** - Gerenciamento de formulários
- **Zod 4.0.17** - Validação de schemas
- **Recharts 3.1.2** - Gráficos e visualizações
- **jsPDF 2.5.1** - Geração de PDFs
- **XLSX 0.18.5** - Exportação Excel

#### Backend (protrack-server)
- **Node.js** - Runtime JavaScript
- **Express 4.18.2** - Framework web
- **TypeScript 5.8.3** - Tipagem estática
- **MySQL 3.14.3** - Banco de dados
- **bcrypt 6.0.0** - Criptografia de senhas
- **CORS** - Middleware de segurança

## 🎨 FRONTEND - ESTRUTURA DETALHADA

### 1. Estrutura de Diretórios
```
src/
├── @types/                   # Definições de tipos TypeScript
├── assets/                   # Imagens e recursos estáticos
├── components/               # Componentes reutilizáveis
│   ├── ui/                  # Componentes base (shadcn/ui)
│   ├── header/              # Cabeçalho da aplicação
│   └── Sidebar/             # Menu lateral
├── hooks/                    # Custom hooks React
├── layout/                   # Layouts da aplicação
├── pages/                    # Páginas principais
├── services/                 # Serviços de API
├── utils/                    # Utilitários e funções
└── schemas/                  # Schemas de validação Zod
```

### 2. Sistema de Roteamento
```typescript
// Rotas principais
/                           → Login
/status                     → Status do sistema
/cadastroprodutos          → Cadastro de produtos
/cadastrodeclientes        → Cadastro de clientes
/produtos                  → Gestão de estoque
/clientes                  → Gestão de clientes
/venda                     → Sistema de vendas
/totalVendas               → Relatório de vendas
/financeiro                → Dashboard financeiro
/relatorio                 → Relatórios financeiros
/configfinanceiro          → Configurações financeiras
/contasPagar               → Contas a pagar
/contasReceber             → Contas a receber
/flucoCaixa                → Fluxo de caixa
```

### 3. Componentes Principais

#### Componentes UI Base (shadcn/ui)
- **Button** - Botões com variantes
- **Card** - Containers de conteúdo
- **Input** - Campos de entrada
- **Select** - Seletores dropdown
- **Dialog** - Modais e overlays
- **Toast** - Notificações
- **Table** - Tabelas de dados
- **Progress** - Barras de progresso

#### Componentes Customizados
- **Header** - Cabeçalho com navegação
- **Sidebar** - Menu lateral responsivo
- **FiltersBar** - Barra de filtros
- **SummaryCards** - Cards de resumo
- **AccountsTable** - Tabela de contas

### 4. Hooks Customizados

#### useContasPagar
```typescript
const {
  contas,                    // Lista de contas
  categorias,               // Categorias de despesas
  fornecedores,             // Lista de fornecedores
  resumo,                   // Resumo financeiro
  loading,                  // Estado de carregamento
  error,                    // Tratamento de erros
  
  // Métodos principais
  listarContas,            // Listar contas com filtros
  criarConta,              // Criar nova conta
  atualizarConta,          // Atualizar conta existente
  excluirConta,            // Excluir conta
  marcarComoPaga,          // Marcar conta como paga
  
  // Métodos de fornecedores
  listarFornecedores,      // Listar fornecedores
  criarFornecedor,         // Criar fornecedor
  atualizarFornecedor,     // Atualizar fornecedor
  excluirFornecedor,       // Excluir fornecedor
  
  // Métodos de categorias
  listarCategorias,        // Listar categorias
  criarCategoria,          // Criar categoria
  atualizarCategoria,      // Atualizar categoria
  excluirCategoria,        // Excluir categoria
  
  // Utilitários
  formatarMoeda,           // Formatação de valores
  formatarData,            // Formatação de datas
  calcularDiasAtraso       // Cálculo de atrasos
} = useContasPagar();
```

#### Outros Hooks
- **useDashboard** - Dados do dashboard
- **useVendas** - Gestão de vendas
- **useClientes** - Gestão de clientes
- **useProdutos** - Gestão de produtos
- **useRelatorios** - Geração de relatórios

### 5. Serviços de API

#### Estrutura de Serviços
```typescript
// api.ts - Serviços principais
export const {
  // Autenticação
  loginUser,
  
  // Produtos
  cadastrarProduto,
  atualizarProduto,
  fetchTotalEstoque,
  fetchAllProdutos,
  
  // Clientes
  cadastrarCliente,
  fetchTotalClientes,
  fetchAllClientes,
  atualizarCliente,
  
  // Vendas
  criarVenda,
  fetchTotalVendas,
  fetchAllVendas,
  atualizarVenda,
  
  // Financeiro
  fetchTotalAPagar,
  fetchTotalValorEstoque,
  fetchGiroEstoque,
  
  // Relatórios
  getRelatorioCompleto,
  getRelatorioLucroProduto,
  getRelatorioLucroCategoria,
  
  // Contas a Pagar
  listarContasPagar,
  criarContaPagar,
  atualizarContaPagar,
  excluirContaPagar,
  marcarContaComoPaga,
  obterResumoContasPagar
}
```

## 🖥️ BACKEND - ESTRUTURA DETALHADA

### 1. Estrutura de Diretórios
```
src/
├── @types/                   # Tipos TypeScript
├── config/                   # Configurações
├── controllers/              # Controladores das rotas
├── middlewares/              # Middlewares Express
├── routes/                   # Definição de rotas
├── services/                 # Lógica de negócio
├── utils/                    # Utilitários
└── app.ts                    # Arquivo principal
```

### 2. Configuração do Banco
```typescript
// database.ts
export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "gabri1234",
  database: "protrack",
  port: 3306,
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from("gabri1234\0"),
  },
});
```

### 3. Rotas da API
```typescript
// Rotas principais
/                           → Rotas index
/auth                       → Autenticação
/clients                    → Gestão de clientes
/product                    → Gestão de produtos
/vendas                     → Sistema de vendas
/relatorios                 → Relatórios
/config                     → Configurações
/contas-pagar               → Contas a pagar
/fluxo-caixa               → Fluxo de caixa
/monitoramento              → Monitoramento de vendas
```

### 4. Controladores Principais

#### Auth Controller
- Login de usuários
- Validação de credenciais
- Geração de tokens

#### Client Controller
- CRUD de clientes
- Busca e filtros
- Histórico de vendas

#### Product Controller
- CRUD de produtos
- Gestão de estoque
- Cálculos de margem de lucro

#### Vendas Controller
- Criação de vendas
- Atualização de status
- Relatórios de vendas

#### Contas Pagar Controller
- Gestão de contas a pagar
- Controle de fornecedores
- Categorização de despesas

### 5. Serviços de Negócio

#### Client Service
- Lógica de negócio para clientes
- Validações e regras
- Integração com banco

#### Product Service
- Gestão de estoque
- Cálculos financeiros
- Relatórios de produtos

#### Venda Service
- Processamento de vendas
- Cálculos de comissões
- Controle de status

## 🗄️ BANCO DE DADOS

### Estrutura Principal
O sistema utiliza MySQL como banco de dados principal, com as seguintes tabelas principais:

- **usuarios** - Usuários do sistema
- **clientes** - Cadastro de clientes
- **produtos** - Cadastro de produtos
- **vendas** - Registro de vendas
- **contas_pagar** - Contas a pagar
- **contas_receber** - Contas a receber
- **categorias** - Categorias de produtos/despesas
- **fornecedores** - Cadastro de fornecedores
- **fluxo_caixa** - Movimentações financeiras

### Relacionamentos
- Clientes → Vendas (1:N)
- Produtos → Vendas (1:N)
- Categorias → Produtos (1:N)
- Fornecedores → Contas Pagar (1:N)
- Categorias → Contas Pagar (1:N)

## 🔧 FUNCIONALIDADES PRINCIPAIS

### 1. Gestão de Clientes
- ✅ Cadastro completo de clientes
- ✅ Histórico de compras
- ✅ Controle de contas a receber
- ✅ Relatórios de clientes

### 2. Gestão de Produtos
- ✅ Cadastro de produtos
- ✅ Controle de estoque
- ✅ Categorização
- ✅ Cálculo de margem de lucro

### 3. Sistema de Vendas
- ✅ Criação de vendas
- ✅ Controle de status
- ✅ Múltiplas formas de pagamento
- ✅ Comissões e descontos

### 4. Controle Financeiro
- ✅ Contas a pagar
- ✅ Contas a receber
- ✅ Fluxo de caixa
- ✅ Relatórios financeiros

### 5. Relatórios e Analytics
- ✅ Dashboard financeiro
- ✅ Relatórios de lucro
- ✅ Análise de estoque
- ✅ Exportação PDF/Excel

### 6. Contas a Pagar (Nova Funcionalidade)
- ✅ Gestão completa de contas
- ✅ Categorização de despesas
- ✅ Controle de fornecedores
- ✅ Alertas de vencimento
- ✅ Relatórios detalhados
- ✅ Exportação de dados

## 🚀 INSTALAÇÃO E CONFIGURAÇÃO

### Pré-requisitos
- Node.js 18+
- MySQL 8.0+
- Git

### Frontend
```bash
cd proTrack-client
npm install
npm run dev
```

### Backend
```bash
cd protrack-server
npm install
npm run dev
```

### Banco de Dados
```bash
# Executar o script SQL
mysql -u root -p < protrack.sql
```

## 📱 RESPONSIVIDADE E UX

### Design System
- **Tailwind CSS** para estilização
- **Radix UI** para componentes acessíveis
- **Lucide React** para ícones
- **Tema escuro/claro** com next-themes

### Componentes Responsivos
- Sidebar colapsível em mobile
- Tabelas com scroll horizontal
- Cards adaptáveis
- Navegação otimizada para touch

### Acessibilidade
- Componentes ARIA-compliant
- Navegação por teclado
- Contraste adequado
- Screen reader friendly

## 🔒 SEGURANÇA

### Autenticação
- Login com email/senha
- Senhas criptografadas com bcrypt
- Controle de sessão
- Middleware de autenticação

### Validação
- Validação no frontend com Zod
- Sanitização de inputs
- Validação no backend
- Tratamento de erros

### CORS
- Configuração específica para desenvolvimento
- Controle de origens permitidas
- Credenciais habilitadas

## 📊 MONITORAMENTO E LOGS

### Logs do Sistema
- Logs de erro não tratados
- Logs de conexão com banco
- Logs de operações críticas

### Monitoramento de Vendas
- Scripts de monitoramento automático
- Alertas de vendas vencidas
- Atualização automática de status

## 🧪 TESTES E QUALIDADE

### Linting e Formatação
- ESLint configurado
- TypeScript strict mode
- Prettier para formatação

### Validação de Tipos
- TypeScript em todo o projeto
- Interfaces bem definidas
- Tipos para APIs e componentes

## 📈 ROADMAP E MELHORIAS

### Funcionalidades Planejadas
- [ ] Sistema de notificações push
- [ ] Integração com APIs de pagamento
- [ ] Dashboard mobile nativo
- [ ] Backup automático do banco
- [ ] Sistema de auditoria completo

### Melhorias Técnicas
- [ ] Cache Redis para performance
- [ ] Testes automatizados
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] Monitoramento com Prometheus

## 🆘 SUPORTE E MANUTENÇÃO

### Estrutura de Logs
- Logs de erro centralizados
- Monitoramento de performance
- Alertas automáticos

### Backup e Recuperação
- Scripts de backup automático
- Recuperação de dados
- Versionamento de banco

### Documentação de API
- Endpoints documentados
- Exemplos de uso
- Códigos de erro

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Frontend ✅
- [x] Estrutura React + TypeScript
- [x] Sistema de roteamento
- [x] Componentes UI
- [x] Hooks customizados
- [x] Integração com API
- [x] Responsividade
- [x] Tema escuro/claro

### Backend ✅
- [x] API Express
- [x] Conexão MySQL
- [x] Controladores
- [x] Serviços de negócio
- [x] Middlewares
- [x] Tratamento de erros

### Banco de Dados ✅
- [x] Estrutura de tabelas
- [x] Relacionamentos
- [x] Scripts de criação
- [x] Migrações

### Funcionalidades ✅
- [x] Gestão de clientes
- [x] Gestão de produtos
- [x] Sistema de vendas
- [x] Controle financeiro
- [x] Relatórios
- [x] Contas a pagar
- [x] Contas a receber
- [x] Fluxo de caixa

## 🎉 CONCLUSÃO

O **ProTrack 2.0** representa uma evolução significativa na gestão empresarial, oferecendo:

- **Arquitetura moderna** com React 19 e TypeScript
- **Backend robusto** com Node.js e Express
- **Banco de dados** MySQL otimizado
- **Interface responsiva** com Tailwind CSS
- **Funcionalidades completas** para gestão empresarial
- **Código limpo** e bem estruturado
- **Documentação abrangente** para manutenção

O sistema está pronto para uso em produção e pode ser facilmente expandido com novas funcionalidades conforme necessário.

---

**Versão:** 2.0  
**Última Atualização:** Dezembro 2024  
**Desenvolvido por:** Equipe ProTrack  
**Tecnologias:** React, TypeScript, Node.js, MySQL
