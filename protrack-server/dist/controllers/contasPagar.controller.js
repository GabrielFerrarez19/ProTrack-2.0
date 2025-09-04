"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buscarContasVencimentoController = exports.atualizarStatusContasController = exports.excluirFornecedorController = exports.atualizarFornecedorController = exports.buscarFornecedorPorIdController = exports.listarFornecedoresController = exports.criarFornecedorController = exports.obterResumoController = exports.marcarComoPagaController = exports.excluirContaController = exports.atualizarContaController = exports.buscarContaPorIdController = exports.listarContasController = exports.criarContaController = void 0;
const contasPagar_service_1 = require("../services/contasPagar.service");
// ===== CONTAS A PAGAR =====
const criarContaController = async (req, res) => {
    try {
        const data = req.body;
        // Validações básicas
        if (!data.fornecedor_nome ||
            !data.valor ||
            !data.data_vencimento ||
            !data.categoria_id ||
            !data.descricao) {
            res.status(400).json({
                success: false,
                message: "Campos obrigatórios: fornecedor_nome, valor, data_vencimento, categoria_id, descricao",
            });
            return;
        }
        if (data.valor <= 0) {
            res.status(400).json({
                success: false,
                message: "Valor deve ser maior que zero",
            });
            return;
        }
        const conta = await (0, contasPagar_service_1.criarConta)(data);
        res.status(201).json({
            success: true,
            message: "Conta criada com sucesso",
            data: conta,
        });
    }
    catch (error) {
        console.error("Erro ao criar conta:", error);
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor",
            error: error instanceof Error ? error.message : "Erro desconhecido",
        });
    }
};
exports.criarContaController = criarContaController;
const listarContasController = async (req, res) => {
    try {
        const filtros = {
            search: req.query.search,
            status: req.query.status,
            categoria_id: req.query.categoria_id,
            data_inicio: req.query.data_inicio,
            data_fim: req.query.data_fim,
            fornecedor_id: req.query.fornecedor_id,
        };
        const contas = await (0, contasPagar_service_1.listarContas)(filtros);
        res.status(200).json({
            success: true,
            message: "Contas listadas com sucesso",
            data: contas,
            total: contas.length,
        });
    }
    catch (error) {
        console.error("Erro ao listar contas:", error);
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor",
            error: error instanceof Error ? error.message : "Erro desconhecido",
        });
    }
};
exports.listarContasController = listarContasController;
const buscarContaPorIdController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                message: "ID da conta é obrigatório",
            });
            return;
        }
        const conta = await (0, contasPagar_service_1.buscarContaPorId)(id);
        if (!conta) {
            res.status(404).json({
                success: false,
                message: "Conta não encontrada",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Conta encontrada com sucesso",
            data: conta,
        });
    }
    catch (error) {
        console.error("Erro ao buscar conta:", error);
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor",
            error: error instanceof Error ? error.message : "Erro desconhecido",
        });
    }
};
exports.buscarContaPorIdController = buscarContaPorIdController;
const atualizarContaController = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        if (!id) {
            res.status(400).json({
                success: false,
                message: "ID da conta é obrigatório",
            });
            return;
        }
        if (Object.keys(data).length === 0) {
            res.status(400).json({
                success: false,
                message: "Nenhum campo para atualizar",
            });
            return;
        }
        const conta = await (0, contasPagar_service_1.atualizarConta)(id, data);
        res.status(200).json({
            success: true,
            message: "Conta atualizada com sucesso",
            data: conta,
        });
    }
    catch (error) {
        console.error("Erro ao atualizar conta:", error);
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor",
            error: error instanceof Error ? error.message : "Erro desconhecido",
        });
    }
};
exports.atualizarContaController = atualizarContaController;
const excluirContaController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                message: "ID da conta é obrigatório",
            });
            return;
        }
        const sucesso = await (0, contasPagar_service_1.excluirConta)(id);
        if (!sucesso) {
            res.status(404).json({
                success: false,
                message: "Conta não encontrada",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Conta excluída com sucesso",
        });
    }
    catch (error) {
        console.error("Erro ao excluir conta:", error);
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor",
            error: error instanceof Error ? error.message : "Erro desconhecido",
        });
    }
};
exports.excluirContaController = excluirContaController;
const marcarComoPagaController = async (req, res) => {
    try {
        const { id } = req.params;
        const { valor_pago, forma_pagamento } = req.body;
        if (!id) {
            res.status(400).json({
                success: false,
                message: "ID da conta é obrigatório",
            });
            return;
        }
        if (!valor_pago || valor_pago <= 0) {
            res.status(400).json({
                success: false,
                message: "Valor pago deve ser maior que zero",
            });
            return;
        }
        if (!forma_pagamento) {
            res.status(400).json({
                success: false,
                message: "Forma de pagamento é obrigatória",
            });
            return;
        }
        const conta = await (0, contasPagar_service_1.marcarComoPaga)(id, {
            valor_pago,
            forma_pagamento,
        });
        res.status(200).json({
            success: true,
            message: "Conta marcada como paga com sucesso",
            data: conta,
        });
    }
    catch (error) {
        console.error("Erro ao marcar conta como paga:", error);
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor",
            error: error instanceof Error ? error.message : "Erro desconhecido",
        });
    }
};
exports.marcarComoPagaController = marcarComoPagaController;
const obterResumoController = async (req, res) => {
    try {
        const resumo = await (0, contasPagar_service_1.obterResumo)();
        res.status(200).json({
            success: true,
            message: "Resumo obtido com sucesso",
            data: resumo,
        });
    }
    catch (error) {
        console.error("Erro ao obter resumo:", error);
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor",
            error: error instanceof Error ? error.message : "Erro desconhecido",
        });
    }
};
exports.obterResumoController = obterResumoController;
// ===== FORNECEDORES =====
const criarFornecedorController = async (req, res) => {
    try {
        const data = req.body;
        if (!data.nome) {
            res.status(400).json({
                success: false,
                message: "Nome do fornecedor é obrigatório",
            });
            return;
        }
        const fornecedor = await (0, contasPagar_service_1.criarFornecedor)(data);
        res.status(201).json({
            success: true,
            message: "Fornecedor criado com sucesso",
            data: fornecedor,
        });
    }
    catch (error) {
        console.error("Erro ao criar fornecedor:", error);
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor",
            error: error instanceof Error ? error.message : "Erro desconhecido",
        });
    }
};
exports.criarFornecedorController = criarFornecedorController;
const listarFornecedoresController = async (req, res) => {
    try {
        const fornecedores = await (0, contasPagar_service_1.listarFornecedores)();
        res.status(200).json({
            success: true,
            message: "Fornecedores listados com sucesso",
            data: fornecedores,
            total: fornecedores.length,
        });
    }
    catch (error) {
        console.error("Erro ao listar fornecedores:", error);
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor",
            error: error instanceof Error ? error.message : "Erro desconhecido",
        });
    }
};
exports.listarFornecedoresController = listarFornecedoresController;
const buscarFornecedorPorIdController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                message: "ID do fornecedor é obrigatório",
            });
            return;
        }
        const fornecedor = await (0, contasPagar_service_1.buscarFornecedorPorId)(id);
        if (!fornecedor) {
            res.status(404).json({
                success: false,
                message: "Fornecedor não encontrado",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Fornecedor encontrado com sucesso",
            data: fornecedor,
        });
    }
    catch (error) {
        console.error("Erro ao buscar fornecedor:", error);
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor",
            error: error instanceof Error ? error.message : "Erro desconhecido",
        });
    }
};
exports.buscarFornecedorPorIdController = buscarFornecedorPorIdController;
const atualizarFornecedorController = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        if (!id) {
            res.status(400).json({
                success: false,
                message: "ID do fornecedor é obrigatório",
            });
            return;
        }
        if (Object.keys(data).length === 0) {
            res.status(400).json({
                success: false,
                message: "Nenhum campo para atualizar",
            });
            return;
        }
        const fornecedor = await (0, contasPagar_service_1.atualizarFornecedor)(id, data);
        res.status(200).json({
            success: true,
            message: "Fornecedor atualizado com sucesso",
            data: fornecedor,
        });
    }
    catch (error) {
        console.error("Erro ao atualizar fornecedor:", error);
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor",
            error: error instanceof Error ? error.message : "Erro desconhecido",
        });
    }
};
exports.atualizarFornecedorController = atualizarFornecedorController;
const excluirFornecedorController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                message: "ID do fornecedor é obrigatório",
            });
            return;
        }
        const sucesso = await (0, contasPagar_service_1.excluirFornecedor)(id);
        if (!sucesso) {
            res.status(404).json({
                success: false,
                message: "Fornecedor não encontrado",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Fornecedor excluído com sucesso",
        });
    }
    catch (error) {
        console.error("Erro ao excluir fornecedor:", error);
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor",
            error: error instanceof Error ? error.message : "Erro desconhecido",
        });
    }
};
exports.excluirFornecedorController = excluirFornecedorController;
// ===== ROTAS UTILITÁRIAS =====
const atualizarStatusContasController = async (req, res) => {
    try {
        await (0, contasPagar_service_1.atualizarStatusContas)();
        res.status(200).json({
            success: true,
            message: "Status das contas atualizado com sucesso",
        });
    }
    catch (error) {
        console.error("Erro ao atualizar status das contas:", error);
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor",
            error: error instanceof Error ? error.message : "Erro desconhecido",
        });
    }
};
exports.atualizarStatusContasController = atualizarStatusContasController;
const buscarContasVencimentoController = async (req, res) => {
    try {
        const contas = await (0, contasPagar_service_1.buscarContasVencimento)();
        res.status(200).json({
            success: true,
            message: "Contas por vencimento obtidas com sucesso",
            data: contas,
        });
    }
    catch (error) {
        console.error("Erro ao buscar contas por vencimento:", error);
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor",
            error: error instanceof Error ? error.message : "Erro desconhecido",
        });
    }
};
exports.buscarContasVencimentoController = buscarContasVencimentoController;
