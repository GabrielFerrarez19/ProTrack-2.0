# 🚀 Instalação Rápida - Monitoramento a Cada 5 Minutos

## ⚡ Configuração Automática (Recomendado)

### 1. Executar Script de Configuração

```bash
cd protrack-server
./scripts/configurar-cron.sh
```

O script irá:

- ✅ Configurar cron job a cada 5 minutos
- ✅ Criar pasta de logs
- ✅ Configurar rotação de logs
- ✅ Verificar se tudo está funcionando

## 🔧 Configuração Manual

### 1. Criar Pasta de Logs

```bash
mkdir -p logs
```

### 2. Configurar Cron Job

```bash
crontab -e
```

### 3. Adicionar Linha

```bash
*/5 * * * * cd /caminho/para/protrack-server && node src/scripts/monitoramentoVendas.js >> logs/monitoramento.log 2>&1
```

## 🧪 Testar Instalação

### 1. Execução Manual

```bash
node src/scripts/monitoramentoVendas.js
```

### 2. Verificar Cron Jobs

```bash
crontab -l
```

### 3. Monitorar Logs

```bash
tail -f logs/monitoramento.log
```

## 📊 O que Acontece a Cada 5 Minutos

1. **Identifica** vendas vencidas
2. **Atualiza** status para "vencido"
3. **Registra** operações nos logs
4. **Fornece** estatísticas em tempo real

## 🎯 Endpoints da API

- **`POST /monitoramento/executar`** - Executar manualmente
- **`GET /monitoramento/estatisticas`** - Ver estatísticas
- **`GET /monitoramento/status`** - Status do sistema
- **`DELETE /monitoramento/limpar`** - Limpar vendas antigas

## ⚠️ Considerações Importantes

- **Logs frequentes**: Configure rotação de logs
- **Recursos**: Monitore uso de CPU/memória
- **Banco**: Considere índices para performance
- **Backup**: Mantenha backup dos logs importantes

## 🆘 Suporte

- **Logs**: `logs/monitoramento.log`
- **Cron**: `crontab -l`
- **Status**: `systemctl status cron`
- **Debug**: Execute manualmente o script

---

**🎉 Pronto! Seu sistema monitora vendas vencidas a cada 5 minutos!**
