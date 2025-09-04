import { Router } from "express";
import {
  getHistoricoCliente,
  getResumoPagamentos,
} from "../controllers/pagamento.controller";

const router = Router();

// Rotas para histórico de pagamentos
router.get("/historico/:clienteId", getHistoricoCliente);
router.get("/resumo/:clienteId", getResumoPagamentos);

export default router;
