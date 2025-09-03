#!/bin/bash

# Script para configurar cron job de monitoramento de contas a pagar vencidas
# Este script configura um cron job que executa a cada 30 minutos

echo "=== Configurando Cron Job para Monitoramento de Contas a Pagar ==="

# Diretório do projeto
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
echo "Diretório do projeto: $PROJECT_DIR"

# Verifica se o cron está instalado
if ! command -v crontab &> /dev/null; then
    echo "Erro: crontab não está instalado. Instale o cron primeiro."
    exit 1
fi

# Cria o comando do cron
CRON_COMMAND="*/30 * * * * cd $PROJECT_DIR && node scripts/monitoramentoContasPagar.js >> logs/monitoramento_contas.log 2>&1"

# Cria o diretório de logs se não existir
mkdir -p "$PROJECT_DIR/logs"

# Adiciona o job ao crontab
(crontab -l 2>/dev/null; echo "$CRON_COMMAND") | crontab -

echo "Cron job configurado com sucesso!"
echo "Comando adicionado: $CRON_COMMAND"
echo ""
echo "Para verificar os cron jobs ativos, execute: crontab -l"
echo "Para remover todos os cron jobs, execute: crontab -r"
echo ""
echo "O monitoramento será executado automaticamente a cada 30 minutos"
echo "Logs serão salvos em: $PROJECT_DIR/logs/monitoramento_contas.log"
