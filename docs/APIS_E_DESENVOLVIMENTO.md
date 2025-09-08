# APIs e Desenvolvimento - ProTrack 2.0

## Guia da API - ProTrack 2.0

### Visão Geral

A API do ProTrack 2.0 é uma API RESTful moderna, construída com Node.js, Express.js e TypeScript. Ela fornece endpoints para todas as funcionalidades do sistema, incluindo vendas, clientes, produtos, contas a pagar e relatórios.

### Informações Básicas

#### Base URL

```
http://localhost:3001/api
```

#### Headers Padrão

```http
Content-Type: application/json
Authorization: Bearer <token>
```

#### Formato de Resposta

```json
{
  "success": true,
  "data": {},
  "message": "Operação realizada com sucesso"
}
```

## Autenticação

### Login

```http
POST /auth/login
```

**Request Body:**

```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "João Silva",
      "email": "usuario@exemplo.com",
      "role": "admin"
    }
  }
}
```

### Registro

```http
POST /auth/register
```

**Request Body:**

```json
{
  "name": "João Silva",
  "email": "usuario@exemplo.com",
  "password": "senha123",
  "role": "admin"
}
```

## Endpoints de Vendas

### Listar Vendas

```http
GET /vendas
```

**Query Parameters:**

- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10)
- `status`: Filtrar por status
- `clienteId`: Filtrar por cliente

**Response:**

```json
{
  "success": true,
  "data": {
    "vendas": [
      {
        "id": 1,
        "cliente": {
          "id": 1,
          "name": "Cliente Exemplo"
        },
        "produtos": [
          {
            "id": 1,
            "name": "Produto Exemplo",
            "price": 100.0,
            "quantity": 2
          }
        ],
        "total": 200.0,
        "status": "pendente",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

### Criar Venda

```http
POST /vendas
```

**Request Body:**

```json
{
  "clienteId": 1,
  "produtos": [
    {
      "produtoId": 1,
      "quantity": 2
    }
  ],
  "observacoes": "Venda com desconto"
}
```

### Atualizar Venda

```http
PUT /vendas/:id
```

### Deletar Venda

```http
DELETE /vendas/:id
```

## Endpoints de Clientes

### Listar Clientes

```http
GET /clientes
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Cliente Exemplo",
      "email": "cliente@exemplo.com",
      "phone": "11999999999",
      "address": "Rua Exemplo, 123",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Criar Cliente

```http
POST /clientes
```

**Request Body:**

```json
{
  "name": "Cliente Exemplo",
  "email": "cliente@exemplo.com",
  "phone": "11999999999",
  "address": "Rua Exemplo, 123"
}
```

### Atualizar Cliente

```http
PUT /clientes/:id
```

### Deletar Cliente

```http
DELETE /clientes/:id
```

## Endpoints de Produtos

### Listar Produtos

```http
GET /produtos
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Produto Exemplo",
      "description": "Descrição do produto",
      "price": 100.0,
      "stock": 50,
      "category": "Categoria Exemplo",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Criar Produto

```http
POST /produtos
```

**Request Body:**

```json
{
  "name": "Produto Exemplo",
  "description": "Descrição do produto",
  "price": 100.0,
  "stock": 50,
  "category": "Categoria Exemplo"
}
```

## Endpoints de Contas a Pagar

### Listar Contas a Pagar

```http
GET /contas-pagar
```

**Query Parameters:**

- `status`: Filtrar por status
- `fornecedorId`: Filtrar por fornecedor
- `vencimento`: Filtrar por data de vencimento

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "fornecedor": {
        "id": 1,
        "name": "Fornecedor Exemplo"
      },
      "description": "Conta de energia",
      "amount": 500.0,
      "dueDate": "2024-01-15",
      "status": "pendente",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Criar Conta a Pagar

```http
POST /contas-pagar
```

**Request Body:**

```json
{
  "fornecedorId": 1,
  "description": "Conta de energia",
  "amount": 500.0,
  "dueDate": "2024-01-15"
}
```

## Sistema Inteligente de Vencimentos

### Contas Vencidas Hoje

```http
GET /contas-pagar/vencidas-hoje
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "fornecedor": {
        "id": 1,
        "name": "Fornecedor Exemplo"
      },
      "description": "Conta de energia",
      "amount": 500.0,
      "dueDate": "2024-01-15",
      "status": "pendente",
      "daysOverdue": 0
    }
  ]
}
```

### Próximos Vencimentos (7 dias)

```http
GET /contas-pagar/proximos-vencimentos
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "fornecedor": {
        "id": 2,
        "name": "Fornecedor Exemplo 2"
      },
      "description": "Conta de água",
      "amount": 200.0,
      "dueDate": "2024-01-20",
      "status": "pendente",
      "daysUntilDue": 3
    }
  ]
}
```

### Dashboard de Contas a Pagar

```http
GET /contas-pagar/dashboard
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalPendente": 5000.0,
    "vencidasHoje": 1500.0,
    "proximosVencimentos": 2000.0,
    "contasVencidas": 5,
    "contasProximas": 8,
    "fornecedores": [
      {
        "id": 1,
        "name": "Fornecedor Exemplo",
        "totalPendente": 1000.0,
        "contasVencidas": 2
      }
    ]
  }
}
```

## Endpoints de Relatórios

### Relatório de Vendas

```http
GET /relatorios/vendas
```

**Query Parameters:**

- `startDate`: Data inicial
- `endDate`: Data final
- `clienteId`: Filtrar por cliente
- `format`: Formato do relatório (json, excel, pdf)

### Relatório de Contas a Pagar

```http
GET /relatorios/contas-pagar
```

**Query Parameters:**

- `status`: Filtrar por status
- `fornecedorId`: Filtrar por fornecedor
- `format`: Formato do relatório (json, excel, pdf)

### Exportar Relatório

```http
POST /relatorios/exportar
```

**Request Body:**

```json
{
  "tipo": "vendas",
  "filtros": {
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  },
  "formato": "excel"
}
```

## Endpoints de Usuários

### Listar Usuários

```http
GET /usuarios
```

### Criar Usuário

```http
POST /usuarios
```

**Request Body:**

```json
{
  "name": "Usuário Exemplo",
  "email": "usuario@exemplo.com",
  "password": "senha123",
  "role": "admin"
}
```

### Atualizar Usuário

```http
PUT /usuarios/:id
```

### Deletar Usuário

```http
DELETE /usuarios/:id
```

## Códigos de Erro HTTP

### 200 - OK

Operação realizada com sucesso.

### 201 - Created

Recurso criado com sucesso.

### 400 - Bad Request

Dados inválidos na requisição.

### 401 - Unauthorized

Token de autenticação inválido ou ausente.

### 403 - Forbidden

Usuário não tem permissão para acessar o recurso.

### 404 - Not Found

Recurso não encontrado.

### 500 - Internal Server Error

Erro interno do servidor.

## Exemplos de Uso

### JavaScript/TypeScript

```typescript
// Exemplo de uso com Axios
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

// Buscar vendas
const vendas = await api.get("/vendas");

// Criar venda
const novaVenda = await api.post("/vendas", {
  clienteId: 1,
  produtos: [{ produtoId: 1, quantity: 2 }],
});
```

### cURL

```bash
# Buscar vendas
curl -X GET "http://localhost:3001/api/vendas" \
  -H "Authorization: Bearer <token>"

# Criar venda
curl -X POST "http://localhost:3001/api/vendas" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "clienteId": 1,
    "produtos": [
      {"produtoId": 1, "quantity": 2}
    ]
  }'
```

## Rate Limiting

A API implementa rate limiting para prevenir abuso:

- **Limite**: 100 requisições por minuto por IP
- **Headers de Resposta**:
  - `X-RateLimit-Limit`: Limite total
  - `X-RateLimit-Remaining`: Requisições restantes
  - `X-RateLimit-Reset`: Timestamp de reset

## Versionamento

A API utiliza versionamento por URL:

- **Versão Atual**: v1
- **URL Base**: `/api/v1/`
- **Compatibilidade**: Mantida por pelo menos 6 meses

## Webhooks

A API suporta webhooks para notificações em tempo real:

- **Eventos**: venda.criada, venda.atualizada, conta.vencida
- **Configuração**: Via endpoint `/webhooks`
- **Autenticação**: Assinatura HMAC

## Guia do Desenvolvedor - ProTrack 2.0

### Introdução

Este guia é destinado a desenvolvedores que trabalharão no ProTrack 2.0. Ele contém informações técnicas detalhadas sobre a arquitetura, padrões de desenvolvimento, configuração do ambiente e fluxo de trabalho.

### Novidades da Versão 2.0

#### Sistema Inteligente de Vencimentos

- **Cálculo Automático**: Identificação automática de contas vencidas hoje
- **Alertas Preventivos**: Notificação de vencimentos dos próximos 7 dias
- **Dashboard Proativo**: Interface intuitiva para gestão financeira
- **Gestão de Fornecedores**: Controle completo de fornecedores

#### Melhorias Técnicas

- **Performance**: Otimizações de banco de dados e frontend
- **Segurança**: Implementação de melhores práticas de segurança
- **Monitoramento**: Sistema de logs e métricas aprimorado
- **Testes**: Cobertura de testes expandida

## Configuração do Ambiente

### Pré-requisitos

- Node.js 18+
- MySQL 8.0+
- npm ou yarn
- Git

### Instalação

#### 1. Clone do Repositório

```bash
git clone https://github.com/seu-usuario/ProTrack-2.0.git
cd ProTrack-2.0
```

#### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Configure as variáveis de ambiente
npm run dev
```

#### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Configure as variáveis de ambiente
npm run dev
```

### Variáveis de Ambiente

#### Backend (.env)

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/protrack"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:3000"

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=ProTrack 2.0
VITE_APP_VERSION=2.0.0
```

## Estrutura do Projeto

### Backend

```
backend/
├── src/
│   ├── controllers/     # Controladores das rotas
│   ├── services/        # Lógica de negócio
│   ├── models/          # Modelos de dados
│   ├── routes/          # Definição de rotas
│   ├── middleware/      # Middlewares customizados
│   ├── utils/           # Utilitários
│   └── types/           # Tipos TypeScript
├── prisma/
│   ├── schema.prisma    # Schema do banco
│   └── migrations/      # Migrações
├── scripts/             # Scripts de automação
└── tests/               # Testes
```

### Frontend

```
frontend/
├── src/
│   ├── components/      # Componentes React
│   ├── hooks/           # Hooks customizados
│   ├── pages/           # Páginas da aplicação
│   ├── services/        # Serviços de API
│   ├── utils/           # Utilitários
│   ├── types/           # Tipos TypeScript
│   └── styles/          # Estilos globais
├── public/              # Arquivos estáticos
└── tests/               # Testes
```

## Implementação do Sistema Inteligente de Vencimentos

### Backend Implementation

#### Service Layer

```typescript
// services/contasPagar.service.ts
export class ContasPagarService {
  async getContasVencidasHoje(): Promise<ContaPagar[]> {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return await prisma.contasPagar.findMany({
      where: {
        dataVencimento: {
          gte: hoje,
          lt: new Date(hoje.getTime() + 24 * 60 * 60 * 1000),
        },
        status: "pendente",
      },
      include: {
        fornecedor: true,
      },
      orderBy: {
        dataVencimento: "asc",
      },
    });
  }

  async getProximosVencimentos(): Promise<ContaPagar[]> {
    const hoje = new Date();
    const proximos7Dias = new Date();
    proximos7Dias.setDate(hoje.getDate() + 7);

    return await prisma.contasPagar.findMany({
      where: {
        dataVencimento: {
          gte: hoje,
          lte: proximos7Dias,
        },
        status: "pendente",
      },
      include: {
        fornecedor: true,
      },
      orderBy: {
        dataVencimento: "asc",
      },
    });
  }

  async getDashboardData(): Promise<DashboardData> {
    const [totalPendente, vencidasHoje, proximosVencimentos] =
      await Promise.all([
        this.getTotalPendente(),
        this.getContasVencidasHoje(),
        this.getProximosVencimentos(),
      ]);

    return {
      totalPendente: totalPendente.reduce((sum, conta) => sum + conta.valor, 0),
      vencidasHoje: vencidasHoje.reduce((sum, conta) => sum + conta.valor, 0),
      proximosVencimentos: proximosVencimentos.reduce(
        (sum, conta) => sum + conta.valor,
        0
      ),
      contasVencidas: vencidasHoje.length,
      contasProximas: proximosVencimentos.length,
    };
  }
}
```

#### Controller Layer

```typescript
// controllers/contasPagar.controller.ts
export class ContasPagarController {
  async getContasVencidasHoje(req: Request, res: Response) {
    try {
      const contas = await contasPagarService.getContasVencidasHoje();
      res.json({
        success: true,
        data: contas,
        message: "Contas vencidas hoje recuperadas com sucesso",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getProximosVencimentos(req: Request, res: Response) {
    try {
      const contas = await contasPagarService.getProximosVencimentos();
      res.json({
        success: true,
        data: contas,
        message: "Próximos vencimentos recuperados com sucesso",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getDashboard(req: Request, res: Response) {
    try {
      const dashboard = await contasPagarService.getDashboardData();
      res.json({
        success: true,
        data: dashboard,
        message: "Dashboard recuperado com sucesso",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}
```

#### Routes

```typescript
// routes/contasPagar.routes.ts
import { Router } from "express";
import { ContasPagarController } from "../controllers/contasPagar.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const controller = new ContasPagarController();

// Middleware de autenticação
router.use(authMiddleware);

// Rotas do sistema inteligente
router.get("/vencidas-hoje", controller.getContasVencidasHoje);
router.get("/proximos-vencimentos", controller.getProximosVencimentos);
router.get("/dashboard", controller.getDashboard);

export default router;
```

### Frontend Implementation

#### Custom Hook

```typescript
// hooks/useContasPagar.ts
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
      const response = await api.get("/contas-pagar/vencidas-hoje");
      setContasVencidas(response.data.data);
    } catch (err) {
      setError("Erro ao buscar contas vencidas");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProximosVencimentos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/contas-pagar/proximos-vencimentos");
      setProximosVencimentos(response.data.data);
    } catch (err) {
      setError("Erro ao buscar próximos vencimentos");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/contas-pagar/dashboard");
      setDashboard(response.data.data);
    } catch (err) {
      setError("Erro ao buscar dados do dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContasVencidas();
    fetchProximosVencimentos();
    fetchDashboard();
  }, [fetchContasVencidas, fetchProximosVencimentos, fetchDashboard]);

  return {
    contasVencidas,
    proximosVencimentos,
    dashboard,
    loading,
    error,
    refetch: {
      contasVencidas: fetchContasVencidas,
      proximosVencimentos: fetchProximosVencimentos,
      dashboard: fetchDashboard,
    },
  };
};
```

#### Components

```typescript
// components/SummaryCards.tsx
export const SummaryCards: React.FC = () => {
  const { dashboard, loading } = useContasPagar();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SummaryCard
        title="Total Pendente"
        value={dashboard?.totalPendente || 0}
        icon={<DollarSign className="h-6 w-6" />}
        color="blue"
      />
      <SummaryCard
        title="Vencidas Hoje"
        value={dashboard?.vencidasHoje || 0}
        icon={<AlertTriangle className="h-6 w-6" />}
        color="red"
      />
      <SummaryCard
        title="Próximos 7 Dias"
        value={dashboard?.proximosVencimentos || 0}
        icon={<Calendar className="h-6 w-6" />}
        color="orange"
      />
    </div>
  );
};

// components/AccountsTable.tsx
export const AccountsTable: React.FC<{ accounts: ContaPagar[] }> = ({
  accounts,
}) => {
  const columns = [
    { key: "fornecedor", label: "Fornecedor" },
    { key: "descricao", label: "Descrição" },
    { key: "valor", label: "Valor" },
    { key: "dataVencimento", label: "Vencimento" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Ações" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {accounts.map((account) => (
            <tr
              key={account.id}
              className={account.status === "vencida" ? "bg-red-50" : ""}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {account.fornecedor.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {account.descricao}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                R$ {account.valor.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(account.dataVencimento).toLocaleDateString("pt-BR")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    account.status === "vencida"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {account.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                  Editar
                </button>
                <button className="text-green-600 hover:text-green-900">
                  Marcar como Paga
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

## Padrões de Desenvolvimento

### 1. Estrutura de Arquivos

- **Organização por Feature**: Agrupe arquivos relacionados
- **Separação de Responsabilidades**: Controllers, Services, Models
- **Nomenclatura Consistente**: Use nomes descritivos
- **Tipagem Forte**: Use TypeScript em todo o projeto

### 2. Código Limpo

- **Funções Pequenas**: Uma responsabilidade por função
- **Nomes Descritivos**: Variáveis e funções com nomes claros
- **Comentários**: Documente código complexo
- **Refatoração**: Mantenha o código limpo

### 3. Tratamento de Erros

```typescript
// Padrão de tratamento de erros
export const handleError = (error: Error, context: string) => {
  logger.error(`Erro em ${context}:`, {
    message: error.message,
    stack: error.stack,
    timestamp: new Date(),
  });

  throw new Error(`Erro em ${context}: ${error.message}`);
};
```

### 4. Validação de Dados

```typescript
// Usando Zod para validação
import { z } from "zod";

const CreateVendaSchema = z.object({
  clienteId: z.number().positive(),
  produtos: z.array(
    z.object({
      produtoId: z.number().positive(),
      quantity: z.number().positive(),
    })
  ),
  observacoes: z.string().optional(),
});

export const validateCreateVenda = (data: unknown) => {
  return CreateVendaSchema.parse(data);
};
```

## Testes

### Configuração de Testes

```typescript
// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/index.ts"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Exemplo de Teste

```typescript
// tests/services/contasPagar.service.test.ts
import { ContasPagarService } from "../../src/services/contasPagar.service";
import { prisma } from "../../src/utils/prisma";

describe("ContasPagarService", () => {
  let service: ContasPagarService;

  beforeEach(() => {
    service = new ContasPagarService();
  });

  afterEach(async () => {
    await prisma.contasPagar.deleteMany();
  });

  describe("getContasVencidasHoje", () => {
    it("deve retornar contas vencidas hoje", async () => {
      // Arrange
      const hoje = new Date();
      const conta = await prisma.contasPagar.create({
        data: {
          fornecedorId: 1,
          descricao: "Teste",
          valor: 100,
          dataVencimento: hoje,
          status: "pendente",
        },
      });

      // Act
      const result = await service.getContasVencidasHoje();

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(conta.id);
    });
  });
});
```

## Deploy e Produção

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=mysql://user:password@db:3306/protrack
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=rootpassword
      - MYSQL_DATABASE=protrack
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

## Monitoramento e Logs

### Configuração de Logs

```typescript
// utils/logger.ts
import winston from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});
```

### Métricas

```typescript
// middleware/metrics.middleware.ts
export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info("Request completed", {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
};
```

## Contribuição

### Fluxo de Trabalho

1. **Fork** do repositório
2. **Branch** para nova feature
3. **Commit** com mensagens descritivas
4. **Pull Request** com descrição detalhada
5. **Code Review** e aprovação
6. **Merge** para main

### Padrões de Commit

```
feat: adiciona sistema inteligente de vencimentos
fix: corrige bug na validação de datas
docs: atualiza documentação da API
style: formata código conforme padrões
refactor: refatora serviço de contas a pagar
test: adiciona testes para novo hook
chore: atualiza dependências
```

## Suporte

Para suporte técnico ou dúvidas sobre a API:

- **Documentação**: Consulte este guia
- **Exemplos**: Veja a pasta `examples/`
- **Issues**: Abra uma issue no repositório
- **Contato**: Entre em contato com a equipe de desenvolvimento

## Conclusão

Este guia fornece as informações necessárias para desenvolver no ProTrack 2.0. Mantenha-se atualizado com as melhores práticas e sempre consulte a documentação oficial das tecnologias utilizadas.

Para dúvidas específicas ou suporte técnico, entre em contato com a equipe de desenvolvimento.
