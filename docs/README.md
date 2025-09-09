# Documentação - ProTrack 2.0

## Visão Geral

Esta documentação consolidada do ProTrack 2.0 está organizada por assunto para facilitar a navegação e consulta. Cada arquivo consolidado contém informações relacionadas a um tópico específico, combinando múltiplos documentos originais em uma única fonte de conhecimento.

## Estrutura da Documentação

### 📋 [Visão Geral do ProTrack 2.0](./VISAO_GERAL_PROTRACK_2.0.md)

**Conteúdo consolidado de:**

- README.md
- RESUMO_EXECUTIVO_PROTRACK_2.0.md
- DOCUMENTACAO_COMPLETA_PROTRACK.md

**Inclui:**

- Visão geral do sistema
- Características principais
- Sistema Inteligente de Vencimentos
- Tecnologias utilizadas
- Arquitetura do sistema

### 🏗️ [Arquitetura Técnica Consolidada](./ARQUITETURA_TECNICA.md)

**Conteúdo consolidado de:**

- ARQUITETURA_TECNICA_PROTRACK.md
- INDICE_DOCUMENTACAO.md

**Inclui:**

- Arquitetura em camadas
- Padrões de design
- Separação de responsabilidades
- Estrutura de dados
- Fluxo de informações

### 🔌 [APIs e Desenvolvimento Consolidado](./APIS_E_DESENVOLVIMENTO.md)

**Conteúdo consolidado de:**

- API_GUIDE.md
- GUIA_DESENVOLVEDOR_PROTRACK.md

**Inclui:**

- Documentação completa da API
- Guia para desenvolvedores
- Endpoints disponíveis
- Exemplos de uso
- Boas práticas de desenvolvimento

### 👥 [Manual do Usuário Consolidado](./MANUAL_DO_USUARIO.md)

**Conteúdo consolidado de:**

- USER_MANUAL.md

**Inclui:**

- Guia completo do usuário
- Instruções de uso
- Funcionalidades do sistema
- Sistema Inteligente de Vencimentos
- Solução de problemas comuns

### 🤖 [Monitoramento e Automação Consolidado](./MONITORAMENTO_E_AUTOMACAO.md)

**Conteúdo consolidado de:**

- INSTALACAO_RAPIDA.md
- Documentação de monitoramento (restaurada)

**Inclui:**

- Sistema de monitoramento de vendas
- Sistema de monitoramento de contas a pagar
- Scripts de automação
- Configuração de cron jobs
- Sistema de backup automático

### ⚛️ [Componentes e Hooks Consolidado](./COMPONENTES_E_HOOKS.md)

**Conteúdo consolidado de:**

- COMPONENTES_FRONTEND.md
- HOOKS_CUSTOMIZADOS.md

**Inclui:**

- Arquitetura de componentes React
- Padrão Atomic Design
- Hooks customizados
- Componentes de layout
- Otimizações de performance

### 🔧 [Serviços Backend Consolidado](./SERVICOS_BACKEND.md)

**Conteúdo consolidado de:**

- SERVICOS_BACKEND.md

**Inclui:**

- Serviços principais do backend
- Sistema inteligente de vencimentos
- Serviços de monitoramento
- Serviço de relatórios
- Tratamento de erros

### 📊 [Exportação e Relatórios Consolidado](./EXPORTACAO_E_RELATORIOS.md)

**Conteúdo consolidado de:**

- EXPORTACAO_RELATORIOS.md

**Inclui:**

- Sistema de exportação
- Relatórios em Excel e PDF
- Filtros avançados
- Exportação agendada
- Configurações personalizadas

### ⚙️ [Instalação e Configuração Consolidado](./INSTALACAO_E_CONFIGURACAO.md)

**Conteúdo consolidado de:**

- INSTALACAO_RAPIDA.md
- Configurações de ambiente

**Inclui:**

- Instalação rápida
- Configuração detalhada
- Configuração de produção
- Solução de problemas
- Backup e restauração

## Como Usar Esta Documentação

### Para Desenvolvedores

1. **Comece com**: [Visão Geral do ProTrack 2.0](./VISAO_GERAL_PROTRACK_2.0.md)
2. **Configure o ambiente**: [Instalação e Configuração](./INSTALACAO_E_CONFIGURACAO.md)
3. **Entenda a arquitetura**: [Arquitetura Técnica](./ARQUITETURA_TECNICA.md)
4. **Desenvolva**: [APIs e Desenvolvimento](./APIS_E_DESENVOLVIMENTO.md)

### Para Usuários Finais

1. **Comece com**: [Manual do Usuário](./MANUAL_DO_USUARIO.md)
2. **Configure o sistema**: [Instalação e Configuração](./INSTALACAO_E_CONFIGURACAO.md)
3. **Configure monitoramento**: [Monitoramento e Automação](./MONITORAMENTO_E_AUTOMACAO.md)

### Para Administradores

1. **Visão geral**: [Visão Geral do ProTrack 2.0](./VISAO_GERAL_PROTRACK_2.0.md)
2. **Configuração**: [Instalação e Configuração](./INSTALACAO_E_CONFIGURACAO.md)
3. **Monitoramento**: [Monitoramento e Automação](./MONITORAMENTO_E_AUTOMACAO.md)
4. **Relatórios**: [Exportação e Relatórios](./EXPORTACAO_E_RELATORIOS.md)

## Características Principais do ProTrack 2.0

### 🎯 Sistema Inteligente de Vencimentos

- Identificação automática de contas vencidas
- Alertas preventivos
- Dashboard proativo
- Gestão financeira inteligente

### 🏗️ Arquitetura Moderna

- Backend: Node.js + Express + TypeScript
- Frontend: React 19 + TypeScript + Vite
- Banco de Dados: MySQL 8.0 + Prisma ORM
- Autenticação: JWT + bcrypt

### 📊 Funcionalidades Avançadas

- Relatórios em Excel e PDF
- Exportação agendada
- Monitoramento automático
- Sistema de permissões
- Interface responsiva

### 🔧 Ferramentas de Desenvolvimento

- TypeScript strict mode
- ESLint + Prettier
- Testes automatizados
- CI/CD com GitHub Actions
- Docker support

## Tecnologias Utilizadas

### Backend

- **Node.js** 18+
- **Express.js** 4.18.2 - Framework web
- **TypeScript** 5.8.3 - Linguagem tipada
- **MySQL** 8.0+ - Banco de dados
- **mysql2** 3.14.3 - Driver MySQL
- **JWT** 9.0.2 - Autenticação
- **bcrypt** 6.0.0 - Hash de senhas
- **CORS** 2.8.5 - Cross-Origin Resource Sharing

### Frontend

- **React** 19.1.0 - Biblioteca de UI
- **TypeScript** 5.8.3 - Linguagem tipada
- **Vite** 4.6.0 - Build tool
- **Tailwind CSS** 4.1.11 - Framework CSS
- **Radix UI** 3.2.1 - Componentes acessíveis
- **React Router** 7.7.1 - Roteamento
- **Axios** 1.11.0 - Cliente HTTP
- **Sonner** 2.0.7 - Sistema de notificações
- **React Hook Form** 7.62.0 - Gerenciamento de formulários
- **Zod** 4.0.17 - Validação de esquemas

### Ferramentas

- **Git** - Controle de versão
- **ESLint** - Linting
- **Prettier** - Formatação
- **Jest** - Testes
- **PM2** - Gerenciador de processos
- **Nginx** - Servidor web

## Estrutura do Projeto

```
ProTrack-2.0/
├── proTrack-client/          # Frontend React
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   │   ├── ui/          # Componentes base (Radix UI)
│   │   │   ├── Sidebar/     # Navegação lateral
│   │   │   └── header/      # Cabeçalho
│   │   ├── pages/           # Páginas da aplicação
│   │   │   ├── Status/      # Dashboard principal
│   │   │   ├── Vendas/      # Gestão de vendas
│   │   │   ├── ContasPagar/ # Contas a pagar
│   │   │   ├── Financeiro/  # Módulo financeiro
│   │   │   └── ConfigUsers/ # Configurações
│   │   ├── hooks/           # Hooks customizados
│   │   │   ├── useAuth.ts   # Autenticação
│   │   │   ├── useDashboard.ts # Dashboard
│   │   │   └── useContasPagar.ts # Contas a pagar
│   │   ├── services/        # Serviços de API
│   │   ├── layout/          # Layouts da aplicação
│   │   ├── @types/          # Definições de tipos
│   │   └── utils/           # Utilitários
│   └── package.json
├── protrack-server/          # Backend Node.js
│   ├── src/
│   │   ├── controllers/     # Controladores
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── product.controller.ts
│   │   │   └── contasPagar.controller.ts
│   │   ├── services/        # Lógica de negócio
│   │   ├── routes/          # Rotas da API
│   │   ├── middlewares/     # Middlewares
│   │   └── config/          # Configurações
│   ├── scripts/             # Scripts de monitoramento
│   └── package.json
├── docs/                    # Documentação
└── protrack.sql            # Script do banco de dados
```

## Suporte e Contribuição

### Documentação

- **Issues**: Reporte problemas na documentação
- **Pull Requests**: Contribua com melhorias
- **Discussões**: Participe das discussões

### Desenvolvimento

- **Código**: Siga as convenções estabelecidas
- **Testes**: Mantenha cobertura de testes
- **Documentação**: Atualize a documentação

### Contato

- **Email**: suporte@protrack.com
- **Telefone**: (11) 99999-9999
- **Horário**: Segunda a Sexta, 8h às 18h

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](../LICENSE) para mais detalhes.

## Changelog

### v2.0.0 (Atual)

- Sistema Inteligente de Vencimentos
- Interface moderna com React 19
- Arquitetura em camadas
- Monitoramento automático
- Relatórios avançados

### v1.0.0

- Versão inicial
- Funcionalidades básicas
- Interface simples

---

**ProTrack 2.0** - Sistema de Gestão Empresarial Inteligente
