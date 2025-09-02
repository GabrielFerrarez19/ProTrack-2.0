#!/bin/bash

# Script para configurar automaticamente o cron job de monitoramento
# Executa monitoramento a cada 5 minutos

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Configurador de Cron Job para Monitoramento de Vendas ===${NC}"

# Verificar se estamos no diretório correto
if [ ! -f "src/services/vendasMonitoramento.service.ts" ]; then
    echo -e "${RED}❌ Erro: Execute este script no diretório protrack-server${NC}"
    exit 1
fi

# Obter caminho absoluto do projeto
PROJECT_PATH=$(pwd)
echo -e "${BLUE}📁 Diretório do projeto: ${PROJECT_PATH}${NC}"

# Criar pasta de logs se não existir
if [ ! -d "logs" ]; then
    mkdir -p logs
    echo -e "${GREEN}✅ Pasta logs criada${NC}"
else
    echo -e "${GREEN}✅ Pasta logs já existe${NC}"
fi

# Verificar se o script de monitoramento existe
if [ ! -f "src/scripts/monitoramentoVendas.js" ]; then
    echo -e "${RED}❌ Erro: Script de monitoramento não encontrado${NC}"
    exit 1
fi

# Tornar o script executável
chmod +x src/scripts/monitoramentoVendas.js
echo -e "${GREEN}✅ Permissões do script ajustadas${NC}"

# Configuração do cron job
CRON_JOB="*/5 * * * * cd ${PROJECT_PATH} && node src/scripts/monitoramentoVendas.js >> logs/monitoramento.log 2>&1"

echo -e "${YELLOW}📋 Cron job a ser configurado:${NC}"
echo -e "${BLUE}${CRON_JOB}${NC}"

# Verificar se já existe um cron job para este projeto
EXISTING_CRON=$(crontab -l 2>/dev/null | grep -F "${PROJECT_PATH}" || true)

if [ -n "$EXISTING_CRON" ]; then
    echo -e "${YELLOW}⚠️  Já existe um cron job para este projeto:${NC}"
    echo -e "${BLUE}${EXISTING_CRON}${NC}"
    
    read -p "Deseja substituir? (s/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo -e "${YELLOW}Operação cancelada${NC}"
        exit 0
    fi
    
    # Remover cron job existente
    (crontab -l 2>/dev/null | grep -v -F "${PROJECT_PATH}") | crontab -
    echo -e "${GREEN}✅ Cron job anterior removido${NC}"
fi

# Adicionar novo cron job
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo -e "${GREEN}✅ Cron job configurado com sucesso!${NC}"

# Verificar se foi adicionado
if crontab -l 2>/dev/null | grep -q -F "${PROJECT_PATH}"; then
    echo -e "${GREEN}✅ Verificação: Cron job está ativo${NC}"
else
    echo -e "${RED}❌ Erro: Cron job não foi adicionado${NC}"
    exit 1
fi

# Mostrar cron jobs ativos
echo -e "${BLUE}📋 Cron jobs ativos:${NC}"
crontab -l

# Criar arquivo de configuração do logrotate
LOGROTATE_CONFIG="/etc/logrotate.d/protrack-monitoramento"
if [ -w "/etc/logrotate.d" ]; then
    echo -e "${BLUE}📝 Criando configuração do logrotate...${NC}"
    
    cat > /tmp/protrack-monitoramento << EOF
${PROJECT_PATH}/logs/monitoramento.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 644 $(whoami) $(whoami)
    postrotate
        echo "Logs rotacionados em \$(date)" >> ${PROJECT_PATH}/logs/monitoramento.log
    endscript
}
EOF

    if sudo cp /tmp/protrack-monitoramento "$LOGROTATE_CONFIG"; then
        echo -e "${GREEN}✅ Configuração do logrotate criada em ${LOGROTATE_CONFIG}${NC}"
        rm /tmp/protrack-monitoramento
    else
        echo -e "${YELLOW}⚠️  Não foi possível criar configuração do logrotate (requer sudo)${NC}"
        echo -e "${BLUE}📝 Você pode criar manualmente:${NC}"
        echo -e "${BLUE}sudo nano ${LOGROTATE_CONFIG}${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Não foi possível criar configuração do logrotate${NC}"
fi

# Instruções finais
echo -e "${GREEN}🎉 Configuração concluída com sucesso!${NC}"
echo
echo -e "${BLUE}📋 Próximos passos:${NC}"
echo -e "1. ${BLUE}Verificar se o cron está rodando:${NC} systemctl status cron"
echo -e "2. ${BLUE}Monitorar logs em tempo real:${NC} tail -f logs/monitoramento.log"
echo -e "3. ${BLUE}Testar execução manual:${NC} node src/scripts/monitoramentoVendas.js"
echo -e "4. ${BLUE}Verificar cron jobs:${NC} crontab -l"
echo
echo -e "${BLUE}📊 O monitoramento será executado a cada 5 minutos${NC}"
echo -e "${BLUE}🕐 Próxima execução: $(date -d 'now + 5 minutes' '+%H:%M')${NC}"
echo
echo -e "${GREEN}✅ Sistema de monitoramento configurado e ativo!${NC}"
