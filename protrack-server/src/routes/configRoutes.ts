import { Router } from "express";
import {
  atualizarCategoria,
  criarCategoria,
  getMetodosPagamentoAtivosController,
  getMetodosPagamentoConfig,
  listarCategorias,
  removerCategoria,
  toggleMetodoPagamentoController,
} from "../controllers/config.controller";

const router = Router();

router.get("/metodos-pagamento", getMetodosPagamentoConfig);
router.patch("/metodos-pagamento/:id/toggle", toggleMetodoPagamentoController);
router.get("/metodos-pagamento/ativos", getMetodosPagamentoAtivosController);
router.get("/categorias", listarCategorias);
router.post("/categorias", criarCategoria);
router.put("/categorias/:id", atualizarCategoria);
router.delete("/categorias/:id", removerCategoria);

export default router;
