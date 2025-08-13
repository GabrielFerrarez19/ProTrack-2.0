import { Router } from "express";
import {
  criarVenda,
  getAllVendas,
  getTotalVendas,
} from "../controllers/vendas.controller";

const router = Router();

router.post("/cadvendas", criarVenda);
router.get("/totalvendas", getTotalVendas);
router.get("/todas", getAllVendas);

export default router;
