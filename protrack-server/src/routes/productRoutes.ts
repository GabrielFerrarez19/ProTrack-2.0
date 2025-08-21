import { Router } from "express";
import {
  createProduct,
  getAllProdutos,
  getGiroEstoqueController,
  getTotalEstoque,
  getTotalEstoquePrecoController,
  updateProduct,
} from "../controllers/product.controller";

const router = Router();

console.log("Rotas de produto carregadas!");

router.post("/produtos", createProduct);
router.get("/produtos/estoque-total", getTotalEstoque);
router.get("/produtos/todos", getAllProdutos);
router.put("/produtos/:id", updateProduct);
router.get("/totalPreco", getTotalEstoquePrecoController);
router.get("/giroEstoque", getGiroEstoqueController);
export default router;
