import { Router } from "express";
import {
  atualizarVenda,
  criarVenda,
  getAllVendas,
  getFormasPagamentoController,
  getTotalVendas,
  getVendasDashboardController,
  getVendasVencidas,
  getTotalVendasVencidas,
} from "../controllers/vendas.controller";

const router = Router();

router.post("/cadvendas", criarVenda);
router.get("/totalvendas", getTotalVendas);
router.get("/todas", getAllVendas);
router.put("/altera/:id", atualizarVenda);
router.get("/resumoDeVendas", getVendasDashboardController);
router.get("/formasPagamentos", getFormasPagamentoController);
router.get("/vencidas", getVendasVencidas);
router.get("/vencidas/total", getTotalVendasVencidas);

export default router;
