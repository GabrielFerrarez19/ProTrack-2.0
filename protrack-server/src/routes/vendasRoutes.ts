import { Router } from "express";
import { criarVenda, getTotalVendas } from "../controllers/vendas.controller";

const router = Router();

router.post("/cadvendas", criarVenda);
router.get("/totalvendas", getTotalVendas);

export default router;
