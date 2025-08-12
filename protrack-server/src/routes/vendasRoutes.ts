import { Router } from "express";
import { criarVenda } from "../controllers/vendas.controller";

const router = Router();

router.post("/cadvendas", criarVenda);

export default router;
