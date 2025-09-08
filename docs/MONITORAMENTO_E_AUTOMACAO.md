# Monitoramento e Automação - ProTrack 2.0

## Visão Geral

O ProTrack 2.0 inclui um sistema completo de monitoramento e automação que garante o funcionamento eficiente do sistema, com atualizações automáticas de status, alertas preventivos e manutenção automatizada.

## Sistema de Monitoramento de Vendas

### Objetivos

- **Atualização Automática de Status**: Identifica e atualiza vendas com status desatualizado
- **Prevenção de Atrasos**: Evita que vendas fiquem pendentes por muito tempo
- **Relatórios Automáticos**: Gera relatórios de vendas automaticamente
- **Alertas de Performance**: Notifica sobre vendas que precisam de atenção

### Funcionalidades

#### 1. Identificação Automática de Vendas Atrasadas

```javascript
// Script de monitoramento de vendas
const monitorarVendas = async () => {
  try {
    // Buscar vendas pendentes há mais de 24 horas
    const vendasAtrasadas = await prisma.venda.findMany({
      where: {
        status: "pendente",
        createdAt: {
          lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
      include: {
        cliente: true,
        produtos: true,
      },
    });

    // Atualizar status para 'atrasada'
    for (const venda of vendasAtrasadas) {
      await prisma.venda.update({
        where: { id: venda.id },
        data: { status: "atrasada" },
      });
    }

    console.log(`${vendasAtrasadas.length} vendas marcadas como atrasadas`);
  } catch (error) {
    console.error("Erro no monitoramento de vendas:", error);
  }
};
```

#### 2. Atualização de Status de Vendas

- **Pendente → Confirmada**: Após 2 horas sem ação
- **Confirmada → Enviada**: Após 24 horas
- **Enviada → Entregue**: Após 3 dias
- **Atrasada → Cancelada**: Após 7 dias

#### 3. Relatórios Automáticos

```javascript
// Geração de relatório diário
const gerarRelatorioDiario = async () => {
  const hoje = new Date();
  const ontem = new Date(hoje.getTime() - 24 * 60 * 60 * 1000);

  const vendas = await prisma.venda.findMany({
    where: {
      createdAt: {
        gte: ontem,
        lt: hoje,
      },
    },
    include: {
      cliente: true,
      produtos: true,
    },
  });

  const relatorio = {
    data: hoje.toISOString().split("T")[0],
    totalVendas: vendas.length,
    valorTotal: vendas.reduce((sum, venda) => sum + venda.total, 0),
    vendasPorStatus: groupBy(vendas, "status"),
    topClientes: getTopClientes(vendas),
    topProdutos: getTopProdutos(vendas),
  };

  // Salvar relatório
  await prisma.relatorio.create({
    data: {
      tipo: "vendas_diario",
      dados: JSON.stringify(relatorio),
      dataGeracao: hoje,
    },
  });

  return relatorio;
};
```

### Configuração do Cron Job

```bash
# Executa a cada 5 minutos
*/5 * * * * cd /caminho/para/ProTrack-2.0/backend/scripts && node monitoramentoVendas.js
```

## Sistema de Monitoramento de Contas a Pagar

### Objetivos

- **Identificação de Contas Vencidas**: Detecta automaticamente contas vencidas
- **Alertas Preventivos**: Notifica sobre vencimentos próximos
- **Atualização de Status**: Atualiza status de contas automaticamente
- **Relatórios Financeiros**: Gera relatórios de situação financeira

### Funcionalidades

#### 1. Identificação de Contas Vencidas

```javascript
// Script de monitoramento de contas a pagar
const monitorarContasPagar = async () => {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // Buscar contas vencidas
    const contasVencidas = await prisma.contasPagar.findMany({
      where: {
        status: "pendente",
        dataVencimento: {
          lt: hoje,
        },
      },
      include: {
        fornecedor: true,
      },
    });

    // Atualizar status para 'vencida'
    for (const conta of contasVencidas) {
      await prisma.contasPagar.update({
        where: { id: conta.id },
        data: { status: "vencida" },
      });
    }

    console.log(`${contasVencidas.length} contas marcadas como vencidas`);
  } catch (error) {
    console.error("Erro no monitoramento de contas a pagar:", error);
  }
};
```

#### 2. Alertas de Vencimento

```javascript
// Sistema de alertas preventivos
const gerarAlertasVencimento = async () => {
  const hoje = new Date();
  const proximos7Dias = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Buscar contas que vencem nos próximos 7 dias
  const proximasContas = await prisma.contasPagar.findMany({
    where: {
      status: "pendente",
      dataVencimento: {
        gte: hoje,
        lte: proximos7Dias,
      },
    },
    include: {
      fornecedor: true,
    },
  });

  // Gerar alertas
  for (const conta of proximasContas) {
    const diasParaVencimento = Math.ceil(
      (conta.dataVencimento - hoje) / (1000 * 60 * 60 * 24)
    );

    await prisma.alerta.create({
      data: {
        tipo: "vencimento_proximo",
        titulo: `Conta vence em ${diasParaVencimento} dias`,
        descricao: `Conta de ${conta.fornecedor.name} vence em ${diasParaVencimento} dias`,
        dataVencimento: conta.dataVencimento,
        prioridade: diasParaVencimento <= 2 ? "alta" : "media",
      },
    });
  }
};
```

#### 3. Relatórios Financeiros Automáticos

```javascript
// Relatório semanal de contas a pagar
const gerarRelatorioSemanal = async () => {
  const hoje = new Date();
  const semanaAnterior = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);

  const contas = await prisma.contasPagar.findMany({
    where: {
      createdAt: {
        gte: semanaAnterior,
        lt: hoje,
      },
    },
    include: {
      fornecedor: true,
    },
  });

  const relatorio = {
    periodo: `${semanaAnterior.toISOString().split("T")[0]} a ${
      hoje.toISOString().split("T")[0]
    }`,
    totalContas: contas.length,
    valorTotal: contas.reduce((sum, conta) => sum + conta.valor, 0),
    contasPorStatus: groupBy(contas, "status"),
    contasPorFornecedor: groupBy(contas, "fornecedor.name"),
    contasVencidas: contas.filter((c) => c.status === "vencida").length,
    valorVencido: contas
      .filter((c) => c.status === "vencida")
      .reduce((sum, conta) => sum + conta.valor, 0),
  };

  // Salvar relatório
  await prisma.relatorio.create({
    data: {
      tipo: "contas_pagar_semanal",
      dados: JSON.stringify(relatorio),
      dataGeracao: hoje,
    },
  });

  return relatorio;
};
```

### Configuração do Cron Job

```bash
# Executa diariamente às 8h
0 8 * * * cd /caminho/para/ProTrack-2.0/backend/scripts && node monitoramentoContasPagar.js
```

## Sistema de Backup Automático

### Objetivos

- **Proteção de Dados**: Backup automático de todos os dados
- **Recuperação Rápida**: Restauração rápida em caso de problemas
- **Versionamento**: Manutenção de múltiplas versões de backup
- **Verificação de Integridade**: Validação dos backups

### Funcuração

#### 1. Backup Diário do Banco de Dados

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

#### 2. Backup de Arquivos

```bash
#!/bin/bash
# Backup de arquivos do sistema

# Configurações
SOURCE_DIR="/var/www/protrack"
BACKUP_DIR="/backups/protrack/files"
DATE=$(date +%Y%m%d_%H%M%S)

# Criar diretório de backup
mkdir -p $BACKUP_DIR

# Fazer backup
tar -czf $BACKUP_DIR/files_$DATE.tar.gz -C $SOURCE_DIR .

# Remover backups antigos
find $BACKUP_DIR -name "files_*.tar.gz" -mtime +30 -delete

echo "Backup de arquivos concluído: files_$DATE.tar.gz"
```

### Configuração do Cron Job

```bash
# Backup diário às 2h da manhã
0 2 * * * /caminho/para/ProTrack-2.0/scripts/backup-database.sh
0 3 * * * /caminho/para/ProTrack-2.0/scripts/backup-files.sh
```

## Sistema de Logs e Monitoramento

### Objetivos

- **Rastreamento de Atividades**: Registro de todas as ações do sistema
- **Detecção de Problemas**: Identificação automática de erros
- **Análise de Performance**: Monitoramento de performance do sistema
- **Auditoria**: Registro de atividades para auditoria

### Funcionalidades

#### 1. Sistema de Logs Estruturados

```javascript
// Configuração de logs
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

// Middleware de logging
const loggingMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.info("Request completed", {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get("User-Agent"),
      ip: req.ip,
    });
  });

  next();
};
```

#### 2. Monitoramento de Performance

```javascript
// Middleware de métricas
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    // Registrar métricas
    metrics.record("http_request_duration", duration, {
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode,
    });

    // Alertar se resposta muito lenta
    if (duration > 5000) {
      logger.warn("Slow request detected", {
        method: req.method,
        url: req.url,
        duration: `${duration}ms`,
      });
    }
  });

  next();
};
```

#### 3. Sistema de Alertas

```javascript
// Sistema de alertas automáticos
const alertas = {
  async verificarSistema() {
    try {
      // Verificar uso de memória
      const memUsage = process.memoryUsage();
      if (memUsage.heapUsed > 500 * 1024 * 1024) {
        // 500MB
        await this.enviarAlerta("high_memory_usage", {
          heapUsed: memUsage.heapUsed,
          heapTotal: memUsage.heapTotal,
        });
      }

      // Verificar uso de CPU
      const cpuUsage = process.cpuUsage();
      if (cpuUsage.user > 1000000) {
        // 1 segundo
        await this.enviarAlerta("high_cpu_usage", {
          cpuUsage: cpuUsage,
        });
      }

      // Verificar conexão com banco
      await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      await this.enviarAlerta("system_error", {
        error: error.message,
        stack: error.stack,
      });
    }
  },

  async enviarAlerta(tipo, dados) {
    await prisma.alerta.create({
      data: {
        tipo: tipo,
        titulo: `Alerta: ${tipo}`,
        descricao: JSON.stringify(dados),
        prioridade: "alta",
        dataCriacao: new Date(),
      },
    });

    logger.error("System alert", { tipo, dados });
  },
};
```

## Configuração e Instalação

### Instalação Rápida

#### 1. Clone do Repositório

```bash
git clone https://github.com/seu-usuario/ProTrack-2.0.git
cd ProTrack-2.0
```

#### 2. Configuração do Backend

```bash
cd backend
npm install
cp .env.example .env
```

#### 3. Configuração do Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

#### 4. Configuração do Banco de Dados

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

#### 5. Configuração das Variáveis de Ambiente

##### Backend (.env)

```env
DATABASE_URL="mysql://user:password@localhost:3306/protrack"
JWT_SECRET="your-secret-key"
PORT=3001
NODE_ENV=development
```

##### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001
```

#### 6. Execução do Sistema

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Configuração do Sistema de Monitoramento

#### 1. Script de Monitoramento de Vendas

```bash
cd backend/scripts
npm install
node setup-monitoring.js
```

#### 2. Configuração do Cron Job

```bash
# O script automaticamente configura o cron job
# Para verificar se foi configurado:
crontab -l
```

#### 3. Configuração Manual

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

## Backup e Restauração

### Backup do Banco de Dados

```bash
mysqldump -u root -p protrack > backup_protrack_$(date +%Y%m%d).sql
```

### Restauração do Banco de Dados

```bash
mysql -u root -p protrack < backup_protrack_20240101.sql
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

## Suporte

### Documentação Adicional

- [Guia do Desenvolvedor](./GUIA_DESENVOLVEDOR_PROTRACK.md)
- [Manual do Usuário](./USER_MANUAL.md)
- [Documentação da API](./API_GUIDE.md)

### Contato

- **Email**: suporte@protrack.com
- **Telefone**: (11) 99999-9999
- **Horário**: Segunda a Sexta, 8h às 18h

## Conclusão

O sistema de monitoramento e automação do ProTrack 2.0 garante o funcionamento eficiente e confiável do sistema, com atualizações automáticas, alertas preventivos e manutenção automatizada.

Com este guia, você deve conseguir instalar e configurar o sistema de monitoramento rapidamente. Para configurações mais avançadas ou personalizações, consulte a documentação completa do sistema.

Lembre-se de sempre fazer backup dos dados antes de realizar atualizações ou modificações no sistema.
