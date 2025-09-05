# Sistema de Monitoramento de Contas a Pagar Vencidas

## 📋 Visão Geral

Este sistema monitora automaticamente as contas a pagar do ProTrack 2.0, identificando e marcando como "vencidas" todas as contas que ultrapassaram sua data de vencimento. Funciona de forma similar ao sistema de monitoramento de vendas vencidas.

## 🚀 Instalação e Configuração

### 1. Dependências

Certifique-se de que o servidor está rodando e o banco de dados está configurado corretamente.

### 2. Estrutura de Arquivos

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

### 3. Configuração Automática

#### Script de Monitoramento

```bash
# Executar manualmente
node scripts/monitoramentoContasPagar.js

# Configurar cron job (Linux/Mac)
chmod +x scripts/configurar-cron-contas.sh
./scripts/configurar-cron-contas.sh

# Verificar cron jobs ativos
crontab -l
```

#### Cron Job Configurado

```bash
*/30 * * * * cd /caminho/para/protrack-server && node scripts/monitoramentoContasPagar.js >> logs/monitoramento_contas.log 2>&1
```

## 🔌 API Endpoints

### Base URL

```
http://localhost:8085/monitoramento-contas
```

### Endpoints Disponíveis

#### POST /executar

Executa o monitoramento manualmente.

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

#### GET /estatisticas

Retorna estatísticas das contas vencidas.

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

#### GET /status

Verifica o status geral do sistema.

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

#### DELETE /limpar?dias=365

Arquivar contas vencidas antigas.

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

## 🧪 Testes

### Testar Endpoints

```bash
# Verificar status
curl -X GET http://localhost:8085/monitoramento-contas/status

# Executar monitoramento
curl -X POST http://localhost:8085/monitoramento-contas/executar

# Ver estatísticas
curl -X GET http://localhost:8085/monitoramento-contas/estatisticas

# Limpar contas antigas
curl -X DELETE "http://localhost:8085/monitoramento-contas/limpar?dias=365"
```

### Testar Script

```bash
# Executar script diretamente
node scripts/monitoramentoContasPagar.js

# Ver logs em tempo real
tail -f logs/monitoramento_contas.log
```

## 📊 Monitoramento e Logs

### Logs Automáticos

- **Localização:** `logs/monitoramento_contas.log`
- **Formato:** Timestamp + mensagem estruturada
- **Exemplo:**

```
[2024-01-15T10:30:00.000Z] Executando monitoramento de contas a pagar...
[2024-01-15T10:30:01.234Z] 5 contas vencidas identificadas
[2024-01-15T10:30:01.456Z] Conta #123 do fornecedor ABC Ltda marcada como vencida
[2024-01-15T10:30:01.789Z] 5 contas marcadas como vencidas
[2024-01-15T10:30:01.890Z] Monitoramento executado com sucesso
```

### Verificar Logs

```bash
# Ver logs em tempo real
tail -f logs/monitoramento_contas.log

# Ver últimas 100 linhas
tail -n 100 logs/monitoramento_contas.log

# Buscar por erros
grep "ERROR\|Erro" logs/monitoramento_contas.log
```

## 🔧 Manutenção

### Limpeza Regular

- **Diária:** Monitoramento automático a cada 30 minutos
- **Semanal:** Verificação de logs e performance
- **Mensal:** Arquivamento de contas antigas
- **Trimestral:** Análise de performance e otimização

### Backup

- Logs são mantidos automaticamente
- Configurações do cron são persistentes
- Recomendado backup dos logs mensalmente

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. Cron Job Não Executa

```bash
# Verificar se o cron está rodando
sudo systemctl status cron

# Verificar cron jobs ativos
crontab -l

# Verificar logs do cron
tail -f /var/log/cron

# Testar execução manual
node scripts/monitoramentoContasPagar.js
```

#### 2. Erro de Conexão com Banco

```bash
# Verificar se o servidor está rodando
curl http://localhost:8085/monitoramento-contas/status

# Verificar logs do servidor
tail -f logs/server.log

# Verificar configuração do banco
cat src/config/database.ts
```

#### 3. Contas Não São Marcadas como Vencidas

```bash
# Verificar dados no banco
mysql -u usuario -p protrack
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

# Verificar cron jobs
crontab -l

# Remover todos os cron jobs (cuidado!)
crontab -r
```

## 📈 Performance e Otimização

### Queries Otimizadas

O sistema usa queries otimizadas para identificar contas vencidas:

```sql
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

## 🔒 Segurança

### Transações de Banco

- Todas as atualizações são executadas em transações
- Rollback automático em caso de erro
- Conexões são liberadas adequadamente

### Validações

- Verificação de parâmetros de entrada
- Validação de tipos de dados
- Tratamento de erros SQL

## 📚 Documentação Relacionada

- [Documentação Completa do ProTrack 2.0](../docs/DOCUMENTACAO_COMPLETA_PROTRACK.md)
- [Arquitetura Técnica](../docs/ARQUITETURA_TECNICA_PROTRACK.md)
- [Monitoramento de Vendas](../docs/MONITORAMENTO_VENDAS.md)
- [API de Contas a Pagar](../docs/API_CONTAS_PAGAR.md)

## 🤝 Suporte

Para suporte técnico ou dúvidas sobre implementação:

1. Verifique os logs do sistema
2. Consulte a documentação principal
3. Entre em contato com a equipe de desenvolvimento

---

**Versão:** 1.0.0  
**Última Atualização:** Janeiro 2024  
**Sistema:** ProTrack 2.0
