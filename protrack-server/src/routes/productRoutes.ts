import { Router } from "express";
import {
  createProduct,
  getAllProdutos,
  getGiroEstoqueController,
  getProdutosMaisVendidosController,
  getProdutosMelhorMargemLucroController,
  getMargemLucroTotalController,
  getEvolucaoLucroMensalController,
  getValorInvestidoPorCategoriaController,
  getDistribuicaoMargemLucroController,
  getTotalEstoque,
  getTotalEstoquePrecoController,
  produtosQuantidadeBaixaController,
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
router.get("/maisVendidos", getProdutosMaisVendidosController);
router.get("/faltaEstoque", produtosQuantidadeBaixaController);
router.get("/melhorMargemLucro", getProdutosMelhorMargemLucroController);
router.get("/margemLucroTotal", getMargemLucroTotalController);
router.get("/evolucaoLucroMensal", getEvolucaoLucroMensalController);
router.get(
  "/valorInvestidoPorCategoria",
  getValorInvestidoPorCategoriaController
);
router.get("/distribuicaoMargemLucro", getDistribuicaoMargemLucroController);
export default router;
