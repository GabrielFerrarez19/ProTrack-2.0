import { Router } from "express";
import {
  getRelatorioLucroProdutoController,
  getRelatorioLucroCategoriaController,
  getRelatorioLucroPeriodoController,
  getRelatorioEstoqueInvestimentoController,
  getRelatorioCompletoController,
  getRelatorioPorTipoController,
} from "../controllers/relatorio.controller";

const router = Router();

console.log("Rotas de relatórios carregadas!");

// Rotas específicas para cada tipo de relatório
router.get("/lucro-produto", getRelatorioLucroProdutoController);
router.get("/lucro-categoria", getRelatorioLucroCategoriaController);
router.get("/lucro-periodo", getRelatorioLucroPeriodoController);
router.get("/estoque-investimento", getRelatorioEstoqueInvestimentoController);
router.get("/completo", getRelatorioCompletoController);

// Rota genérica que aceita o tipo como parâmetro
router.get("/por-tipo", getRelatorioPorTipoController);

export default router;

