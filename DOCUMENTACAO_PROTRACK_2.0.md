# 📚 Documentação Completa - ProTrack 2.0

## 🎯 Visão Geral

**ProTrack 2.0** é um sistema completo de gestão empresarial desenvolvido com arquitetura moderna, incluindo controle de vendas, estoque, clientes, financeiro e monitoramento automático de vendas vencidas.

## 🏗️ Arquitetura do Sistema

### **Frontend (React + TypeScript)**

- **Framework**: React 19.1.0 + TypeScript 5.8.3
- **Build Tool**: Vite 4.6.0
- **Styling**: Tailwind CSS 4.1.11
- **UI Components**: Radix UI + Shadcn/ui
- **State Management**: React Hooks + Context API
- **Routing**: React Router DOM 7.7.1
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts 3.1.2
- **HTTP Client**: Axios 1.11.0

### **Backend (Node.js + Express + TypeScript)**

- **Runtime**: Node.js
- **Framework**: Express 4.18.2
- **Language**: TypeScript 5.8.3
- **Database**: MySQL 8.0+ (mysql2 3.14.3)
- **Authentication**: bcrypt 6.0.0
- **CORS**: Configurado para localhost:5173
- **Port**: 8085

### **Banco de Dados**

- **SGBD**: MySQL
- **Schema**: `protrack.sql` com estrutura completa
- **Tabelas principais**: users, produtos, clientes, vendas, itens_venda, metodos_pagamento, categorias

## 🚀 Funcionalidades Principais

### **1. Sistema de Autenticação**

- Login de usuários
- Redefinição de senha
- Confirmação de email
- Middleware de autenticação

### **2. Gestão de Produtos**

- Cadastro de produtos
- Controle de estoque
- Categorização
- Preços de custo e venda
- Códigos de barras

### **3. Gestão de Clientes**

- Cadastro completo de clientes
- Dados pessoais e de contato
- Histórico de vendas
- Controle de valores em aberto

### **4. Sistema de Vendas**

- Criação de vendas
- Múltiplas formas de pagamento
- Controle de desconto
- Vendas a prazo com vencimento
- Gestão de itens de venda

### **5. Controle Financeiro**

- Contas a pagar e receber
- Fluxo de caixa
- Relatórios financeiros
- Dashboard com métricas
- Categorização de receitas/despesas

### **6. Monitoramento Automático**

- **Sistema de monitoramento de vendas vencidas**
- Execução automática a cada 5 minutos
- Atualização automática de status
- Logs detalhados de operações
- Endpoints para controle manual

### **7. Relatórios e Analytics**

- Relatórios de vendas
- Análise de estoque
- Margem de lucro
- Evolução financeira mensal
- Exportação em PDF e Excel

## 📁 Estrutura do Projeto

### **Frontend (`proTrack-client/`)**

```
src/
├── @types/           # Definições de tipos TypeScript
├── assets/           # Imagens e recursos estáticos
├── components/       # Componentes reutilizáveis
│   ├── ui/          # Componentes base (shadcn/ui)
│   ├── header/      # Cabeçalho da aplicação
│   └── Sidebar/     # Menu lateral
├── hooks/            # Custom hooks React
├── layout/           # Layouts da aplicação
├── pages/            # Páginas principais
├── services/         # Serviços de API
├── utils/            # Utilitários e funções
├── App.tsx           # Componente principal
├── Router.tsx        # Configuração de rotas
└── main.tsx          # Ponto de entrada
```

### **Backend (`protrack-server/`)**

```
src/
├── @types/           # Tipos TypeScript
├── config/           # Configurações (DB, Prisma)
├── controllers/      # Controladores das rotas
├── middlewares/      # Middlewares Express
├── routes/           # Definição de rotas
├── services/         # Lógica de negócio
├── utils/            # Utilitários
├── scripts/          # Scripts de monitoramento
└── app.ts            # Aplicação principal
```

## 🎨 Páginas e Funcionalidades

### **1. Autenticação**

- **`/`** - Login principal
- **`/confirmacaoemail`** - Confirmação de email
- **`/redefinirsenha`** - Redefinição de senha

### **2. Dashboard e Status**

- **`/status`** - Dashboard principal com métricas
- **`/financeiro`** - Dashboard financeiro

### **3. Gestão de Produtos**

- **`/cadastroprodutos`** - Cadastro de produtos
- **`/produtos`** - Listagem e gestão de estoque

### **4. Gestão de Clientes**

- **`/cadastrodeclientes`** - Cadastro de clientes
- **`/clientes`** - Listagem e gestão de clientes

### **5. Sistema de Vendas**

- **`/venda`** - Criação de vendas
- **`/totalVendas`** - Gestão e edição de vendas

### **6. Controle Financeiro**

- **`/contasPagar`** - Gestão de contas a pagar
- **`/contasReceber`** - Gestão de contas a receber
- **`/configfinanceiro`** - Configurações financeiras
- **`/relatorio`** - Relatórios financeiros

## 🔧 Sistema de Monitoramento

### **Funcionalidades**

- ✅ **Monitoramento automático** a cada 5 minutos
- ✅ **Identificação automática** de vendas vencidas
- ✅ **Atualização de status** para "vencido"
- ✅ **Logs detalhados** de todas as operações
- ✅ **Estatísticas em tempo real**
- ✅ **Execução manual** via interface

### **Endpoints da API**

```http
POST /monitoramento/executar      # Executar monitoramento
GET  /monitoramento/estatisticas  # Estatísticas de vendas vencidas
GET  /monitoramento/status        # Status do sistema
DELETE /monitoramento/limpar      # Limpar vendas antigas
```

### **Configuração Automática**

```bash
# Script de configuração automática
cd protrack-server
./scripts/configurar-cron.sh

# Configuração manual do cron
*/5 * * * * cd /caminho/para/protrack-server && node src/scripts/monitoramentoVendas.js >> logs/monitoramento.log 2>&1
```

## 🎯 Hooks Personalizados

### **`useVendasVencidas`**

- Execução automática de monitoramento
- Estado de monitoramento
- Controle de vendas vencidas
- Funções de reload e execução manual

### **`useDashboard`**

- Dados financeiros em tempo real
- Métricas de negócio
- Integração com múltiplas APIs

### **`useRelatorios`**

- Geração de relatórios
- Exportação de dados
- Filtros e configurações

### **`useClientes`**

- Gestão de clientes
- Busca e filtros
- Operações CRUD

### **`useProdutos`**

- Gestão de produtos
- Controle de estoque
- Operações de venda

## 🔌 APIs e Endpoints

### **Autenticação**

```http
POST /login                    # Login de usuário
POST /users/create             # Criar usuário
```

### **Produtos**

```http
GET    /product/produtos/todos           # Listar produtos
POST   /product/produtos                 # Criar produto
PUT    /product/produtos/:id             # Atualizar produto
GET    /product/produtos/estoque-total   # Total do estoque
GET    /product/maisVendidos             # Produtos mais vendidos
```

### **Clientes**

```http
GET    /clients/clientes/todos           # Listar clientes
POST   /clients/clientes                 # Criar cliente
PUT    /clients/altera/:id               # Atualizar cliente
GET    /clients/clientes/total           # Total de clientes
GET    /clients/em-aberto/count          # Clientes com valores em aberto
```

### **Vendas**

```http
POST   /vendas/cadvendas                 # Criar venda
GET    /vendas/todas                     # Listar vendas
PUT    /vendas/altera/:id                # Atualizar venda
GET    /vendas/vencidas                  # Vendas vencidas
GET    /vendas/vencidas/total            # Total de vendas vencidas
GET    /vendas/formasPagamentos          # Formas de pagamento
```

### **Configurações**

```http
GET    /config/metodos-pagamento         # Métodos de pagamento
PATCH  /config/metodos-pagamento/:id     # Ativar/desativar método
GET    /config/categorias                # Categorias financeiras
POST   /config/categorias                # Criar categoria
```

### **Relatórios**

```http
GET    /relatorios/lucro-produto         # Relatório de lucro por produto
GET    /relatorios/lucro-categoria       # Relatório de lucro por categoria
GET    /relatorios/lucro-periodo         # Relatório de lucro por período
GET    /relatorios/completo              # Relatório completo
```

## 🎨 Componentes UI

### **Componentes Base (shadcn/ui)**

- Button, Input, Card, Dialog
- Form, Select, Table, Badge
- Progress, Switch, Tooltip
- Skeleton, Sonner (toast)

### **Componentes Customizados**

- **Header**: Cabeçalho das páginas
- **Sidebar**: Menu lateral responsivo
- **StatusMonitoramento**: Status do sistema de monitoramento
- **CardMonitoramento**: Card informativo do monitoramento
- **ResumoCards**: Cards de resumo financeiro

## 🚀 Scripts e Automação

### **Scripts de Monitoramento**

```bash
# Execução manual
node src/scripts/monitoramentoVendas.js

# Configuração automática
./scripts/configurar-cron.sh

# Verificação de logs
tail -f logs/monitoramento.log
```

### **Scripts NPM**

```bash
# Frontend
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run lint         # Verificação de código

# Backend
npm run dev          # Desenvolvimento com nodemon
npm run build        # Compilação TypeScript
npm start            # Produção
```

## 🔒 Segurança e Configurações

### **CORS**

- Configurado para `http://localhost:5173`
- Credenciais habilitadas
- Middleware de segurança

### **Autenticação**

- Hash de senhas com bcrypt
- Middleware de autenticação
- Controle de sessão

### **Validação**

- Zod para validação de schemas
- Validação de entrada em todas as APIs
- Tratamento de erros robusto

## 📊 Banco de Dados

### **Tabelas Principais**

```sql
-- Usuários
users (id, name, email, password, created_at)

-- Produtos
produtos (id, nome, descricao, categoria, quantidade, preco_custo, preco_venda)

-- Clientes
clientes (id, nome, cpf, email, valor_a_pagar, ...)

-- Vendas
vendas (id, cliente_id, data_venda, total, status, forma_pagamento, dias_vencimento)

-- Itens de Venda
itens_venda (id, venda_id, produto_id, quantidade, preco_unitario, desconto)

-- Métodos de Pagamento
metodos_pagamento (id, nome, tipo, ativo)

-- Categorias
categorias (id, nome, tipo, cor)
```

### **Relacionamentos**

- Cliente → Vendas (1:N)
- Venda → Itens de Venda (1:N)
- Produto → Itens de Venda (1:N)
- Usuário → Sistema (1:1)

## 🧪 Testes e Qualidade

### **Linting e Formatação**

- ESLint configurado
- TypeScript strict mode
- Prettier (via Tailwind CSS)

### **Validação de Tipos**

- TypeScript em tempo de compilação
- Interfaces bem definidas
- Tipos para todas as APIs

## 📱 Responsividade

### **Mobile First**

- Hook `use-mobile` para detecção
- Componentes responsivos
- Sidebar colapsível
- Layout adaptativo

## 🚀 Deploy e Produção

### **Frontend**

```bash
npm run build
# Arquivos em dist/ para deploy
```

### **Backend**

```bash
npm run build
npm start
# Servidor na porta 8085
```

### **Variáveis de Ambiente**

```bash
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=protrack

# Server
PORT=8085
NODE_ENV=production
```

## 🔧 Manutenção e Suporte

### **Logs**

- Logs de monitoramento em `logs/monitoramento.log`
- Logs de erro do servidor
- Console logs para debug

### **Monitoramento**

- Status do sistema via API
- Métricas de performance
- Alertas automáticos

### **Backup**

- Scripts de backup do banco
- Versionamento de código
- Documentação atualizada

## 📚 Recursos Adicionais

### **Documentação**

- `README.md` - Visão geral do projeto
- `API_GUIDE.md` - Guia completo da API
- `USER_MANUAL.md` - Manual do usuário
- `SOLUCAO_PROBLEMAS_PDF.md` - Solução de problemas

### **Ferramentas de Desenvolvimento**

- Vite para build rápido
- Hot reload em desenvolvimento
- TypeScript para type safety
- Tailwind CSS para styling

## 🎉 Conclusão

**ProTrack 2.0** é um sistema empresarial completo e moderno, desenvolvido com as melhores práticas de desenvolvimento web. O sistema oferece:

- ✅ **Gestão completa** de produtos, clientes e vendas
- ✅ **Controle financeiro** robusto e detalhado
- ✅ **Monitoramento automático** de vendas vencidas
- ✅ **Interface moderna** e responsiva
- ✅ **Arquitetura escalável** e bem estruturada
- ✅ **Documentação completa** e atualizada

O sistema está pronto para uso em produção e pode ser facilmente expandido com novas funcionalidades conforme necessário.
