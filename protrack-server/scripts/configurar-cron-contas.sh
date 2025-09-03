#!/bin/bash

# Script para configurar cron job de atualização de status das contas a pagar
# ProTrack 2.0

echo "🔧 Configurando cron job para atualização de status das contas a pagar..."

# Obter o diretório atual do script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Verificar se o diretório existe
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Erro: Diretório do projeto não encontrado: $PROJECT_DIR"
    exit 1
fi

# Caminho completo para o script de atualização
UPDATE_SCRIPT="$PROJECT_DIR/scripts/atualizarStatusContas.js"

# Verificar se o script existe
if [ ! -f "$UPDATE_SCRIPT" ]; then
    echo "❌ Erro: Script de atualização não encontrado: $UPDATE_SCRIPT"
    exit 1
fi

# Criar entrada do cron job
CRON_JOB="0 0 * * * cd $PROJECT_DIR && node scripts/atualizarStatusContas.js >> logs/cron-contas.log 2>&1"

# Verificar se já existe
if crontab -l 2>/dev/null | grep -q "atualizarStatusContas.js"; then
    echo "⚠️  Cron job já existe. Removendo entrada anterior..."
    crontab -l 2>/dev/null | grep -v "atualizarStatusContas.js" | crontab -
fi

# Adicionar novo cron job
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

# Criar diretório de logs se não existir
mkdir -p "$PROJECT_DIR/logs"

# Verificar se foi adicionado
if crontab -l 2>/dev/null | grep -q "atualizarStatusContas.js"; then
    echo "✅ Cron job configurado com sucesso!"
    echo "📅 Executará diariamente às 00:00"
    echo "📁 Logs serão salvos em: $PROJECT_DIR/logs/cron-contas.log"
    echo ""
    echo "📋 Cron jobs ativos:"
    crontab -l
else
    echo "❌ Erro ao configurar cron job"
    exit 1
fi

echo ""
echo "🔍 Para verificar os logs:"
echo "   tail -f $PROJECT_DIR/logs/cron-contas.log"
echo ""
echo "🔍 Para listar cron jobs:"
echo "   crontab -l"
echo ""
echo "🔍 Para remover cron job:"
echo "   crontab -e"
echo "   (remova a linha com atualizarStatusContas.js)"
echo ""
echo "✅ Configuração concluída!"
