"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vendasMonitoramento_controller_1 = require("../controllers/vendasMonitoramento.controller");
const router = (0, express_1.Router)();
// Rota para executar monitoramento manual
router.post("/executar", vendasMonitoramento_controller_1.executarMonitoramento);
// Rota para obter estatísticas
router.get("/estatisticas", vendasMonitoramento_controller_1.getEstatisticasVendasVencidas);
// Rota para limpar vendas antigas
router.delete("/limpar", vendasMonitoramento_controller_1.limparVendasAntigas);
// Rota para verificar status do sistema
router.get("/status", vendasMonitoramento_controller_1.getStatusMonitoramento);
exports.default = router;
