import { Router } from "express";
import {
  getMetodosPagamentoAtivosController,
  getMetodosPagamentoConfig,
  toggleMetodoPagamentoController,
} from "../controllers/metodosPagamentos.controller";

const router = Router();

router.get("/metodos-pagamento", getMetodosPagamentoConfig);
router.patch("/metodos-pagamento/:id/toggle", toggleMetodoPagamentoController);
router.get("/metodos-pagamento/ativos", getMetodosPagamentoAtivosController);

export default router;
