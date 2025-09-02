# 👨‍💻 Guia do Desenvolvedor - ProTrack 2.0

## 🚀 Setup Inicial do Ambiente

### **Pré-requisitos**

- **Node.js**: Versão 18+ (recomendado: 20.x LTS)
- **MySQL**: Versão 8.0+
- **Git**: Para controle de versão
- **VS Code**: Editor recomendado com extensões

### **Extensões VS Code Recomendadas**

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

### **1. Clone e Setup do Projeto**

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd ProTrack-2.0

# Setup do Backend
cd protrack-server
npm install
cp .env.example .env  # Configure as variáveis de ambiente

# Setup do Frontend
cd ../proTrack-client
npm install
```

### **2. Configuração do Banco de Dados**

```bash
# Acesse o MySQL
mysql -u root -p

# Crie o banco
CREATE DATABASE protrack CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Importe o schema
mysql -u root -p protrack < protrack.sql
```

### **3. Variáveis de Ambiente**

```bash
# protrack-server/.env
NODE_ENV=development
PORT=8085
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=protrack

# proTrack-client/.env
VITE_API_URL=http://localhost:8085
```

## 🔧 Scripts de Desenvolvimento

### **Backend (protrack-server)**

```bash
npm run dev          # Desenvolvimento com hot reload
npm run build        # Compilação TypeScript
npm start            # Produção
npm run lint         # Verificação de código (se configurado)
```

### **Frontend (proTrack-client)**

```bash
npm run dev          # Desenvolvimento Vite
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Verificação ESLint
```

## 📁 Estrutura do Projeto

### **Organização de Arquivos**

```
ProTrack-2.0/
├── protrack-server/           # Backend Node.js
│   ├── src/
│   │   ├── controllers/       # Controladores das APIs
│   │   ├── services/          # Lógica de negócio
│   │   ├── routes/            # Definição de rotas
│   │   ├── middlewares/       # Middlewares Express
│   │   ├── config/            # Configurações
│   │   ├── utils/             # Utilitários
│   │   └── scripts/           # Scripts de automação
│   └── prisma/                # Schema e migrações
├── proTrack-client/            # Frontend React
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── pages/             # Páginas da aplicação
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # Serviços de API
│   │   ├── @types/            # Definições TypeScript
│   │   └── utils/             # Utilitários
│   └── public/                # Assets estáticos
└── docs/                      # Documentação
```

## 🎯 Padrões de Código

### **1. Nomenclatura**

#### **Frontend (React)**

```typescript
// Componentes: PascalCase
export const UserProfile = () => { ... }
export const ProductCard = () => { ... }

// Hooks: camelCase com prefixo 'use'
export const useUserData = () => { ... }
export const useProductList = () => { ... }

// Funções: camelCase
const handleSubmit = () => { ... }
const calculateTotal = () => { ... }

// Variáveis: camelCase
const userData = { ... }
const productList = [ ... ]
```

#### **Backend (Node.js)**

```typescript
// Controllers: camelCase com sufixo 'Controller'
export const createUserController = async (req: Request, res: Response) => { ... }
export const updateUserController = async (req: Request, res: Response) => { ... }

// Services: camelCase com sufixo 'Db' ou 'Service'
export const createUserDb = async (userData: UserData) => { ... }
export const getUserService = async (id: number) => { ... }

// Rotas: camelCase
router.get("/users", getAllUsersController);
router.post("/users", createUserController);
```

### **2. Estrutura de Arquivos**

#### **Componentes React**

```typescript
// components/UserProfile/UserProfile.tsx
import { useState, useEffect } from "react";
import { UserProfileProps } from "./types";
import { useUserData } from "../../hooks/useUserData";
import "./UserProfile.css";

export const UserProfile = ({ userId, onUpdate }: UserProfileProps) => {
  const { user, loading, error, updateUser } = useUserData(userId);

  // Lógica do componente

  return <div className="user-profile">{/* JSX */}</div>;
};

// components/UserProfile/types.ts
export interface UserProfileProps {
  userId: number;
  onUpdate?: (user: User) => void;
}

// components/UserProfile/index.ts
export { UserProfile } from "./UserProfile";
```

#### **Services Backend**

```typescript
// services/user.service.ts
import { db } from "../config/database";
import { UserData, UserResponse } from "../@types/types.service";

export const createUserDb = async (userData: UserData): Promise<number> => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Lógica de criação

    await connection.commit();
    return userId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const getUserByIdDb = async (
  id: number
): Promise<UserResponse | null> => {
  // Implementação
};
```

### **3. Padrão de APIs**

#### **Estrutura de Resposta**

```typescript
// Padrão de resposta da API
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

// Exemplo de uso
export const createUserController = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const userId = await createUserDb(userData);

    res.status(201).json({
      success: true,
      message: "Usuário criado com sucesso",
      data: { userId },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error: error instanceof Error ? error.message : "Erro desconhecido",
      timestamp: new Date().toISOString(),
    });
  }
};
```

#### **Tratamento de Erros**

```typescript
// Middleware de erro global
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Erro não tratado:", error);

  res.status(500).json({
    success: false,
    message: "Erro interno do servidor",
    error:
      process.env.NODE_ENV === "development" ? error.message : "Erro interno",
    timestamp: new Date().toISOString(),
  });
};

// Uso no app.ts
app.use(errorHandler);
```

## 🔄 Fluxo de Desenvolvimento

### **1. Criando uma Nova Funcionalidade**

#### **Passo a Passo**

```bash
# 1. Criar branch para a funcionalidade
git checkout -b feature/nova-funcionalidade

# 2. Desenvolver no backend
cd protrack-server
# - Criar service
# - Criar controller
# - Criar rota
# - Testar API

# 3. Desenvolver no frontend
cd ../proTrack-client
# - Criar componente
# - Criar hook se necessário
# - Integrar com API
# - Testar interface

# 4. Commit e push
git add .
git commit -m "feat: implementa nova funcionalidade"
git push origin feature/nova-funcionalidade
```

#### **Exemplo: Criando um CRUD de Categorias**

**Backend:**

```typescript
// 1. Service
// services/categoria.service.ts
export const createCategoriaDb = async (
  categoriaData: CategoriaData
): Promise<number> => {
  // Implementação
};

// 2. Controller
// controllers/categoria.controller.ts
export const createCategoriaController = async (
  req: Request,
  res: Response
) => {
  // Implementação
};

// 3. Rota
// routes/categoriaRoutes.ts
router.post("/categorias", createCategoriaController);
```

**Frontend:**

```typescript
// 1. Hook
// hooks/useCategorias.ts
export const useCategorias = () => {
  // Implementação
};

// 2. Componente
// components/CategoriaForm/CategoriaForm.tsx
export const CategoriaForm = () => {
  // Implementação
};
```

### **2. Testando Funcionalidades**

#### **Teste de API**

```bash
# Usando curl
curl -X POST http://localhost:8085/categorias \
  -H "Content-Type: application/json" \
  -d '{"nome": "Eletrônicos", "tipo": "produto"}'

# Usando Postman/Insomnia
# Endpoint: POST http://localhost:8085/categorias
# Body: {"nome": "Eletrônicos", "tipo": "produto"}
```

#### **Teste de Frontend**

```bash
# Desenvolver com hot reload
cd proTrack-client
npm run dev

# Acessar: http://localhost:5173
# Navegar para a funcionalidade
# Testar formulários e integrações
```

### **3. Debug e Logs**

#### **Backend Logs**

```typescript
// Logging estruturado
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
};

// Uso
logger.info("Usuário criado", { userId: 123 });
logger.error("Erro ao criar usuário", error);
```

#### **Frontend Debug**

```typescript
// Console logs para debug
console.log("Dados do usuário:", userData);
console.log("Estado do formulário:", formState);

// React DevTools para inspecionar estado
// Browser DevTools para network e console
```

## 🗄️ Trabalhando com Banco de Dados

### **1. Queries SQL**

#### **Padrão de Queries**

```sql
-- Queries com JOIN para dados relacionados
SELECT
  v.id,
  v.data_venda,
  v.total_com_desconto,
  c.nome as cliente_nome,
  c.cpf as cliente_cpf
FROM vendas v
JOIN clientes c ON v.cliente_id = c.id
WHERE v.status = 'pendente'
ORDER BY v.data_venda DESC;

-- Queries com agregação
SELECT
  categoria,
  COUNT(*) as total_produtos,
  AVG(preco_venda) as preco_medio
FROM produtos
GROUP BY categoria
HAVING total_produtos > 5;
```

#### **Transações**

```typescript
// Sempre usar transações para operações complexas
export const processarVenda = async (vendaData: VendaData) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Inserir venda
    const vendaId = await inserirVenda(connection, vendaData);

    // 2. Inserir itens
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

### **2. Migrações e Schema**

#### **Alterando o Schema**

```sql
-- Adicionar nova coluna
ALTER TABLE produtos ADD COLUMN codigo_barras VARCHAR(50) UNIQUE;

-- Criar índice para performance
CREATE INDEX idx_produtos_codigo ON produtos(codigo_barras);

-- Adicionar constraint
ALTER TABLE vendas ADD CONSTRAINT chk_status
  CHECK (status IN ('pendente', 'pago', 'cancelado', 'aprazo', 'vencido'));
```

## 🎨 Desenvolvimento Frontend

### **1. Componentes Reutilizáveis**

#### **Padrão de Componente**

```typescript
// components/ui/Button/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../../utils/cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      loading,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-primary-foreground hover:bg-primary/90":
              variant === "default",
            "border border-input bg-background hover:bg-accent":
              variant === "outline",
            "bg-destructive text-destructive-foreground hover:bg-destructive/90":
              variant === "destructive",
          },
          {
            "h-9 px-3 text-sm": size === "sm",
            "h-10 px-4 py-2": size === "md",
            "h-11 px-8": size === "lg",
          },
          className
        )}
        ref={ref}
        disabled={loading}
        {...props}
      >
        {loading && <Spinner className="mr-2 h-4 w-4" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
```

### **2. Hooks Personalizados**

#### **Padrão de Hook**

```typescript
// hooks/useApi.ts
import { useState, useCallback } from "react";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export const useApi = <T>(
  apiFunction: (...args: any[]) => Promise<T>
): UseApiReturn<T> => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const result = await apiFunction(...args);
        setState({ data: result, loading: false, error: null });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : "Erro desconhecido",
        });
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
};
```

### **3. Formulários com React Hook Form**

#### **Padrão de Formulário**

```typescript
// components/forms/UserForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, UserFormData } from "./schema";

export const UserForm = ({ onSubmit, defaultValues }: UserFormProps) => {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: defaultValues || {
      nome: "",
      email: "",
      telefone: "",
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium">
          Nome
        </label>
        <input
          {...form.register("nome")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {form.formState.errors.nome && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.nome.message}
          </p>
        )}
      </div>

      {/* Outros campos */}

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
};
```

## 🔧 Configuração e Deploy

### **1. Ambiente de Desenvolvimento**

#### **Configuração Local**

```bash
# Backend
cd protrack-server
npm run dev

# Frontend (em outro terminal)
cd proTrack-client
npm run dev

# Banco de dados
mysql -u root -p protrack
```

#### **Variáveis de Ambiente por Ambiente**

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
DB_HOST=production-host
DB_USER=prod_user
DB_PASSWORD=secure_password
DB_NAME=protrack_prod
```

### **2. Build e Deploy**

#### **Scripts de Build**

```json
{
  "scripts": {
    "build:dev": "tsc && npm run copy-assets",
    "build:prod": "NODE_ENV=production tsc && npm run copy-assets",
    "copy-assets": "cp -r src/config dist/ && cp -r src/scripts dist/",
    "deploy:dev": "npm run build:dev && npm run start:dev",
    "deploy:prod": "npm run build:prod && npm start"
  }
}
```

#### **Processo de Deploy**

```bash
# 1. Build de produção
npm run build:prod

# 2. Verificar arquivos gerados
ls -la dist/

# 3. Iniciar aplicação
npm start

# 4. Verificar logs
tail -f logs/app.log
```

## 🧪 Testes e Qualidade

### **1. Linting e Formatação**

#### **ESLint Configuração**

```json
// .eslintrc.json
{
  "extends": ["@eslint/js", "plugin:react-hooks/recommended"],
  "rules": {
    "no-unused-vars": "warn",
    "prefer-const": "error",
    "no-console": "warn"
  }
}
```

#### **Prettier (via Tailwind CSS)**

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2
}
```

### **2. Verificação de Tipos**

#### **TypeScript Strict Mode**

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

## 📚 Recursos e Referências

### **1. Documentação Oficial**

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

### **2. Bibliotecas Utilizadas**

- **Frontend**: React, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Node.js, Express, MySQL2, bcrypt
- **Formulários**: React Hook Form, Zod
- **HTTP Client**: Axios
- **Build Tools**: Vite, TypeScript Compiler

### **3. Padrões e Boas Práticas**

- **Clean Code**: Robert C. Martin
- **React Patterns**: Padrões de componentes React
- **REST API Design**: Princípios de design de APIs
- **Database Design**: Normalização e relacionamentos

## 🆘 Solução de Problemas

### **1. Problemas Comuns**

#### **Erro de CORS**

```typescript
// Verificar configuração CORS no backend
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend Vite
    credentials: true,
  })
);
```

#### **Erro de Conexão com Banco**

```bash
# Verificar se MySQL está rodando
sudo systemctl status mysql

# Verificar credenciais
mysql -u root -p

# Verificar se o banco existe
SHOW DATABASES;
```

#### **Erro de Build TypeScript**

```bash
# Limpar cache
rm -rf node_modules
npm install

# Verificar tipos
npx tsc --noEmit
```

### **2. Debug e Troubleshooting**

#### **Logs do Backend**

```bash
# Ver logs em tempo real
tail -f logs/app.log

# Ver logs de monitoramento
tail -f logs/monitoramento.log
```

#### **Debug do Frontend**

```typescript
// Adicionar logs para debug
console.log("Estado atual:", state);
console.log("Props recebidas:", props);

// Usar React DevTools
// Usar Browser DevTools
```

## 🎉 Conclusão

Este guia fornece as bases para desenvolvimento eficiente no **ProTrack 2.0**. Lembre-se de:

- ✅ **Seguir os padrões** estabelecidos
- ✅ **Manter a consistência** no código
- ✅ **Testar funcionalidades** antes do commit
- ✅ **Documentar mudanças** importantes
- ✅ **Usar branches** para novas funcionalidades
- ✅ **Revisar código** antes do merge

Para dúvidas específicas, consulte a documentação técnica ou entre em contato com a equipe de desenvolvimento.

**Bom desenvolvimento! 🚀**
