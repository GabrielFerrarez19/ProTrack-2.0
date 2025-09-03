"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const relatorio_controller_1 = require("../controllers/relatorio.controller");
const router = (0, express_1.Router)();
console.log("Rotas de relatórios carregadas!");
// Rotas específicas para cada tipo de relatório
router.get("/lucro-produto", relatorio_controller_1.getRelatorioLucroProdutoController);
router.get("/lucro-categoria", relatorio_controller_1.getRelatorioLucroCategoriaController);
router.get("/lucro-periodo", relatorio_controller_1.getRelatorioLucroPeriodoController);
router.get("/estoque-investimento", relatorio_controller_1.getRelatorioEstoqueInvestimentoController);
router.get("/completo", relatorio_controller_1.getRelatorioCompletoController);
// Rota genérica que aceita o tipo como parâmetro
router.get("/por-tipo", relatorio_controller_1.getRelatorioPorTipoController);
exports.default = router;
