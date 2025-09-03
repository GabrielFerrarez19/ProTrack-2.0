# Backend de Contas a Pagar - ProTrack 2.0

## 📋 Visão Geral

Este módulo implementa o sistema completo de contas a pagar do ProTrack 2.0, seguindo o mesmo padrão arquitetural dos outros módulos do projeto. **Utiliza MySQL direto** para conexão com o banco de dados, sem dependências do Prisma.

## 🏗️ Arquitetura

```
src/
├── @types/
│   └── types.service.ts          # Interfaces TypeScript
├── services/
│   └── contasPagar.service.ts    # Lógica de negócio
├── controllers/
│   └── contasPagar.controller.ts # Controle de requisições
├── routes/
│   └── contasPagarRoutes.ts      # Definição de rotas
└── config/
    └── database.ts               # Configuração MySQL
```

## 🚀 Funcionalidades

### ✅ Contas a Pagar

- **CRUD completo** de contas
- **Filtros avançados** (busca, status, categoria, data)
- **Cálculo automático** de dias em atraso
- **Marcação de pagamento** com histórico
- **Resumos e dashboards** com totais por status

### ✅ Fornecedores

- **Gestão completa** de fornecedores
- **Soft delete** para exclusão segura
- **Validações** de dados obrigatórios

### ✅ Automações

- **Atualização automática** de status (vencido/agendado)
- **Script de cron job** para execução diária
- **Logs automáticos** de todas as operações

## 📊 Endpoints da API

### Contas a Pagar

```
POST   /api/contas-pagar/contas          - Criar conta
GET    /api/contas-pagar/contas          - Listar contas (com filtros)
GET    /api/contas-pagar/contas/:id      - Buscar conta por ID
PUT    /api/contas-pagar/contas/:id      - Atualizar conta
DELETE /api/contas-pagar/contas/:id      - Excluir conta
PUT    /api/contas-pagar/contas/:id/pagar - Marcar como paga
GET    /api/contas-pagar/contas/resumo   - Obter resumo
```

### Fornecedores

```
POST   /api/contas-pagar/fornecedores    - Criar fornecedor
GET    /api/contas-pagar/fornecedores    - Listar fornecedores
GET    /api/contas-pagar/fornecedores/:id - Buscar fornecedor por ID
PUT    /api/contas-pagar/fornecedores/:id - Atualizar fornecedor
DELETE /api/contas-pagar/fornecedores/:id - Excluir fornecedor (soft delete)
```

### Utilitários

```
POST   /api/contas-pagar/contas/atualizar-status - Atualizar status das contas
```

## 🗄️ Banco de Dados

### Tabelas Criadas

- `contas_pagar` - Contas a pagar
- `fornecedores` - Fornecedores
- `categorias` - Categorias de despesas

### Script SQL

Execute o arquivo `protrack.sql` na raiz do projeto para criar todas as tabelas e dados de exemplo.

## ⚙️ Configuração

### 1. Dependências

```bash
npm install mysql2
```

### 2. Configuração do Banco

```typescript
// src/config/database.ts
export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "sua_senha",
  database: "protrack",
  port: 3306,
});
```

### 3. Variáveis de Ambiente (Recomendado)

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=protrack
DB_PORT=3306
```

## 🚀 Como Usar

### 1. Executar Script SQL

```bash
mysql -u root -p protrack < protrack.sql
```

### 2. Iniciar Servidor

```bash
npm run dev
```

### 3. Testar API

```bash
# Listar contas
curl http://localhost:3000/api/contas-pagar/contas

# Obter resumo
curl http://localhost:3000/api/contas-pagar/contas/resumo
```

## 🔄 Cron Job

### Configuração Automática

```bash
chmod +x scripts/configurar-cron-contas.sh
./scripts/configurar-cron-contas.sh
```

### Execução Manual

```bash
node scripts/atualizarStatusContas.js
```

### Configuração Manual

```bash
# Adicionar ao crontab
crontab -e

# Executar todos os dias às 00:00
0 0 * * * cd /path/to/protrack-server && node scripts/atualizarStatusContas.js >> logs/cron-contas.log 2>&1
```

## 📝 Exemplos de Uso

### Criar Nova Conta

```typescript
const novaConta = {
  fornecedor_nome: "Fornecedor ABC",
  valor: 1500.0,
  data_vencimento: "2024-12-31",
  categoria_id: "uuid-da-categoria",
  descricao: "Compra de materiais",
};

const response = await fetch("/api/contas-pagar/contas", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(novaConta),
});
```

### Listar Contas com Filtros

```typescript
const filtros = {
  status: "pendente",
  categoria_id: "uuid-da-categoria",
  search: "fornecedor",
};

const queryParams = new URLSearchParams(filtros);
const response = await fetch(`/api/contas-pagar/contas?${queryParams}`);
```

## 🧪 Testes

### Testar Service

```typescript
import { ContasPagarService } from "./contasPagar.service";

const service = new ContasPagarService();

// Testar criação
const conta = await service.criarConta({
  fornecedor_nome: "Teste",
  valor: 100.0,
  data_vencimento: "2024-12-31",
  categoria_id: "uuid",
  descricao: "Teste",
});
```

### Testar Controller

```typescript
import { ContasPagarController } from './contasPagar.controller';

const controller = new ContasPagarController();

// Simular requisição
const req = { body: { ... } } as Request;
const res = { status: () => ({ json: () => {} }) } as Response;

await controller.criarConta(req, res);
```

## 🔐 Segurança

### Validações Implementadas

- ✅ Campos obrigatórios
- ✅ Valores numéricos positivos
- ✅ Datas válidas
- ✅ UUIDs válidos

### Recomendações

- 🔒 Implementar autenticação JWT
- 🔒 Adicionar middleware de autorização
- 🔒 Implementar rate limiting
- 🔒 Adicionar validação de schema (Joi/Zod)

## 📈 Monitoramento

### Logs

- Todas as operações são logadas
- Erros são capturados e logados
- Script de cron gera logs separados

### Métricas

- Contagem de contas por status
- Totais monetários por categoria
- Histórico de pagamentos

## 🚨 Tratamento de Erros

### Estrutura de Erro

```json
{
  "success": false,
  "message": "Descrição do erro",
  "error": "Detalhes técnicos (opcional)"
}
```

### Códigos de Status

- `200` - Sucesso
- `201` - Criado
- `400` - Bad Request
- `404` - Não encontrado
- `500` - Erro interno

## 🔧 Manutenção

### Atualizações de Status

O sistema atualiza automaticamente:

- Contas vencidas (pendente → vencido)
- Contas agendadas (agendado → pendente)

### Backup

- Dados são persistidos no MySQL
- Recomenda-se backup diário das tabelas
- Logs são mantidos em arquivos separados

## 📚 Documentação Adicional

- [API Completa](API_CONTAS_PAGAR.md)
- [Estrutura do Banco](protrack.sql)
- [Scripts de Automação](scripts/)

## 🤝 Contribuição

### Padrões de Código

- ✅ TypeScript strict mode
- ✅ Async/await para operações assíncronas
- ✅ Try/catch para tratamento de erros
- ✅ Logs detalhados para debugging

### Estrutura de Commits

```
feat: adicionar nova funcionalidade
fix: corrigir bug
docs: atualizar documentação
refactor: refatorar código
test: adicionar testes
```

## 📞 Suporte

Para dúvidas ou problemas:

1. Verificar logs do servidor
2. Consultar documentação da API
3. Verificar conexão com banco de dados
4. Testar endpoints individualmente

---

**ProTrack 2.0** - Sistema de Gestão Empresarial
