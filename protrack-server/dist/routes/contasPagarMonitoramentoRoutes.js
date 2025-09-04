"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contasPagarMonitoramento_controller_1 = require("../controllers/contasPagarMonitoramento.controller");
const router = (0, express_1.Router)();
// Rota para executar monitoramento manual
router.post("/executar", contasPagarMonitoramento_controller_1.executarMonitoramento);
// Rota para obter estatísticas
router.get("/estatisticas", contasPagarMonitoramento_controller_1.getEstatisticasContasVencidas);
// Rota para limpar contas antigas
router.delete("/limpar", contasPagarMonitoramento_controller_1.limparContasAntigas);
// Rota para verificar status do sistema
router.get("/status", contasPagarMonitoramento_controller_1.getStatusMonitoramento);
exports.default = router;
