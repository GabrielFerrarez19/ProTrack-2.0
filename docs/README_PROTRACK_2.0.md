# 🚀 PROTRACK 2.0 - Sistema de Gestão Empresarial

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-ISC-green.svg)](LICENSE)

> **Sistema completo de gestão empresarial com arquitetura moderna, oferecendo controle total sobre vendas, estoque, clientes, financeiro e contas a pagar.**

## 🎯 VISÃO GERAL

O **ProTrack 2.0** é uma solução empresarial robusta e moderna que integra todas as operações de negócio em uma única plataforma. Desenvolvido com tecnologias de ponta como React 19, TypeScript e Node.js, o sistema oferece uma experiência de usuário excepcional e funcionalidades abrangentes para gestão empresarial.

### ✨ **Principais Características**

- 🎨 **Interface Moderna** - Design responsivo com Tailwind CSS e Radix UI
- 🔒 **Segurança Robusta** - Autenticação segura e validação de dados
- 📊 **Dashboard Inteligente** - Relatórios e analytics em tempo real
- 💰 **Gestão Financeira** - Controle completo de contas a pagar e receber
- 📱 **Responsivo** - Funciona perfeitamente em todos os dispositivos
- 🚀 **Performance Otimizada** - Construído com Vite e otimizações avançadas

## 🏗️ ARQUITETURA

### **Stack Tecnológico**

| Camada             | Tecnologia         | Versão         |
| ------------------ | ------------------ | -------------- |
| **Frontend**       | React + TypeScript | 19.1.0 + 5.8.3 |
| **Build Tool**     | Vite               | 4.6.0          |
| **Styling**        | Tailwind CSS       | 4.1.11         |
| **UI Components**  | Radix UI           | 3.2.1          |
| **Backend**        | Node.js + Express  | 18+ + 4.18.2   |
| **Database**       | MySQL              | 8.0+           |
| **Authentication** | bcrypt + JWT       | 6.0.0          |

### **Estrutura do Projeto**

```
ProTrack-2.0/
├── 🎨 proTrack-client/          # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/          # Componentes reutilizáveis
│   │   ├── hooks/              # Custom hooks React
│   │   ├── pages/              # Páginas da aplicação
│   │   ├── services/           # Serviços de API
│   │   └── @types/             # Definições TypeScript
│   └── package.json
├── 🖥️ protrack-server/          # Backend Node.js + Express
│   ├── src/
│   │   ├── controllers/        # Controladores das rotas
│   │   ├── services/           # Lógica de negócio
│   │   ├── routes/             # Definição de rotas
│   │   └── config/             # Configurações
│   └── package.json
├── 🗄️ protrack.sql              # Script de criação do banco
└── 📚 Documentação/             # Documentação completa
```

## 🚀 INSTALAÇÃO RÁPIDA

### **Pré-requisitos**

- [Node.js](https://nodejs.org/) 18+
- [MySQL](https://www.mysql.com/) 8.0+
- [Git](https://git-scm.com/)

### **1. Clone o Repositório**

```bash
git clone https://github.com/seu-usuario/ProTrack-2.0.git
cd ProTrack-2.0
```

### **2. Configure o Banco de Dados**

```bash
# Acesse o MySQL
mysql -u root -p

# Execute o script de criação
source protrack.sql
```

### **3. Configure o Backend**

```bash
cd protrack-server

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Inicie o servidor
npm run dev
```

### **4. Configure o Frontend**

```bash
cd proTrack-client

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### **5. Acesse a Aplicação**

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8085
- **Banco**: MySQL localhost:3306

## 🔧 FUNCIONALIDADES

### **📊 Dashboard Financeiro**

- Visão geral do fluxo de caixa
- Gráficos de receitas e despesas
- Indicadores de performance
- Relatórios em tempo real

### **👥 Gestão de Clientes**

- Cadastro completo de clientes
- Histórico de compras
- Controle de contas a receber
- Relatórios de comportamento

### **📦 Gestão de Produtos**

- Controle de estoque
- Categorização inteligente
- Cálculo de margem de lucro
- Alertas de estoque baixo

### **💰 Sistema de Vendas**

- Criação de vendas
- Múltiplas formas de pagamento
- Controle de status
- Comissões e descontos

### **💳 Contas a Pagar**

- Gestão de fornecedores
- Categorização de despesas
- Alertas de vencimento
- Relatórios detalhados

### **📈 Relatórios e Analytics**

- Exportação em PDF e Excel
- Análise de lucro por produto
- Relatórios de estoque
- Projeções financeiras

## 🎨 INTERFACE DO USUÁRIO

### **Design System**

- **Componentes Atômicos** - Botões, inputs, cards
- **Tema Escuro/Claro** - Suporte a múltiplos temas
- **Responsividade** - Mobile-first approach
- **Acessibilidade** - Componentes ARIA-compliant

### **Componentes Principais**

- `Header` - Navegação principal
- `Sidebar` - Menu lateral responsivo
- `SummaryCards` - Cards de resumo
- `FiltersBar` - Barra de filtros
- `AccountsTable` - Tabelas de dados

## 🔌 API ENDPOINTS

### **Autenticação**

```http
POST /login                    # Login de usuário
POST /logout                   # Logout de usuário
```

### **Clientes**

```http
GET    /clients/clientes       # Listar clientes
POST   /clients/clientes       # Criar cliente
GET    /clients/clientes/:id   # Buscar cliente
PUT    /clients/altera/:id     # Atualizar cliente
DELETE /clients/clientes/:id   # Excluir cliente
```

### **Produtos**

```http
GET    /product/produtos       # Listar produtos
POST   /product/produtos       # Criar produto
GET    /product/produtos/:id   # Buscar produto
PUT    /product/produtos/:id   # Atualizar produto
DELETE /product/produtos/:id   # Excluir produto
```

### **Vendas**

```http
GET    /vendas/todas           # Listar vendas
POST   /vendas/cadvendas       # Criar venda
GET    /vendas/:id             # Buscar venda
PUT    /vendas/altera/:id      # Atualizar venda
```

### **Contas a Pagar**

```http
GET    /contas-pagar/contas    # Listar contas
POST   /contas-pagar/contas    # Criar conta
PUT    /contas-pagar/contas/:id # Atualizar conta
DELETE /contas-pagar/contas/:id # Excluir conta
```

## 🧪 DESENVOLVIMENTO

### **Scripts Disponíveis**

#### **Frontend (proTrack-client)**

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run lint         # Verificação de código
npm run preview      # Preview do build
```

#### **Backend (protrack-server)**

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build TypeScript
npm start            # Servidor de produção
```

### **Estrutura de Desenvolvimento**

#### **Frontend**

```typescript
// Exemplo de hook customizado
const useContasPagar = () => {
  const [contas, setContas] = useState<ContaPagar[]>([]);
  const [loading, setLoading] = useState(false);

  const listarContas = async (filtros?: ContaPagarFiltros) => {
    setLoading(true);
    try {
      const response = await listarContasPagar(filtros);
      if (response.success) {
        setContas(response.data);
      }
    } catch (error) {
      console.error("Erro ao listar contas:", error);
    } finally {
      setLoading(false);
    }
  };

  return { contas, loading, listarContas };
};
```

#### **Backend**

```typescript
// Exemplo de controller
export const listarContasPagar = async (req: Request, res: Response) => {
  try {
    const { search, status, categoria_id } = req.query;

    const contas = await contasPagarService.listarComFiltros({
      search: search as string,
      status: status as string,
      categoria_id: categoria_id as string,
    });

    res.json({
      success: true,
      data: contas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  }
};
```

## 🔒 SEGURANÇA

### **Medidas Implementadas**

- **Autenticação** - bcrypt para hash de senhas
- **Validação** - Zod para validação de dados
- **CORS** - Configuração segura de origens
- **Sanitização** - Prevenção de SQL injection
- **Logs** - Auditoria de operações

### **Boas Práticas**

- Senhas criptografadas com salt
- Validação em frontend e backend
- Headers de segurança
- Controle de acesso por usuário

## 📱 RESPONSIVIDADE

### **Breakpoints**

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### **Componentes Responsivos**

- Sidebar colapsível em mobile
- Tabelas com scroll horizontal
- Cards adaptáveis
- Navegação otimizada para touch

## 📊 PERFORMANCE

### **Otimizações Frontend**

- **Code Splitting** - Lazy loading de páginas
- **Memoization** - React.memo e useMemo
- **Bundle Optimization** - Vite com rollup
- **Image Optimization** - SVGs e lazy loading

### **Otimizações Backend**

- **Connection Pooling** - MySQL com pool
- **Query Optimization** - Prepared statements
- **Caching** - Cache em memória
- **Compression** - Gzip para respostas

## 🚀 DEPLOY

### **Ambiente de Produção**

```bash
# Build do frontend
cd proTrack-client
npm run build

# Build do backend
cd protrack-server
npm run build

# Configuração do servidor
npm start
```

### **Docker (Opcional)**

```bash
# Build das imagens
docker-compose build

# Executar serviços
docker-compose up -d
```

## 📚 DOCUMENTAÇÃO

### **Documentos Disponíveis**

- 📖 [Documentação Completa](DOCUMENTACAO_COMPLETA_PROTRACK_2.0.md)
- 🏗️ [Arquitetura Técnica](ARQUITETURA_TECNICA_ATUALIZADA.md)
- 📊 [Resumo Executivo](RESUMO_EXECUTIVO_PROTRACK_2.0.md)
- 📋 [Índice da Documentação](INDICE_DOCUMENTACAO_ATUALIZADO.md)
- 🛠️ [Guia do Desenvolvedor](GUIA_DESENVOLVEDOR_PROTRACK.md)
- 👤 [Manual do Usuário](USER_MANUAL.md)

### **Navegação Rápida**

- **Desenvolvedores** → [Arquitetura Técnica](ARQUITETURA_TECNICA_ATUALIZADA.md)
- **Usuários** → [Manual do Usuário](USER_MANUAL.md)
- **Instalação** → [Instalação Rápida](INSTALACAO_RAPIDA.md)
- **Troubleshooting** → [Solução de Problemas](SOLUCAO_PROBLEMAS_PDF.md)

## 🤝 CONTRIBUIÇÃO

### **Como Contribuir**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### **Padrões de Código**

- Use TypeScript strict mode
- Siga as convenções de nomenclatura
- Adicione testes para novas funcionalidades
- Mantenha a documentação atualizada

## 🐛 REPORTAR BUGS

### **Como Reportar**

1. Use o sistema de Issues do GitHub
2. Descreva o problema detalhadamente
3. Inclua passos para reproduzir
4. Adicione screenshots se relevante
5. Especifique seu ambiente (OS, browser, versão)

### **Template de Bug Report**

```markdown
**Descrição do Bug**
Descrição clara e concisa do problema.

**Passos para Reproduzir**

1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

**Comportamento Esperado**
O que deveria acontecer.

**Screenshots**
Se aplicável, adicione screenshots.

**Ambiente**

- OS: [ex: Windows 10]
- Browser: [ex: Chrome 120]
- Versão: [ex: 2.0.0]
```

## 📄 LICENÇA

Este projeto está licenciado sob a licença **ISC** - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 EQUIPE

### **Desenvolvedores**

- **Equipe ProTrack** - Desenvolvimento principal
- **Contribuidores** - Comunidade open source

### **Contato**

- **Documentação**: Este repositório
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/ProTrack-2.0/issues)
- **Suporte**: Equipe ProTrack

## 🙏 AGRADECIMENTOS

- **React Team** - Framework incrível
- **Vite Team** - Build tool rápida
- **Tailwind CSS** - Framework CSS utilitário
- **Radix UI** - Componentes acessíveis
- **MySQL** - Banco de dados robusto

---

## 🎉 STATUS DO PROJETO

**✅ Status**: 100% implementado e funcional  
**🚀 Pronto para**: Deploy em produção  
**📱 Responsivo**: Mobile, tablet e desktop  
**🔒 Seguro**: Autenticação e validação implementadas  
**📚 Documentado**: Documentação completa disponível

**O ProTrack 2.0 está pronto para revolucionar a gestão empresarial! 🚀**

---

**📅 Última Atualização**: Dezembro 2024  
**🔄 Versão**: 2.0  
**⭐ Se este projeto te ajudou, considere dar uma estrela!**

---

<div align="center">

**Desenvolvido com ❤️ pela Equipe ProTrack**

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)](https://www.mysql.com/)

</div>
