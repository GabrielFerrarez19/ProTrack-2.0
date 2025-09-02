# 🏗️ Arquitetura Técnica - ProTrack 2.0

## 🎯 Visão Geral da Arquitetura

O **ProTrack 2.0** segue uma arquitetura **Monolítica Modular** com separação clara entre frontend e backend, implementando padrões modernos de desenvolvimento web.

## 🏛️ Padrão Arquitetural

### **Arquitetura em Camadas**

```
┌─────────────────────────────────────┐
│           Frontend (React)          │ ← Camada de Apresentação
├─────────────────────────────────────┤
│           Backend (Express)         │ ← Camada de Aplicação
├─────────────────────────────────────┤
│           Services Layer            │ ← Camada de Negócio
├─────────────────────────────────────┤
│           Database Layer            │ ← Camada de Dados
└─────────────────────────────────────┘
```

### **Separação de Responsabilidades**

- **Frontend**: Interface do usuário e lógica de apresentação
- **Backend**: API RESTful e lógica de negócio
- **Services**: Regras de negócio e validações
- **Controllers**: Controle de requisições e respostas
- **Routes**: Definição de endpoints
- **Database**: Persistência de dados

## 🔧 Frontend Architecture

### **1. Estrutura de Componentes**

#### **Padrão de Organização**

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── header/         # Componentes específicos de layout
│   └── Sidebar/        # Componentes de navegação
├── pages/               # Páginas da aplicação
├── hooks/               # Custom hooks React
├── services/            # Serviços de API
├── @types/              # Definições de tipos
└── utils/               # Utilitários e helpers
```

#### **Padrão de Nomenclatura**

- **Componentes**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useUserData.ts`)
- **Serviços**: camelCase (`userService.ts`)
- **Tipos**: PascalCase com sufixo (`UserResponse.ts`)

### **2. Gerenciamento de Estado**

#### **Padrão de Estado Local**

```typescript
// Hook personalizado com estado local
export const useVendasVencidas = () => {
  const [vendas, setVendas] = useState<VendaResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Lógica de negócio encapsulada
  const loadData = useCallback(async () => {
    // Implementação
  }, []);

  return { vendas, loading, error, loadData };
};
```

#### **Context API para Estado Global**

```typescript
// SidebarContext.tsx
export const SidebarContext = createContext<SidebarContextType | undefined>(
  undefined
);

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};
```

### **3. Padrão de Roteamento**

#### **Estrutura de Rotas**

```typescript
// Router.tsx - Roteamento hierárquico
export function Router() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/confirmacaoemail" element={<ConfirmacaoEmail />} />

      {/* Layout protegido */}
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/status" element={<Status />} />
        <Route path="/clientes" element={<Cliente />} />
        {/* Outras rotas protegidas */}
      </Route>
    </Routes>
  );
}
```

### **4. Padrão de Formulários**

#### **React Hook Form + Zod**

```typescript
// Validação com Zod
const schemaVenda = z.object({
  data_venda: z.string().min(1, "Data é obrigatória"),
  desconto: z.number().min(0, "Desconto deve ser >= 0"),
  status: z.enum(["pendente", "pago", "cancelado", "aprazo"]),
  formaPagamento: z.enum([
    "dinheiro",
    "cartao",
    "pix",
    "transferencia",
    "aprazo",
  ]),
  diasVencimento: z.number().optional(),
  itens: z
    .array(
      z.object({
        produto_id: z.number(),
        quantidade: z.number().min(1),
        preco_unitario: z.number().min(0),
      })
    )
    .min(1, "Pelo menos um item é obrigatório"),
});

// Uso no componente
const form = useForm<VendaForm>({
  resolver: zodResolver(schemaVenda),
  defaultValues: {
    data_venda: new Date().toISOString().split("T")[0],
    desconto: 0,
    status: "pendente",
    formaPagamento: "dinheiro",
    itens: [],
  },
});
```

## 🔧 Backend Architecture

### **1. Estrutura de Camadas**

#### **Padrão MVC Modificado**

```
src/
├── controllers/         # Controladores (C)
├── services/            # Serviços de negócio (M)
├── routes/              # Definição de rotas
├── middlewares/         # Middlewares Express
├── config/              # Configurações
└── utils/               # Utilitários
```

#### **Fluxo de Dados**

```
Request → Route → Controller → Service → Database
Response ← Controller ← Service ← Database
```

### **2. Padrão de Controllers**

#### **Estrutura Padrão**

```typescript
// client.controller.ts
export const getClientesEmAbertoCountController = async (
  req: Request,
  res: Response
) => {
  try {
    const count = await getClientesEmAbertoCountDb();

    res.status(200).json({
      success: true,
      message: "Contagem de clientes em aberto realizada com sucesso",
      data: { count },
    });
  } catch (error) {
    console.error("Erro ao contar clientes em aberto:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};
```

#### **Padrão de Resposta**

```typescript
// Estrutura padrão de resposta
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Exemplo de uso
res.status(200).json({
  success: true,
  message: "Operação realizada com sucesso",
  data: result,
});
```

### **3. Padrão de Services**

#### **Separação de Responsabilidades**

```typescript
// venda.service.ts
export const criarVendaDb = async (vendaData: VendaData): Promise<number> => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Inserir venda principal
    const vendaId = await inserirVenda(connection, vendaData);

    // 2. Inserir itens da venda
    await inserirItensVenda(connection, vendaId, vendaData.itens);

    // 3. Atualizar estoque
    await atualizarEstoque(connection, vendaData.itens);

    await connection.commit();
    return vendaId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
```

#### **Padrão de Transações**

```typescript
// Gerenciamento de transações
const connection = await db.getConnection();
try {
  await connection.beginTransaction();

  // Operações de banco

  await connection.commit();
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  connection.release();
}
```

### **4. Padrão de Rotas**

#### **Organização Modular**

```typescript
// routes/index.ts
import clientRoutes from "./clientRoutes";
import productRoutes from "./productRoutes";
import vendasRoutes from "./vendasRoutes";
import vendasMonitoramentoRoutes from "./vendasMonitoramentoRoutes";

const router = Router();

// Agrupamento por domínio
router.use("/clients", clientRoutes);
router.use("/product", productRoutes);
router.use("/vendas", vendasRoutes);
router.use("/monitoramento", vendasMonitoramentoRoutes);

export default router;
```

#### **Definição de Endpoints**

```typescript
// clientRoutes.ts
const router = Router();

router.get("/clientes/todos", getAllClientesController);
router.post("/clientes", createClienteController);
router.put("/altera/:id", updateClienteController);
router.get("/em-aberto/count", getClientesEmAbertoCountController);

export default router;
```

## 🗄️ Database Architecture

### **1. Estrutura de Tabelas**

#### **Principais Entidades**

```sql
-- Usuários do sistema
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Produtos do estoque
CREATE TABLE produtos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  categoria VARCHAR(100),
  quantidade INT DEFAULT 0,
  preco_custo DECIMAL(10,2),
  preco_venda DECIMAL(10,2),
  codigo_barras VARCHAR(50) UNIQUE
);

-- Clientes
CREATE TABLE clientes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) UNIQUE,
  email VARCHAR(255),
  telefone VARCHAR(20),
  endereco TEXT,
  valor_a_pagar DECIMAL(10,2) DEFAULT 0
);

-- Vendas
CREATE TABLE vendas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cliente_id INT,
  data_venda DATE NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  desconto DECIMAL(10,2) DEFAULT 0,
  total_com_desconto DECIMAL(10,2) NOT NULL,
  status ENUM('pendente', 'pago', 'cancelado', 'aprazo', 'vencido') DEFAULT 'pendente',
  forma_pagamento ENUM('dinheiro', 'cartao', 'pix', 'transferencia', 'aprazo'),
  dias_vencimento INT,
  data_vencimento DATE,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);
```

#### **Relacionamentos**

```sql
-- Chaves estrangeiras e índices
ALTER TABLE vendas ADD CONSTRAINT fk_vendas_cliente
  FOREIGN KEY (cliente_id) REFERENCES clientes(id);

ALTER TABLE itens_venda ADD CONSTRAINT fk_itens_venda
  FOREIGN KEY (venda_id) REFERENCES vendas(id);

ALTER TABLE itens_venda ADD CONSTRAINT fk_itens_produto
  FOREIGN KEY (produto_id) REFERENCES produtos(id);

-- Índices para performance
CREATE INDEX idx_vendas_monitoramento ON vendas (forma_pagamento, status, data_venda, dias_vencimento);
CREATE INDEX idx_vendas_cliente ON vendas (cliente_id);
CREATE INDEX idx_produtos_categoria ON produtos (categoria);
```

### **2. Padrão de Queries**

#### **Queries Otimizadas**

```sql
-- Vendas com informações completas
SELECT
  v.id,
  v.data_venda,
  v.total_com_desconto,
  v.status,
  v.forma_pagamento,
  v.dias_vencimento,
  v.data_vencimento,
  c.nome as cliente_nome,
  c.cpf as cliente_cpf
FROM vendas v
JOIN clientes c ON v.cliente_id = c.id
WHERE v.status NOT IN ('pago', 'cancelado')
ORDER BY v.data_venda DESC;

-- Produtos com estoque baixo
SELECT
  nome,
  quantidade,
  preco_venda,
  CASE
    WHEN quantidade <= 5 THEN 'CRÍTICO'
    WHEN quantidade <= 15 THEN 'BAIXO'
    ELSE 'NORMAL'
  END as status_estoque
FROM produtos
WHERE quantidade <= 15
ORDER BY quantidade ASC;
```

#### **Stored Procedures (Opcional)**

```sql
-- Procedimento para calcular vendas vencidas
DELIMITER //
CREATE PROCEDURE CalcularVendasVencidas()
BEGIN
  UPDATE vendas
  SET status = 'vencido'
  WHERE forma_pagamento = 'aprazo'
    AND status NOT IN ('pago', 'cancelado', 'vencido')
    AND DATE_ADD(data_venda, INTERVAL dias_vencimento DAY) < CURDATE();
END //
DELIMITER ;
```

## 🔄 Sistema de Monitoramento

### **1. Arquitetura do Monitoramento**

#### **Padrão de Serviço Dedicado**

```typescript
// vendasMonitoramento.service.ts
export const executarMonitoramentoVendas = async () => {
  try {
    // 1. Identificar vendas vencidas
    const vendasVencidas = await identificarVendasVencidas();

    // 2. Marcar como vencidas
    if (vendasVencidas.length > 0) {
      await marcarVendasComoVencidas(vendasVencidas);
    }

    // 3. Retornar estatísticas
    return {
      vendasIdentificadas: vendasVencidas.length,
      vendasProcessadas: vendasVencidas.length,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Erro no monitoramento:", error);
    throw error;
  }
};
```

#### **Padrão de Execução Automática**

```javascript
// monitoramentoVendas.js
#!/usr/bin/env node
const { executarMonitoramentoVendas } = require('../services/vendasMonitoramento.service');

async function executarMonitoramentoAutomatico() {
  try {
    const resultado = await executarMonitoramentoVendas();
    console.log(`✅ Monitoramento executado: ${JSON.stringify(resultado)}`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Erro no monitoramento: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  executarMonitoramentoAutomatico();
}
```

### **2. Configuração de Cron**

#### **Padrão de Execução**

```bash
# Execução a cada 5 minutos
*/5 * * * * cd /caminho/para/protrack-server && node src/scripts/monitoramentoVendas.js >> logs/monitoramento.log 2>&1

# Logs com rotação
/var/log/protrack/monitoramento.log {
  daily
  rotate 7
  compress
  delaycompress
  missingok
  notifempty
  create 644 protrack protrack
}
```

## 🔒 Segurança e Validação

### **1. Validação de Entrada**

#### **Padrão Zod**

```typescript
// schemas/schemaVendas.ts
export const schemaVenda = z.object({
  data_venda: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, "Data inválida"),

  desconto: z
    .number()
    .min(0, "Desconto deve ser >= 0")
    .max(100, "Desconto máximo é 100%"),

  status: z.enum(["pendente", "pago", "cancelado", "aprazo"]),

  formaPagamento: z.enum([
    "dinheiro",
    "cartao",
    "pix",
    "transferencia",
    "aprazo",
  ]),

  diasVencimento: z
    .number()
    .min(1, "Dias de vencimento deve ser >= 1")
    .max(365, "Dias de vencimento máximo é 365")
    .optional(),

  itens: z
    .array(
      z.object({
        produto_id: z.number().positive("ID do produto deve ser positivo"),
        quantidade: z.number().min(1, "Quantidade deve ser >= 1"),
        preco_unitario: z.number().min(0, "Preço deve ser >= 0"),
      })
    )
    .min(1, "Pelo menos um item é obrigatório"),
});
```

### **2. Middleware de Segurança**

#### **CORS Configurado**

```typescript
// app.ts
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend Vite
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

#### **Validação de Dados**

```typescript
// Middleware de validação
export const validateRequest = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Dados inválidos",
          errors: error.errors,
        });
      }
      next(error);
    }
  };
};
```

## 📱 Responsividade e UX

### **1. Padrão Mobile First**

#### **Hook de Detecção**

```typescript
// hooks/use-mobile.ts
export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};
```

#### **Componentes Responsivos**

```typescript
// Sidebar responsivo
export const Sidebar = () => {
  const { isOpen, setIsOpen } = useSidebar();
  const isMobile = useMobile();

  if (isMobile && !isOpen) return null;

  return (
    <aside
      className={`
      ${isMobile ? "fixed inset-0 z-50" : "relative"}
      bg-white border-r border-gray-200
      ${isMobile ? "w-full" : "w-64"}
    `}
    >
      {/* Conteúdo da sidebar */}
    </aside>
  );
};
```

### **2. Padrão de Loading States**

#### **Estados de Carregamento**

```typescript
// Hook com estados de loading
export const useData = <T>() => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, loadData };
};
```

## 🚀 Performance e Otimização

### **1. Lazy Loading**

#### **Carregamento de Componentes**

```typescript
// Router com lazy loading
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Relatorios = lazy(() => import("./pages/Relatorios"));

export function Router() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/relatorios" element={<Relatorios />} />
      </Routes>
    </Suspense>
  );
}
```

### **2. Memoização e Otimização**

#### **useMemo e useCallback**

```typescript
// Otimização de cálculos pesados
export const useCalculatedData = (vendas: Venda[]) => {
  const totalVendas = useMemo(() => {
    return vendas.reduce((total, venda) => total + venda.total, 0);
  }, [vendas]);

  const vendasPorMes = useMemo(() => {
    return groupBy(vendas, (venda) =>
      format(new Date(venda.data_venda), "yyyy-MM")
    );
  }, [vendas]);

  return { totalVendas, vendasPorMes };
};
```

## 🔧 Configuração e Deploy

### **1. Variáveis de Ambiente**

#### **Configuração por Ambiente**

```bash
# .env.development
NODE_ENV=development
PORT=8085
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=protrack_dev

# .env.production
NODE_ENV=production
PORT=8085
DB_HOST=production-db-host
DB_USER=prod_user
DB_PASSWORD=secure_password
DB_NAME=protrack_prod
```

### **2. Scripts de Build**

#### **Pipeline de Deploy**

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/app.ts",
    "build": "tsc && npm run copy-assets",
    "start": "node dist/app.js",
    "copy-assets": "cp -r src/config dist/ && cp -r src/scripts dist/",
    "deploy": "npm run build && npm start"
  }
}
```

## 📊 Monitoramento e Logs

### **1. Estrutura de Logs**

#### **Padrão de Logging**

```typescript
// Utilitário de logging
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`, data || "");
  },

  error: (message: string, error?: any) => {
    console.error(
      `[ERROR] ${new Date().toISOString()}: ${message}`,
      error || ""
    );
  },

  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, data || "");
  },
};
```

### **2. Métricas de Performance**

#### **Middleware de Performance**

```typescript
// Middleware de métricas
export const performanceMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(
      `${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};
```

## 🎯 Padrões de Código

### **1. Nomenclatura**

#### **Convenções**

- **Variáveis**: camelCase (`totalVendas`, `clienteAtivo`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_RETRY_ATTEMPTS`)
- **Funções**: camelCase (`getVendasVencidas`, `updateCliente`)
- **Classes**: PascalCase (`VendaService`, `ClienteController`)
- **Interfaces**: PascalCase com prefixo (`IVenda`, `ClienteResponse`)
- **Arquivos**: kebab-case (`venda-service.ts`, `cliente-controller.ts`)

### **2. Estrutura de Arquivos**

#### **Organização por Domínio**

```
src/
├── modules/
│   ├── vendas/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   └── types/
│   ├── clientes/
│   └── produtos/
├── shared/
│   ├── utils/
│   ├── middlewares/
│   └── types/
└── config/
```

## 🎉 Conclusão

A arquitetura do **ProTrack 2.0** implementa:

- ✅ **Padrões modernos** de desenvolvimento web
- ✅ **Separação clara** de responsabilidades
- ✅ **Escalabilidade** para crescimento futuro
- ✅ **Manutenibilidade** com código limpo e organizado
- ✅ **Performance** com otimizações adequadas
- ✅ **Segurança** com validação robusta
- ✅ **Monitoramento** automático e eficiente

Esta arquitetura fornece uma base sólida para o sistema e permite fácil expansão e manutenção conforme necessário.
