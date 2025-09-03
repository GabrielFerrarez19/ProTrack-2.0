# Sistema de Monitoramento de Contas a Pagar Vencidas

## Visão Geral

O Sistema de Monitoramento de Contas a Pagar Vencidas é um componente automático do ProTrack 2.0 que identifica e marca contas a pagar que ultrapassaram sua data de vencimento. Este sistema funciona de forma similar ao sistema de monitoramento de vendas vencidas, garantindo consistência na gestão financeira da empresa.

## Funcionalidades

### 🔍 Identificação Automática

- Verifica diariamente todas as contas a pagar
- Identifica contas com data de vencimento ultrapassada
- Filtra apenas contas com status ativo (não pagas, canceladas ou já vencidas)

### 🏷️ Marcação Automática

- Atualiza automaticamente o status para "vencido"
- Mantém histórico de alterações
- Executa em transações seguras (rollback em caso de erro)

### 📊 Estatísticas e Relatórios

- Conta total de contas vencidas
- Calcula valor total vencido
- Fornece timestamp da última verificação

### 🧹 Manutenção Automática

- Opção para arquivar contas vencidas antigas
- Configurável por período (padrão: 365 dias)
- Limpeza automática para otimizar performance

### 🎨 Interface de Monitoramento

#### **StatusMonitoramento Component**

```typescript
export function StatusMonitoramento({
  ultimaVerificacao,
  totalContasVencidas,
  statusSistema,
}: StatusMonitoramentoProps) {
  // Indicador visual do status do sistema
  // Timestamp da última verificação
  // Contador de contas vencidas em tempo real
  // Badge de status (ativo, inativo, erro)
}
```

#### **Integração com SummaryCards**

```typescript
// Cards de resumo com dados de monitoramento
<SummaryCards
  totalVencidasMonitoramento={totalVencidasMonitoramento}
  // ... outros props
/>
```

## Arquitetura

### Estrutura de Arquivos

```
protrack-server/
├── src/
│   ├── controllers/
│   │   └── contasPagarMonitoramento.controller.ts
│   ├── services/
│   │   └── contasPagarMonitoramento.service.ts
│   └── routes/
│       └── contasPagarMonitoramentoRoutes.ts
├── scripts/
│   ├── monitoramentoContasPagar.js
│   └── configurar-cron-contas.sh
└── logs/
    └── monitoramento_contas.log
```

### Frontend - Componentes de Monitoramento

```
proTrack-client/src/
├── pages/ContasPagar/
│   ├── components/
│   │   ├── StatusMonitoramento.tsx      # Status do sistema
│   │   ├── SummaryCards.tsx             # Cards com dados de monitoramento
│   │   └── FiltersBar.tsx               # Filtros para monitoramento
│   └── index.tsx                        # Página principal
├── hooks/
│   └── useContasPagarMonitoramento.ts   # Hook de monitoramento
└── @types/
    └── types.contasPagar.ts             # Tipos TypeScript
```

### Tipos TypeScript Implementados

```typescript
// Status do sistema de monitoramento
interface StatusMonitoramentoProps {
  ultimaVerificacao: Date | null;
  totalContasVencidas: number;
  statusSistema: "ativo" | "inativo" | "erro";
}

// Dados de contas vencidas para monitoramento
interface ContaPagarVencida {
  id: string;
  fornecedor_nome: string;
  valor: number;
  data_vencimento: string;
  dias_atraso: number;
  categoria_nome?: string;
  descricao: string;
}

// Resposta do sistema de monitoramento
interface MonitoramentoResponse {
  success: boolean;
  message: string;
  resultado: {
    contasIdentificadas: number;
    contasProcessadas: number;
    totalVencido: number;
    ultimaVerificacao: string;
    statusSistema: string;
  };
}
```

### Componentes

#### 1. Controller (`contasPagarMonitoramento.controller.ts`)

- Gerencia requisições HTTP
- Valida parâmetros de entrada
- Retorna respostas padronizadas
- Trata erros de forma consistente

#### 2. Service (`contasPagarMonitoramento.service.ts`)

- Lógica de negócio principal
- Queries SQL para identificação de contas vencidas
- Atualização de status em transações
- Cálculo de estatísticas

#### 3. Rotas (`contasPagarMonitoramentoRoutes.ts`)

- Define endpoints da API
- Mapeia URLs para funções do controller
- Padrão RESTful

#### 4. Componentes de Interface (Frontend)

##### **StatusMonitoramento**

- Indicador visual do status do sistema
- Exibe timestamp da última verificação
- Contador de contas vencidas em tempo real
- Badge de status com cores diferenciadas

##### **SummaryCards com Dados de Monitoramento**

- Cards responsivos com informações financeiras
- Integração com dados de monitoramento automático
- Indicadores visuais de alerta para contas vencidas
- Formatação automática de moeda brasileira

##### **FiltersBar para Monitoramento**

- Filtros específicos para contas vencidas
- Busca em tempo real com debounce
- Filtros por status e categoria
- Indicador visual de filtros ativos

## API Endpoints

### Base URL

```
http://localhost:8085/monitoramento-contas
```

### Endpoints Disponíveis

#### 1. Executar Monitoramento

```http
POST /executar
```

**Descrição:** Executa o monitoramento manualmente
**Resposta:**

```json
{
  "success": true,
  "message": "Monitoramento de contas a pagar executado com sucesso",
  "resultado": {
    "contasIdentificadas": 5,
    "contasProcessadas": 5,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 2. Obter Estatísticas

```http
GET /estatisticas
```

**Descrição:** Retorna estatísticas das contas vencidas
**Resposta:**

```json
{
  "success": true,
  "estatisticas": {
    "totalVencidas": 12,
    "valorTotalVencido": 15420.5,
    "ultimaVerificacao": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 3. Verificar Status do Sistema

```http
GET /status
```

**Descrição:** Verifica o status geral do sistema de monitoramento
**Resposta:**

```json
{
  "success": true,
  "status": "ativo",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "estatisticas": { ... },
  "sistema": {
    "nome": "Monitoramento de Contas a Pagar Vencidas",
    "versao": "1.0.0",
    "descricao": "Sistema automático para identificar e marcar contas a pagar vencidas"
  }
}
```

#### 4. Limpar Contas Antigas

```http
DELETE /limpar?dias=365
```

**Descrição:** Arquivar contas vencidas antigas
**Parâmetros:**

- `dias` (opcional): Número de dias para considerar como "antigo" (padrão: 365)
  **Resposta:**

```json
{
  "success": true,
  "message": "15 contas vencidas foram arquivadas",
  "contasArquivadas": 15,
  "diasAntigos": 365
}
```

## Configuração Automática

### Script de Monitoramento

O arquivo `scripts/monitoramentoContasPagar.js` executa o monitoramento automaticamente:

```javascript
// Configurações
const INTERVALO_MINUTOS = 30; // Executa a cada 30 minutos

// Funcionalidades
- Execução automática a cada 30 minutos
- Verificação de status a cada hora
- Logs detalhados de todas as operações
- Tratamento gracioso de interrupções
```

### Cron Job

Para configurar execução automática via cron:

```bash
# Dar permissão de execução
chmod +x scripts/configurar-cron-contas.sh

# Executar script de configuração
./scripts/configurar-cron-contas.sh
```

**Cron Job Configurado:**

```bash
*/30 * * * * cd /caminho/para/protrack-server && node scripts/monitoramentoContasPagar.js >> logs/monitoramento_contas.log 2>&1
```

## Monitoramento e Logs

### Logs Automáticos

- **Localização:** `logs/monitoramento_contas.log`
- **Formato:** Timestamp + mensagem estruturada
- **Rotação:** Manual (recomendado configurar logrotate)

### Exemplo de Log

```
[2024-01-15T10:30:00.000Z] Executando monitoramento de contas a pagar...
[2024-01-15T10:30:01.234Z] 5 contas vencidas identificadas
[2024-01-15T10:30:01.456Z] Conta #123 do fornecedor ABC Ltda marcada como vencida
[2024-01-15T10:30:01.789Z] 5 contas marcadas como vencidas
[2024-01-15T10:30:01.890Z] Monitoramento executado com sucesso
```

## Segurança e Transações

### Transações de Banco

- Todas as atualizações são executadas em transações
- Rollback automático em caso de erro
- Conexões são liberadas adequadamente

### Validações

- Verificação de parâmetros de entrada
- Validação de tipos de dados
- Tratamento de erros SQL

## Performance e Otimização

### Queries Otimizadas

```sql
-- Identificação de contas vencidas
SELECT
  cp.id,
  cp.fornecedor_nome,
  cp.data_vencimento,
  cp.valor,
  cp.status,
  cp.descricao,
  cp.categoria_id
FROM contas_pagar cp
WHERE cp.status NOT IN ('pago', 'cancelado', 'vencido', 'arquivado')
  AND cp.data_vencimento < CURDATE()
```

### Índices Recomendados

```sql
-- Índice para data de vencimento
CREATE INDEX idx_contas_pagar_data_vencimento ON contas_pagar(data_vencimento);

-- Índice para status
CREATE INDEX idx_contas_pagar_status ON contas_pagar(status);

-- Índice composto para otimização
CREATE INDEX idx_contas_pagar_status_data ON contas_pagar(status, data_vencimento);
```

## Troubleshooting

### Problemas Comuns

#### 1. Erro de Conexão com Banco

```bash
# Verificar se o servidor está rodando
curl http://localhost:8085/monitoramento-contas/status

# Verificar logs do servidor
tail -f logs/server.log
```

#### 2. Cron Job Não Executa

```bash
# Verificar cron jobs ativos
crontab -l

# Verificar logs do cron
tail -f /var/log/cron

# Testar execução manual
node scripts/monitoramentoContasPagar.js
```

#### 3. Contas Não São Marcadas como Vencidas

```bash
# Verificar dados no banco
SELECT * FROM contas_pagar WHERE data_vencimento < CURDATE();

# Verificar status atual
SELECT status, COUNT(*) FROM contas_pagar GROUP BY status;
```

### Comandos Úteis

```bash
# Verificar status do sistema
curl -X GET http://localhost:8085/monitoramento-contas/status

# Executar monitoramento manual
curl -X POST http://localhost:8085/monitoramento-contas/executar

# Ver estatísticas
curl -X GET http://localhost:8085/monitoramento-contas/estatisticas

# Ver logs em tempo real
tail -f logs/monitoramento_contas.log
```

## Manutenção

### Limpeza Regular

- **Diária:** Monitoramento automático
- **Semanal:** Verificação de logs
- **Mensal:** Arquivamento de contas antigas
- **Trimestral:** Análise de performance

### Backup e Recuperação

- Backup automático das configurações
- Logs de todas as operações
- Possibilidade de rollback manual

## Integração com Frontend

### Hook React (useContasPagar.ts)

```typescript
// Exemplo de uso no frontend
const { contasVencidas, estatisticas, executarMonitoramento } =
  useContasPagar();

// Executar monitoramento
await executarMonitoramento();

// Obter estatísticas
const stats = await estatisticas();
```

### Componentes de Interface

- Dashboard com contadores de contas vencidas
- Lista de contas vencidas
- Gráficos de evolução temporal
- Botões para execução manual

## Conclusão

O Sistema de Monitoramento de Contas a Pagar Vencidas oferece uma solução robusta e automatizada para gestão financeira, garantindo que nenhuma conta vencida passe despercebida. Com sua arquitetura modular, logs detalhados e configuração flexível, ele se integra perfeitamente ao ecossistema ProTrack 2.0.

Para suporte técnico ou dúvidas sobre implementação, consulte a documentação principal do projeto ou entre em contato com a equipe de desenvolvimento.
