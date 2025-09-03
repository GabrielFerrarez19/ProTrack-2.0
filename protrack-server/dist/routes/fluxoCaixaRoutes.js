"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fluxoCaixa_controller_1 = require("../controllers/fluxoCaixa.controller");
const router = (0, express_1.Router)();
const fluxoCaixaController = new fluxoCaixa_controller_1.FluxoCaixaController();
// Rotas para obter dados do fluxo de caixa
router.get("/resumo", fluxoCaixaController.obterResumo);
router.get("/historico", fluxoCaixaController.obterFluxoHistorico);
router.get("/projecao", fluxoCaixaController.obterProjecaoFutura);
router.get("/categorias-entrada", fluxoCaixaController.obterCategoriasEntrada);
router.get("/categorias-saida", fluxoCaixaController.obterCategoriasSaida);
router.get("/comparativo-periodos", fluxoCaixaController.obterComparativoPeriodos);
// Rota para obter todos os dados de uma vez (otimizada para a página)
router.get("/dados-completos", fluxoCaixaController.obterDadosCompletos);
// Rotas para gerenciar movimentações financeiras
router.post("/movimentacoes", fluxoCaixaController.criarMovimentacao);
router.put("/movimentacoes/:id", fluxoCaixaController.atualizarMovimentacao);
router.delete("/movimentacoes/:id", fluxoCaixaController.excluirMovimentacao);
exports.default = router;
