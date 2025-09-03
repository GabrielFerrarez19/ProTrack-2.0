import { Router } from "express";
import {
  executarMonitoramento,
  getEstatisticasContasVencidas,
  limparContasAntigas,
  getStatusMonitoramento,
} from "../controllers/contasPagarMonitoramento.controller";

const router = Router();

// Rota para executar monitoramento manual
router.post("/executar", executarMonitoramento);

// Rota para obter estatísticas
router.get("/estatisticas", getEstatisticasContasVencidas);

// Rota para limpar contas antigas
router.delete("/limpar", limparContasAntigas);

// Rota para verificar status do sistema
router.get("/status", getStatusMonitoramento);

export default router;
