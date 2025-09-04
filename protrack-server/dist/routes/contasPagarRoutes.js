"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contasPagar_controller_1 = require("../controllers/contasPagar.controller");
const router = (0, express_1.Router)();
// ===== ROTAS PARA CONTAS A PAGAR =====
// Criar nova conta
router.post("/contas", contasPagar_controller_1.criarContaController);
// Listar contas com filtros
router.get("/contas", contasPagar_controller_1.listarContasController);
// Obter resumo das contas (DEVE VIR ANTES das rotas com parâmetros)
router.get("/contas/resumo", contasPagar_controller_1.obterResumoController);
// Buscar contas por vencimento
router.get("/contas/vencimentos", contasPagar_controller_1.buscarContasVencimentoController);
// Buscar conta por ID
router.get("/contas/:id", contasPagar_controller_1.buscarContaPorIdController);
// Atualizar conta
router.put("/contas/:id", contasPagar_controller_1.atualizarContaController);
// Excluir conta
router.delete("/contas/:id", contasPagar_controller_1.excluirContaController);
// Marcar conta como paga
router.put("/contas/:id/pagar", contasPagar_controller_1.marcarComoPagaController);
// ===== ROTAS PARA FORNECEDORES =====
// Criar novo fornecedor
router.post("/fornecedores", contasPagar_controller_1.criarFornecedorController);
// Listar fornecedores
router.get("/fornecedores", contasPagar_controller_1.listarFornecedoresController);
// Buscar fornecedor por ID
router.get("/fornecedores/:id", contasPagar_controller_1.buscarFornecedorPorIdController);
// Atualizar fornecedor
router.put("/fornecedores/:id", contasPagar_controller_1.atualizarFornecedorController);
// Excluir fornecedor (soft delete)
router.delete("/fornecedores/:id", contasPagar_controller_1.excluirFornecedorController);
// ===== ROTAS UTILITÁRIAS =====
// Atualizar status das contas (para cron jobs)
router.post("/contas/atualizar-status", contasPagar_controller_1.atualizarStatusContasController);
exports.default = router;
