import { Router } from "express";
import {
  atualizarVenda,
  criarVenda,
  getAllVendas,
  getTotalVendas,
} from "../controllers/vendas.controller";

const router = Router();

router.post("/cadvendas", criarVenda);
router.get("/totalvendas", getTotalVendas);
router.get("/todas", getAllVendas);
router.put("/altera/:id", atualizarVenda);

export default router;
