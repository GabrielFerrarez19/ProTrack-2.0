import { Router } from "express";
import {
  createProduct,
  getAllProdutos,
  getTotalEstoque,
} from "../controllers/product.controller";

const router = Router();

router.post("/produtos", createProduct);
router.get("/produtos/estoque-total", getTotalEstoque);
router.get("/produtos/todos", getAllProdutos);

export default router;
