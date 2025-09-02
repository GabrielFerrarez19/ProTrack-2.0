import { Router } from "express";
import {
  executarMonitoramento,
  getEstatisticasVendasVencidas,
  limparVendasAntigas,
  getStatusMonitoramento,
} from "../controllers/vendasMonitoramento.controller";

const router = Router();

// Rota para executar monitoramento manual
router.post("/executar", executarMonitoramento);

// Rota para obter estatísticas
router.get("/estatisticas", getEstatisticasVendasVencidas);

// Rota para limpar vendas antigas
router.delete("/limpar", limparVendasAntigas);

// Rota para verificar status do sistema
router.get("/status", getStatusMonitoramento);

export default router;
