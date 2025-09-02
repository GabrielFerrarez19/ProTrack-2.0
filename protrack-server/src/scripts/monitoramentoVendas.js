#!/usr/bin/env node

/**
 * Script para monitoramento automático de vendas vencidas
 * Pode ser executado via cron job ou manualmente
 *
 * Exemplo de cron job (executar a cada hora):
 * 0 * * * * cd /caminho/para/protrack-server && node src/scripts/monitoramentoVendas.js
 */

const {
  executarMonitoramentoVendas,
  obterEstatisticasVendasVencidas,
} = require("../services/vendasMonitoramento.service");

async function executarMonitoramentoAutomatico() {
  try {
    console.log("=== INICIANDO MONITORAMENTO AUTOMÁTICO ===");
    console.log(`Data/Hora: ${new Date().toLocaleString("pt-BR")}`);

    // Executa o monitoramento
    const resultado = await executarMonitoramentoVendas();

    console.log("=== RESULTADO DO MONITORAMENTO ===");
    console.log(`Vendas identificadas: ${resultado.vendasIdentificadas}`);
    console.log(`Vendas processadas: ${resultado.vendasProcessadas}`);
    console.log(`Timestamp: ${resultado.timestamp.toLocaleString("pt-BR")}`);

    // Obtém estatísticas atuais
    const estatisticas = await obterEstatisticasVendasVencidas();

    console.log("=== ESTATÍSTICAS ATUAIS ===");
    console.log(`Total de vendas vencidas: ${estatisticas.totalVencidas}`);
    console.log(
      `Valor total vencido: R$ ${estatisticas.valorTotalVencido.toFixed(2)}`
    );
    console.log(
      `Última verificação: ${estatisticas.ultimaVerificacao?.toLocaleString(
        "pt-BR"
      )}`
    );

    console.log("=== MONITORAMENTO CONCLUÍDO ===");

    // Se houver vendas vencidas, pode enviar notificação
    if (resultado.vendasProcessadas > 0) {
      console.log(
        `⚠️  ATENÇÃO: ${resultado.vendasProcessadas} vendas foram marcadas como vencidas!`
      );
      // Aqui você pode adicionar lógica para enviar email, webhook, etc.
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ ERRO durante monitoramento automático:", error);
    process.exit(1);
  }
}

// Executa o monitoramento se o script for chamado diretamente
if (require.main === module) {
  executarMonitoramentoAutomatico();
}

module.exports = { executarMonitoramentoAutomatico };
