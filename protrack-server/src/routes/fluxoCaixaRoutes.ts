import { Router } from "express";
import {
  getFluxoCaixaHistorico,
  getFluxoCaixaProjecao,
  getCategoriasFluxoCaixa,
  getComparativoPeriodos,
  getResumoFluxoCaixa,
} from "../controllers/fluxoCaixa.controller";

const router = Router();

// GET /fluxo-caixa/historico - Busca histórico de fluxo de caixa
router.get("/historico", getFluxoCaixaHistorico);

// GET /fluxo-caixa/projecao - Busca projeções futuras
router.get("/projecao", getFluxoCaixaProjecao);

// GET /fluxo-caixa/categorias - Busca categorias de entradas e saídas
router.get("/categorias", getCategoriasFluxoCaixa);

// GET /fluxo-caixa/comparativo - Busca comparativo entre períodos
router.get("/comparativo", getComparativoPeriodos);

// GET /fluxo-caixa/resumo - Busca resumo geral do fluxo de caixa
router.get("/resumo", getResumoFluxoCaixa);

export default router;
