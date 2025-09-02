# Sistema de Monitoramento de Vendas Vencidas

## Visão Geral

Este sistema monitora automaticamente a tabela `vendas` para identificar vendas com prazo de vencimento expirado e altera seu status para "vencido".

## Funcionalidades

- ✅ **Monitoramento Automático**: Identifica vendas vencidas baseado em `data_venda + dias_vencimento`
- ✅ **Atualização de Status**: Muda automaticamente o status para "vencido"
- ✅ **Estatísticas**: Fornece dados sobre vendas vencidas
- ✅ **Limpeza**: Arquivamento de vendas vencidas antigas
- ✅ **Logs**: Registra todas as operações para auditoria
- ✅ **Frequência Alta**: Execução a cada 5 minutos para máxima precisão

## Endpoints da API

### 1. Executar Monitoramento Manual

```http
POST /monitoramento/executar
```

**Resposta:**

```json
{
  "success": true,
  "message": "Monitoramento executado com sucesso",
  "resultado": {
    "vendasIdentificadas": 5,
    "vendasProcessadas": 5,
    "timestamp": "2025-01-27T10:30:00.000Z"
  }
}
```

### 2. Obter Estatísticas

```http
GET /monitoramento/estatisticas
```

**Resposta:**

```json
{
  "success": true,
  "estatisticas": {
    "totalVencidas": 12,
    "valorTotalVencido": 1250.5,
    "ultimaVerificacao": "2025-01-27T10:30:00.000Z"
  }
}
```

### 3. Verificar Status do Sistema

```http
GET /monitoramento/status
```

**Resposta:**

```json
{
  "success": true,
  "status": "ativo",
  "timestamp": "2025-01-27T10:30:00.000Z",
  "estatisticas": { ... },
  "sistema": {
    "nome": "Monitoramento de Vendas Vencidas",
    "versao": "1.0.0",
    "descricao": "Sistema automático para identificar e marcar vendas vencidas"
  }
}
```

### 4. Limpar Vendas Antigas

```http
DELETE /monitoramento/limpar?dias=365
```

**Resposta:**

```json
{
  "success": true,
  "message": "15 vendas vencidas foram arquivadas",
  "vendasArquivadas": 15,
  "diasAntigos": 365
}
```

## Configuração Automática

### Via Cron Job (Recomendado)

1. **Editar crontab:**

   ```bash
   crontab -e
   ```

2. **Adicionar linha (executar a cada 5 minutos):**

   ```bash
   */5 * * * * cd /caminho/para/protrack-server && node src/scripts/monitoramentoVendas.js >> logs/monitoramento.log 2>&1
   ```

3. **Criar pasta de logs:**

   ```bash
   mkdir -p logs
   ```

### Frequências Disponíveis

- **🔄 Padrão (Recomendado)**: A cada 5 minutos (`*/5 * * * *`)
- **Baixo volume**: A cada 2 horas (`0 */2 * * *`)
- **Médio volume**: A cada hora (`0 * * * *`)
- **Alto volume**: A cada 30 minutos (`*/30 * * * *`)

### ⚠️ Considerações sobre Logs

Com monitoramento a cada 5 minutos, os logs podem crescer rapidamente. Recomenda-se:

1. **Configurar rotação de logs:**

   ```bash
   # Criar arquivo de configuração do logrotate
   sudo nano /etc/logrotate.d/protrack-monitoramento
   ```

2. **Conteúdo do logrotate:**

   ```
   /caminho/para/protrack-server/logs/monitoramento.log {
       daily
       rotate 7
       compress
       delaycompress
       missingok
       notifempty
       create 644 root root
   }
   ```

3. **Ou usar ferramentas como `logrotate` ou `rotatelogs`**

## Execução Manual

### Via Script

```bash
cd protrack-server
node src/scripts/monitoramentoVendas.js
```

### Via API

```bash
curl -X POST http://localhost:3000/monitoramento/executar
```

## Monitoramento de Logs

### Ver logs em tempo real:

```bash
tail -f logs/monitoramento.log
```

### Ver últimas 100 linhas:

```bash
tail -n 100 logs/monitoramento.log
```

### Filtrar logs por data:

```bash
# Logs de hoje
grep "$(date '+%Y-%m-%d')" logs/monitoramento.log

# Logs da última hora
grep "$(date '+%Y-%m-%d %H')" logs/monitoramento.log
```

## Lógica de Negócio

### Como Funciona

1. **Identificação**: Busca vendas com:

   - `forma_pagamento = 'aprazo'`
   - `status NOT IN ('pago', 'cancelado', 'vencido')`
   - `data_venda + dias_vencimento < CURDATE()`

2. **Processamento**: Para cada venda vencida:

   - Atualiza `status` para `'vencido'`
   - Mantém `valor_a_pagar` do cliente (já controlado pelo sistema)

3. **Logs**: Registra todas as operações para auditoria

4. **Frequência**: Execução a cada 5 minutos garante identificação rápida de vendas vencidas

### Exemplo de Venda

```sql
-- Venda criada em 2025-01-20 com prazo de 7 dias
INSERT INTO vendas (data_venda, dias_vencimento, forma_pagamento, status)
VALUES ('2025-01-20', 7, 'aprazo', 'aprazo');

-- Em 2025-01-28, o sistema identifica como vencida e atualiza:
UPDATE vendas SET status = 'vencido' WHERE id = 123;
```

## Configurações

### Variáveis de Ambiente

```bash
# Frequência de monitoramento (em minutos) - padrão: 5
MONITORAMENTO_INTERVALO=5

# Dias para arquivar vendas antigas
ARQUIVAR_APOS_DIAS=365

# Habilitar notificações
ENVIAR_NOTIFICACOES=true

# Nível de log (debug, info, warn, error)
LOG_LEVEL=info
```

### Personalização

O sistema pode ser personalizado editando:

- `src/services/vendasMonitoramento.service.ts` - Lógica de negócio
- `src/scripts/monitoramentoVendas.js` - Script de execução
- `cron-monitoramento.txt` - Configurações de cron

## Troubleshooting

### Problemas Comuns

1. **Erro de conexão com banco:**

   - Verificar configurações em `src/config/database.ts`
   - Testar conexão manualmente

2. **Permissões de arquivo:**

   - Verificar se o script tem permissão de execução
   - `chmod +x src/scripts/monitoramentoVendas.js`

3. **Cron não executa:**

   - Verificar se o cron está rodando: `systemctl status cron`
   - Verificar logs do sistema: `journalctl -u cron`

4. **Logs muito grandes:**

   - Configurar rotação de logs
   - Verificar se o cron está executando múltiplas vezes

### Debug

Para debug, execute manualmente:

```bash
cd protrack-server
DEBUG=true node src/scripts/monitoramentoVendas.js
```

### Verificar Execução do Cron

```bash
# Ver se o cron está rodando
ps aux | grep cron

# Ver logs do cron
grep CRON /var/log/syslog

# Verificar se o script está sendo executado
ps aux | grep monitoramentoVendas
```

## Suporte

Para dúvidas ou problemas:

1. Verificar logs em `logs/monitoramento.log`
2. Testar endpoints da API
3. Executar script manualmente para debug
4. Verificar configurações do cron job
5. Monitorar uso de recursos (CPU, memória, disco)

## Performance

### Impacto do Monitoramento a Cada 5 Minutos

- **Vantagens:**

  - Identificação rápida de vendas vencidas
  - Maior precisão no controle financeiro
  - Resposta imediata a mudanças de status

- **Considerações:**
  - Maior uso de recursos do banco de dados
  - Logs mais frequentes
  - Necessidade de monitoramento de performance

### Otimizações Recomendadas

1. **Índices no banco:**

   ```sql
   CREATE INDEX idx_vendas_monitoramento ON vendas (forma_pagamento, status, data_venda, dias_vencimento);
   ```

2. **Configuração de pool de conexões**
3. **Monitoramento de recursos do sistema**
4. **Configuração adequada de logs**
