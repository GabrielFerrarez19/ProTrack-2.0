import { Router } from "express";
import {
  createProduct,
  getTotalEstoque,
} from "../controllers/product.controller";

const router = Router();

router.post("/produtos", createProduct);
router.get("/produtos/estoque-total", getTotalEstoque);

export default router;
