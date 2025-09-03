import { Router } from "express";
import {
  criarContaController,
  listarContasController,
  buscarContaPorIdController,
  atualizarContaController,
  excluirContaController,
  marcarComoPagaController,
  obterResumoController,
  criarFornecedorController,
  listarFornecedoresController,
  buscarFornecedorPorIdController,
  atualizarFornecedorController,
  excluirFornecedorController,
  atualizarStatusContasController,
  buscarContasVencimentoController,
} from "../controllers/contasPagar.controller";

const router = Router();

// ===== ROTAS PARA CONTAS A PAGAR =====

// Criar nova conta
router.post("/contas", criarContaController);

// Listar contas com filtros
router.get("/contas", listarContasController);

// Obter resumo das contas (DEVE VIR ANTES das rotas com parâmetros)
router.get("/contas/resumo", obterResumoController);

// Buscar contas por vencimento
router.get("/contas/vencimentos", buscarContasVencimentoController);

// Buscar conta por ID
router.get("/contas/:id", buscarContaPorIdController);

// Atualizar conta
router.put("/contas/:id", atualizarContaController);

// Excluir conta
router.delete("/contas/:id", excluirContaController);

// Marcar conta como paga
router.put("/contas/:id/pagar", marcarComoPagaController);

// ===== ROTAS PARA FORNECEDORES =====

// Criar novo fornecedor
router.post("/fornecedores", criarFornecedorController);

// Listar fornecedores
router.get("/fornecedores", listarFornecedoresController);

// Buscar fornecedor por ID
router.get("/fornecedores/:id", buscarFornecedorPorIdController);

// Atualizar fornecedor
router.put("/fornecedores/:id", atualizarFornecedorController);

// Excluir fornecedor (soft delete)
router.delete("/fornecedores/:id", excluirFornecedorController);

// ===== ROTAS UTILITÁRIAS =====

// Atualizar status das contas (para cron jobs)
router.post("/contas/atualizar-status", atualizarStatusContasController);

export default router;
