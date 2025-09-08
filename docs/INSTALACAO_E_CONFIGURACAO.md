# Instalação e Configuração - ProTrack 2.0

## Visão Geral

Este guia fornece instruções completas para instalação e configuração do ProTrack 2.0, incluindo configuração do ambiente de desenvolvimento, produção e sistema de monitoramento.

## Pré-requisitos

### Software Necessário

- **Node.js**: Versão 18.0 ou superior
- **npm**: Versão 8.0 ou superior
- **MySQL**: Versão 8.0 ou superior
- **Git**: Para clonagem do repositório

### Verificação dos Pré-requisitos

```bash
# Verificar versões
node --version
npm --version
mysql --version
git --version
```

## Instalação Rápida

### 1. Clone do Repositório

```bash
git clone https://github.com/seu-usuario/ProTrack-2.0.git
cd ProTrack-2.0
```

### 2. Configuração do Backend

```bash
cd backend
npm install
cp .env.example .env
```

### 3. Configuração do Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

### 4. Configuração do Banco de Dados

```bash
# Crie o banco de dados MySQL
mysql -u root -p
CREATE DATABASE protrack;
exit

# Execute as migrações
cd backend
npx prisma migrate dev
npx prisma generate
```

### 5. Configuração das Variáveis de Ambiente

#### Backend (.env)

```env
DATABASE_URL="mysql://user:password@localhost:3306/protrack"
JWT_SECRET="your-secret-key"
PORT=3001
NODE_ENV=development
```

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001
```

### 6. Execução do Sistema

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Configuração Detalhada

### Configuração do Banco de Dados

#### 1. Criação do Banco

```sql
-- Conectar ao MySQL
mysql -u root -p

-- Criar banco de dados
CREATE DATABASE protrack CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar usuário específico (opcional)
CREATE USER 'protrack_user'@'localhost' IDENTIFIED BY 'senha_segura';
GRANT ALL PRIVILEGES ON protrack.* TO 'protrack_user'@'localhost';
FLUSH PRIVILEGES;
```

#### 2. Configuração do Prisma

```typescript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// ... resto do schema
```

#### 3. Execução das Migrações

```bash
# Desenvolvimento
npx prisma migrate dev

# Produção
npx prisma migrate deploy

# Gerar cliente Prisma
npx prisma generate
```

### Configuração do Backend

#### 1. Estrutura de Diretórios

```
backend/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── utils/
├── prisma/
├── scripts/
├── logs/
├── .env
├── package.json
└── tsconfig.json
```

#### 2. Configuração do TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### 3. Configuração do Express

```typescript
// src/app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

const app = express();

// Middleware de segurança
app.use(helmet());
app.use(compression());

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requests por IP
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use("/api", routes);

export default app;
```

### Configuração do Frontend

#### 1. Estrutura de Diretórios

```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   ├── types/
│   └── styles/
├── public/
├── .env
├── package.json
├── vite.config.ts
└── tsconfig.json
```

#### 2. Configuração do Vite

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
        },
      },
    },
  },
});
```

#### 3. Configuração do TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Configuração do Sistema de Monitoramento

### 1. Script de Monitoramento de Vendas

```bash
cd backend/scripts
npm install
node setup-monitoring.js
```

### 2. Configuração do Cron Job

```bash
# O script automaticamente configura o cron job
# Para verificar se foi configurado:
crontab -l
```

### 3. Configuração Manual

Se preferir configurar manualmente:

```bash
# Edite o Crontab
crontab -e

# Adicione as linhas
# Monitoramento de vendas (executa a cada 5 minutos)
*/5 * * * * cd /caminho/para/ProTrack-2.0/backend/scripts && node monitoramentoVendas.js

# Monitoramento de contas a pagar (executa diariamente às 8h)
0 8 * * * cd /caminho/para/ProTrack-2.0/backend/scripts && node monitoramentoContasPagar.js
```

## Verificação da Instalação

### 1. Teste do Backend

```bash
curl http://localhost:3001/api/health
```

### 2. Teste do Frontend

Acesse: http://localhost:3000

### 3. Teste do Monitoramento

```bash
# Execute manualmente para testar
cd backend/scripts
node monitoramentoVendas.js
node monitoramentoContasPagar.js
```

## Solução de Problemas

### Problemas Comuns

#### 1. Erro de Conexão com Banco

```bash
# Verifique se o MySQL está rodando
sudo systemctl status mysql

# Verifique as credenciais no .env
cat backend/.env
```

#### 2. Erro de Porta em Uso

```bash
# Verifique se a porta está em uso
lsof -i :3001
lsof -i :3000

# Mate o processo se necessário
kill -9 <PID>
```

#### 3. Erro de Permissões

```bash
# Dê permissões de execução aos scripts
chmod +x backend/scripts/*.js
```

### Logs do Sistema

```bash
# Logs do backend
tail -f backend/logs/app.log

# Logs do monitoramento
tail -f backend/scripts/logs/monitoramento.log
```

## Configuração de Produção

### 1. Variáveis de Ambiente de Produção

```env
# Backend
NODE_ENV=production
DATABASE_URL="mysql://user:password@localhost:3306/protrack"
JWT_SECRET="production-secret-key"
PORT=3001

# Frontend
VITE_API_URL=https://api.seudominio.com
```

### 2. Build de Produção

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### 3. Configuração do Servidor

```bash
# Instale PM2 para gerenciamento de processos
npm install -g pm2

# Inicie a aplicação
pm2 start backend/dist/index.js --name "protrack-backend"
pm2 start frontend/dist --name "protrack-frontend"
```

### 4. Configuração do Nginx

```nginx
# /etc/nginx/sites-available/protrack
server {
    listen 80;
    server_name seudominio.com;

    # Frontend
    location / {
        root /var/www/protrack/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. Configuração do SSL

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado SSL
sudo certbot --nginx -d seudominio.com
```

## Backup e Restauração

### Backup do Banco de Dados

```bash
mysqldump -u root -p protrack > backup_protrack_$(date +%Y%m%d).sql
```

### Restauração do Banco de Dados

```bash
mysql -u root -p protrack < backup_protrack_20240101.sql
```

### Backup Automático

```bash
#!/bin/bash
# Script de backup automático

# Configurações
DB_NAME="protrack"
DB_USER="root"
DB_PASS="password"
BACKUP_DIR="/backups/protrack"
DATE=$(date +%Y%m%d_%H%M%S)

# Criar diretório de backup se não existir
mkdir -p $BACKUP_DIR

# Fazer backup
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Comprimir backup
gzip $BACKUP_DIR/backup_$DATE.sql

# Remover backups antigos (manter apenas 30 dias)
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup concluído: backup_$DATE.sql.gz"
```

## Atualizações

### Atualização do Sistema

```bash
# Pare o sistema
pm2 stop all

# Atualize o código
git pull origin main

# Instale novas dependências
cd backend && npm install
cd ../frontend && npm install

# Execute migrações se necessário
cd backend && npx prisma migrate deploy

# Reinicie o sistema
pm2 restart all
```

### Atualização Automática

```bash
#!/bin/bash
# Script de atualização automática

# Parar aplicação
pm2 stop all

# Backup do banco
mysqldump -u root -p protrack > backup_$(date +%Y%m%d_%H%M%S).sql

# Atualizar código
git pull origin main

# Instalar dependências
cd backend && npm install
cd ../frontend && npm install

# Executar migrações
cd backend && npx prisma migrate deploy

# Reiniciar aplicação
pm2 restart all

echo "Atualização concluída"
```

## Monitoramento de Produção

### 1. Logs em Tempo Real

```bash
pm2 logs
```

### 2. Status dos Processos

```bash
pm2 status
```

### 3. Monitoramento de Recursos

```bash
pm2 monit
```

### 4. Configuração de Alertas

```bash
# Configurar alertas do PM2
pm2 install pm2-server-monit
```

## Configuração de Desenvolvimento

### 1. Hot Reload

```bash
# Backend com nodemon
npm run dev

# Frontend com Vite
npm run dev
```

### 2. Debugging

```bash
# Backend com debug
npm run debug

# Frontend com source maps
npm run dev
```

### 3. Linting e Formatação

```bash
# Instalar dependências de desenvolvimento
npm install -D eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Executar linting
npm run lint

# Executar formatação
npm run format
```

## Configuração de Testes

### 1. Configuração do Jest

```json
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
};
```

### 2. Execução de Testes

```bash
# Executar todos os testes
npm test

# Executar testes com coverage
npm run test:coverage

# Executar testes em modo watch
npm run test:watch
```

## Configuração de CI/CD

### 1. GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"

      - name: Install dependencies
        run: |
          cd backend && npm install
          cd ../frontend && npm install

      - name: Run tests
        run: |
          cd backend && npm test
          cd ../frontend && npm test

      - name: Build
        run: |
          cd backend && npm run build
          cd ../frontend && npm run build
```

### 2. Deploy Automático

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/protrack
            git pull origin main
            cd backend && npm install && npm run build
            cd ../frontend && npm install && npm run build
            pm2 restart all
```

## Conclusão

Este guia fornece instruções completas para instalação e configuração do ProTrack 2.0 em diferentes ambientes. Seguindo estas instruções, você deve conseguir configurar o sistema rapidamente e de forma eficiente.

### Próximos Passos:

1. **Configurar Ambiente de Desenvolvimento**: Siga as instruções de instalação rápida
2. **Configurar Banco de Dados**: Execute as migrações e configure as variáveis de ambiente
3. **Configurar Monitoramento**: Configure os scripts de monitoramento automático
4. **Configurar Produção**: Siga as instruções de configuração de produção
5. **Configurar Backup**: Configure o sistema de backup automático
6. **Configurar CI/CD**: Configure o pipeline de integração contínua

Para suporte adicional, consulte a documentação completa do sistema ou entre em contato com a equipe de desenvolvimento.
