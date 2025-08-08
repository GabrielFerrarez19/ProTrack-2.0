import { Router } from "express";
import {
  createProduct,
  getAllProdutos,
  getTotalEstoque,
  updateProduct,
} from "../controllers/product.controller";

const router = Router();

console.log("Rotas de produto carregadas!");

router.post("/produtos", createProduct);
router.get("/produtos/estoque-total", getTotalEstoque);
router.get("/produtos/todos", getAllProdutos);
router.put("/produtos/:id", updateProduct);

export default router;
