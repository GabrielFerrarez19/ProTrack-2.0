# 🏗️ ARQUITETURA TÉCNICA PROTRACK 2.0

## 🎯 VISÃO GERAL DA ARQUITETURA

O ProTrack 2.0 utiliza uma arquitetura **full-stack moderna** com separação clara de responsabilidades, seguindo princípios de **Clean Architecture** e **Domain-Driven Design**.

## 🏛️ ARQUITETURA GERAL

```
┌─────────────────────────────────────────────────────────────┐
│                    PROTRACK 2.0 SYSTEM                     │
├─────────────────────────────────────────────────────────────┤
│  🌐 FRONTEND (React + TypeScript)                          │
│  ├── Presentation Layer (Components)                       │
│  ├── Business Logic Layer (Hooks)                         │
│  ├── Data Access Layer (Services)                         │
│  └── State Management (React Hooks)                       │
├─────────────────────────────────────────────────────────────┤
│  🔌 API GATEWAY (Express + TypeScript)                    │
│  ├── Route Controllers                                     │
│  ├── Middleware Layer                                      │
│  ├── Business Services                                     │
│  └── Data Access Layer                                     │
├─────────────────────────────────────────────────────────────┤
│  🗄️ DATABASE LAYER (MySQL)                                │
│  ├── Relational Database                                   │
│  ├── Connection Pooling                                    │
│  └── Data Persistence                                      │
└─────────────────────────────────────────────────────────────┘
```

## 🎨 FRONTEND ARCHITECTURE

### 1. **Estrutura de Camadas**

```
src/
├── 📱 Presentation Layer (UI Components)
│   ├── components/ui/           # Base components (shadcn/ui)
│   ├── components/header/       # Header components
│   ├── components/Sidebar/      # Navigation components
│   └── pages/                  # Page components
├── 🧠 Business Logic Layer (Hooks)
│   ├── hooks/useContasPagar.ts # Business logic for accounts
│   ├── hooks/useVendas.ts      # Business logic for sales
│   ├── hooks/useClientes.ts    # Business logic for clients
│   └── hooks/useProdutos.ts    # Business logic for products
├── 🔌 Data Access Layer (Services)
│   ├── services/api.ts         # API service layer
│   └── services/apiClient.ts   # HTTP client configuration
├── 📋 State Management
│   ├── React Hooks (useState, useEffect)
│   ├── Custom Hooks for business logic
│   └── Local component state
└── 🛠️ Utilities & Types
    ├── @types/                 # TypeScript type definitions
    ├── utils/                  # Utility functions
    └── schemas/                # Zod validation schemas
```

### 2. **Component Architecture**

#### **Atomic Design Pattern**

```
Atoms → Molecules → Organisms → Templates → Pages

🔴 Atoms: Button, Input, Label, Icon
🟡 Molecules: SearchBar, FormField, Card
🟢 Organisms: Header, Sidebar, DataTable
🔵 Templates: DashboardLayout, FormLayout
🟣 Pages: Dashboard, ContasPagar, Vendas
```

#### **Component Composition**

```typescript
// Exemplo de composição de componentes
<DefaultLayout>
  <Header />
  <Sidebar />
  <main>
    <ContasPagar>
      <SummaryCards />
      <FiltersBar />
      <AccountsTable />
    </ContasPagar>
  </main>
</DefaultLayout>
```

### 3. **State Management Strategy**

#### **Local State (useState)**

```typescript
const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("todos");
const [categoriaFilter, setCategoriaFilter] = useState("todas");
```

#### **Business Logic State (Custom Hooks)**

```typescript
const { contas, categorias, resumo, loading, error, listarContas, criarConta } =
  useContasPagar();
```

#### **API State Management**

```typescript
// Centralized API state management
const [apiState, setApiState] = useState({
  loading: false,
  error: null,
  data: null,
});
```

## 🖥️ BACKEND ARCHITECTURE

### 1. **Estrutura de Camadas**

```
src/
├── 🚪 Entry Point (app.ts)
├── 🛣️ Routes Layer
│   ├── index.ts               # Main router
│   ├── clientRoutes.ts        # Client endpoints
│   ├── productRoutes.ts       # Product endpoints
│   ├── vendasRoutes.ts        # Sales endpoints
│   └── contasPagarRoutes.ts   # Accounts endpoints
├── 🎮 Controllers Layer
│   ├── auth.controller.ts      # Authentication logic
│   ├── client.controller.ts    # Client operations
│   ├── product.controller.ts   # Product operations
│   └── vendas.controller.ts    # Sales operations
├── 🧠 Services Layer
│   ├── client.service.ts       # Business logic
│   ├── product.service.ts      # Business logic
│   └── venda.service.ts        # Business logic
├── 🗄️ Data Access Layer
│   ├── config/database.ts      # Database connection
│   └── utils/functions.ts      # Database utilities
└── 🛡️ Middleware Layer
    ├── auth.middleware.ts      # Authentication
    ├── validation.middleware.ts # Input validation
    └── error.middleware.ts     # Error handling
```

### 2. **API Design Pattern**

#### **RESTful Endpoints**

```typescript
// Client Management
GET    /clients/clientes          # List all clients
POST   /clients/clientes          # Create new client
GET    /clients/clientes/:id      # Get client by ID
PUT    /clients/altera/:id        # Update client
DELETE /clients/clientes/:id      # Delete client

// Product Management
GET    /product/produtos          # List all products
POST   /product/produtos          # Create new product
GET    /product/produtos/:id      # Get product by ID
PUT    /product/produtos/:id      # Update product
DELETE /product/produtos/:id      # Delete product

// Sales Management
GET    /vendas/todas              # List all sales
POST   /vendas/cadvendas          # Create new sale
GET    /vendas/:id                # Get sale by ID
PUT    /vendas/altera/:id         # Update sale
```

#### **Response Pattern**

```typescript
// Success Response
{
  success: true,
  data: T,
  message?: string
}

// Error Response
{
  success: false,
  error: string,
  details?: any
}
```

### 3. **Database Architecture**

#### **Connection Pooling**

```typescript
export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "gabri1234",
  database: "protrack",
  port: 3306,
  // Connection pool configuration
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
});
```

#### **Database Schema Design**

```sql
-- Core Tables
usuarios (id, email, senha, nome, criado_em)
clientes (id, nome, email, telefone, endereco, criado_em)
produtos (id, nome, descricao, preco, estoque, categoria_id)
categorias (id, nome, tipo, cor, criado_em)

-- Business Tables
vendas (id, cliente_id, total, status, data_venda, criado_em)
venda_itens (id, venda_id, produto_id, quantidade, preco_unitario)
contas_pagar (id, fornecedor_id, valor, vencimento, status, categoria_id)
contas_receber (id, cliente_id, valor, vencimento, status)

-- Relationship Tables
fornecedores (id, nome, cnpj, email, telefone)
fluxo_caixa (id, tipo, valor, data, descricao, referencia_id)
```

## 🔄 DATA FLOW ARCHITECTURE

### 1. **Frontend to Backend Flow**

```
User Action → Component → Hook → Service → API → Backend → Database
     ↓           ↓         ↓        ↓       ↓       ↓        ↓
  Click      State     Business   HTTP    Route  Service   Query
  Button     Update    Logic     Call    Match  Logic     Execute
```

### 2. **API Request Flow**

```typescript
// 1. User triggers action
const handleCreateAccount = async (accountData) => {
  // 2. Hook calls service
  const result = await criarConta(accountData);

  // 3. Service makes HTTP request
  const response = await api.post("/contas-pagar/contas", accountData);

  // 4. Backend processes request
  // 5. Database operation
  // 6. Response flows back
};
```

### 3. **State Update Flow**

```typescript
// 1. API response received
const response = await criarContaPagar(contaData);

// 2. State updated in hook
if (response.success) {
  setContas((prev) => [...prev, response.data]);
  setResumo(await obterResumo());
}

// 3. UI re-renders with new data
// 4. User sees updated information
```

## 🚀 PERFORMANCE ARCHITECTURE

### 1. **Frontend Optimization**

#### **Code Splitting**

```typescript
// Lazy loading of pages
const ContasPagar = lazy(() => import("./pages/ContasPagar"));
const Vendas = lazy(() => import("./pages/Vendas"));
```

#### **Memoization**

```typescript
// React.memo for expensive components
const AccountsTable = React.memo(({ contas, loading }) => {
  // Component logic
});

// useMemo for expensive calculations
const filteredContas = useMemo(() => {
  return contas.filter(
    (conta) =>
      conta.status === statusFilter && conta.descricao.includes(searchTerm)
  );
}, [contas, statusFilter, searchTerm]);
```

#### **Bundle Optimization**

```typescript
// Vite configuration for optimal builds
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-select"],
        },
      },
    },
  },
});
```

### 2. **Backend Optimization**

#### **Database Query Optimization**

```typescript
// Connection pooling
const pool = mysql.createPool({
  connectionLimit: 10,
  acquireTimeout: 60000,
});

// Prepared statements
const [rows] = await db.execute(
  "SELECT * FROM contas_pagar WHERE status = ? AND categoria_id = ?",
  [status, categoriaId]
);
```

#### **Caching Strategy**

```typescript
// In-memory caching for frequently accessed data
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCachedData = async (key: string, fetchFn: () => Promise<any>) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const data = await fetchFn();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
};
```

## 🔒 SECURITY ARCHITECTURE

### 1. **Authentication & Authorization**

#### **Password Security**

```typescript
// bcrypt for password hashing
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
```

#### **Session Management**

```typescript
// JWT token generation
const generateToken = (userId: string): string => {
  return jwt.sign({ userId, iat: Date.now() }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};
```

### 2. **Input Validation & Sanitization**

#### **Frontend Validation (Zod)**

```typescript
const contaSchema = z.object({
  fornecedor_nome: z.string().min(1, "Nome do fornecedor é obrigatório"),
  valor: z.number().positive("Valor deve ser positivo"),
  data_vencimento: z.string().datetime("Data de vencimento inválida"),
  categoria_id: z.string().min(1, "Categoria é obrigatória"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
});
```

#### **Backend Validation**

```typescript
// Middleware de validação
const validateContaPagar = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = contaSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message,
    });
  }
  next();
};
```

### 3. **CORS & Security Headers**

```typescript
// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
      },
    },
  })
);
```

## 📊 MONITORING & LOGGING

### 1. **Application Logging**

```typescript
// Structured logging
const logger = {
  info: (message: string, meta?: any) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`, meta);
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error);
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, meta);
  },
};
```

### 2. **Performance Monitoring**

```typescript
// Response time monitoring
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} - ${duration}ms`);
  });

  next();
});
```

### 3. **Error Handling**

```typescript
// Global error handler
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error("Unhandled error:", error);

  res.status(500).json({
    success: false,
    error: "Internal server error",
    timestamp: new Date().toISOString(),
  });
});

// Process error handlers
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
```

## 🔮 SCALABILITY ARCHITECTURE

### 1. **Horizontal Scaling**

#### **Load Balancer Strategy**

```typescript
// Multiple backend instances
const backendInstances = [
  "http://backend1:8085",
  "http://backend2:8085",
  "http://backend3:8085",
];

// Round-robin load balancing
let currentInstance = 0;
const getNextInstance = () => {
  const instance = backendInstances[currentInstance];
  currentInstance = (currentInstance + 1) % backendInstances.length;
  return instance;
};
```

#### **Database Scaling**

```typescript
// Read replicas for read operations
const readDb = mysql.createPool({
  host: process.env.READ_DB_HOST,
  // Read-only configuration
});

const writeDb = mysql.createPool({
  host: process.env.WRITE_DB_HOST,
  // Write configuration
});
```

### 2. **Vertical Scaling**

#### **Resource Optimization**

```typescript
// Memory management
const optimizeMemory = () => {
  // Clear unused cache entries
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      cache.delete(key);
    }
  }
};

// Run optimization every 5 minutes
setInterval(optimizeMemory, 5 * 60 * 1000);
```

## 📋 DEPLOYMENT ARCHITECTURE

### 1. **Environment Configuration**

```typescript
// Environment-specific configuration
const config = {
  development: {
    database: {
      host: "localhost",
      port: 3306,
      database: "protrack_dev",
    },
    cors: {
      origin: "http://localhost:5173",
    },
  },
  production: {
    database: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      database: process.env.DB_NAME,
    },
    cors: {
      origin: process.env.FRONTEND_URL,
    },
  },
};
```

### 2. **Docker Configuration**

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 8085
CMD ["node", "dist/app.js"]
```

```yaml
# docker-compose.yml
version: "3.8"
services:
  backend:
    build: ./protrack-server
    ports:
      - "8085:8085"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
    depends_on:
      - mysql

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: protrack
    volumes:
      - mysql_data:/var/lib/mysql
      - ./protrack.sql:/docker-entrypoint-initdb.d/init.sql

volumes:
  mysql_data:
```

## 🎯 BEST PRACTICES IMPLEMENTED

### 1. **Code Quality**

- ✅ TypeScript strict mode
- ✅ ESLint configuration
- ✅ Consistent code formatting
- ✅ Meaningful variable names
- ✅ Comprehensive error handling

### 2. **Security**

- ✅ Input validation and sanitization
- ✅ Password hashing with bcrypt
- ✅ CORS configuration
- ✅ Security headers
- ✅ SQL injection prevention

### 3. **Performance**

- ✅ Database connection pooling
- ✅ Lazy loading of components
- ✅ Memoization of expensive operations
- ✅ Bundle optimization
- ✅ Response time monitoring

### 4. **Maintainability**

- ✅ Clear separation of concerns
- ✅ Modular architecture
- ✅ Comprehensive documentation
- ✅ Consistent API patterns
- ✅ Error logging and monitoring

---

## 📊 ARQUITETURA SUMMARY

**🏗️ Tipo**: Full-stack modern architecture  
**🎨 Frontend**: React 19 + TypeScript + Tailwind CSS  
**🖥️ Backend**: Node.js + Express + TypeScript  
**🗄️ Database**: MySQL with connection pooling  
**🔒 Security**: bcrypt + JWT + CORS + Input validation  
**📱 Responsive**: Mobile-first design approach  
**🚀 Performance**: Optimized bundles + caching + monitoring  
**🔧 Scalable**: Horizontal + vertical scaling ready

**A arquitetura do ProTrack 2.0 foi projetada para ser robusta, escalável e fácil de manter, seguindo as melhores práticas da indústria e padrões modernos de desenvolvimento.**

---

**📅 Última Atualização**: Dezembro 2024  
**🔄 Versão**: 2.0  
**👥 Equipe**: ProTrack Development Team
