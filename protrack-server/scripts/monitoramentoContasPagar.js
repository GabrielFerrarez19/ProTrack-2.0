const { exec } = require("child_process");
const path = require("path");

// Configurações do script
const SCRIPT_NAME = "monitoramentoContasPagar.js";
const LOG_FILE = "monitoramento_contas.log";
const INTERVALO_MINUTOS = 30; // Executa a cada 30 minutos

// Função para executar o monitoramento
function executarMonitoramento() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Executando monitoramento de contas a pagar...`);

  // Comando para executar o monitoramento via API
  const comando = `curl -X POST http://localhost:8085/monitoramento-contas/executar`;

  exec(comando, (error, stdout, stderr) => {
    if (error) {
      console.error(`[${timestamp}] Erro ao executar monitoramento:`, error);
      return;
    }

    if (stderr) {
      console.error(`[${timestamp}] Stderr:`, stderr);
    }

    console.log(`[${timestamp}] Monitoramento executado com sucesso:`, stdout);
  });
}

// Função para verificar status do sistema
function verificarStatus() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Verificando status do sistema...`);

  const comando = `curl -X GET http://localhost:8085/monitoramento-contas/status`;

  exec(comando, (error, stdout, stderr) => {
    if (error) {
      console.error(`[${timestamp}] Erro ao verificar status:`, error);
      return;
    }

    if (stderr) {
      console.error(`[${timestamp}] Stderr:`, stderr);
    }

    console.log(`[${timestamp}] Status do sistema:`, stdout);
  });
}

// Função principal
function main() {
  console.log("=== Sistema de Monitoramento de Contas a Pagar Vencidas ===");
  console.log(`Script iniciado em: ${new Date().toISOString()}`);
  console.log(`Intervalo de execução: ${INTERVALO_MINUTOS} minutos`);
  console.log("Pressione Ctrl+C para parar o script\n");

  // Executa imediatamente na primeira vez
  executarMonitoramento();

  // Executa a cada intervalo definido
  setInterval(executarMonitoramento, INTERVALO_MINUTOS * 60 * 1000);

  // Verifica status a cada hora
  setInterval(verificarStatus, 60 * 60 * 1000);
}

// Tratamento de sinais para parada graciosa
process.on("SIGINT", () => {
  console.log("\n\nScript de monitoramento interrompido pelo usuário");
  console.log("Finalizando...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n\nScript de monitoramento finalizado");
  console.log("Finalizando...");
  process.exit(0);
});

// Inicia o script
main();
