"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FluxoCaixaController = void 0;
const fluxoCaixa_service_1 = require("../services/fluxoCaixa.service");
const fluxoCaixaService = new fluxoCaixa_service_1.FluxoCaixaService();
class FluxoCaixaController {
    // Obter resumo geral do fluxo de caixa
    async obterResumo(req, res) {
        try {
            const filtros = {
                periodo: req.query.periodo || "30dias",
                tipo_visualizacao: req.query.tipo_visualizacao || "diario",
            };
            const resumo = await fluxoCaixaService.obterResumo(filtros);
            res.json({
                success: true,
                data: resumo,
            });
        }
        catch (error) {
            console.error("Erro ao obter resumo do fluxo de caixa:", error);
            res.status(500).json({
                success: false,
                message: "Erro interno do servidor",
                error: error instanceof Error ? error.message : "Erro desconhecido",
            });
        }
    }
    // Obter fluxo de caixa histórico
    async obterFluxoHistorico(req, res) {
        try {
            const filtros = {
                periodo: req.query.periodo || "30dias",
                tipo_visualizacao: req.query.tipo_visualizacao || "diario",
            };
            const fluxoHistorico = await fluxoCaixaService.obterFluxoHistorico(filtros);
            res.json({
                success: true,
                data: fluxoHistorico,
            });
        }
        catch (error) {
            console.error("Erro ao obter fluxo histórico:", error);
            res.status(500).json({
                success: false,
                message: "Erro interno do servidor",
                error: error instanceof Error ? error.message : "Erro desconhecido",
            });
        }
    }
    // Obter projeção futura
    async obterProjecaoFutura(req, res) {
        try {
            const projecao = await fluxoCaixaService.obterProjecaoFutura();
            res.json({
                success: true,
                data: projecao,
            });
        }
        catch (error) {
            console.error("Erro ao obter projeção futura:", error);
            res.status(500).json({
                success: false,
                message: "Erro interno do servidor",
                error: error instanceof Error ? error.message : "Erro desconhecido",
            });
        }
    }
    // Obter categorias de entrada
    async obterCategoriasEntrada(req, res) {
        try {
            const filtros = {
                periodo: req.query.periodo || "30dias",
                tipo_visualizacao: req.query.tipo_visualizacao || "diario",
            };
            const categorias = await fluxoCaixaService.obterCategoriasEntrada(filtros);
            res.json({
                success: true,
                data: categorias,
            });
        }
        catch (error) {
            console.error("Erro ao obter categorias de entrada:", error);
            res.status(500).json({
                success: false,
                message: "Erro interno do servidor",
                error: error instanceof Error ? error.message : "Erro desconhecido",
            });
        }
    }
    // Obter categorias de saída
    async obterCategoriasSaida(req, res) {
        try {
            const filtros = {
                periodo: req.query.periodo || "30dias",
                tipo_visualizacao: req.query.tipo_visualizacao || "diario",
            };
            const categorias = await fluxoCaixaService.obterCategoriasSaida(filtros);
            res.json({
                success: true,
                data: categorias,
            });
        }
        catch (error) {
            console.error("Erro ao obter categorias de saída:", error);
            res.status(500).json({
                success: false,
                message: "Erro interno do servidor",
                error: error instanceof Error ? error.message : "Erro desconhecido",
            });
        }
    }
    // Obter comparativo entre períodos
    async obterComparativoPeriodos(req, res) {
        try {
            const comparativo = await fluxoCaixaService.obterComparativoPeriodos();
            res.json({
                success: true,
                data: comparativo,
            });
        }
        catch (error) {
            console.error("Erro ao obter comparativo de períodos:", error);
            res.status(500).json({
                success: false,
                message: "Erro interno do servidor",
                error: error instanceof Error ? error.message : "Erro desconhecido",
            });
        }
    }
    // Obter dados completos para a página de fluxo de caixa
    async obterDadosCompletos(req, res) {
        try {
            const filtros = {
                periodo: req.query.periodo || "30dias",
                tipo_visualizacao: req.query.tipo_visualizacao || "diario",
            };
            const [resumo, fluxoHistorico, projecaoFutura, categoriasEntrada, categoriasSaida, comparativoPeriodos,] = await Promise.all([
                fluxoCaixaService.obterResumo(filtros),
                fluxoCaixaService.obterFluxoHistorico(filtros),
                fluxoCaixaService.obterProjecaoFutura(),
                fluxoCaixaService.obterCategoriasEntrada(filtros),
                fluxoCaixaService.obterCategoriasSaida(filtros),
                fluxoCaixaService.obterComparativoPeriodos(),
            ]);
            res.json({
                success: true,
                data: {
                    resumo,
                    fluxoHistorico,
                    projecaoFutura,
                    categoriasEntrada,
                    categoriasSaida,
                    comparativoPeriodos,
                },
            });
        }
        catch (error) {
            console.error("Erro ao obter dados completos do fluxo de caixa:", error);
            res.status(500).json({
                success: false,
                message: "Erro interno do servidor",
                error: error instanceof Error ? error.message : "Erro desconhecido",
            });
        }
    }
    // Criar nova movimentação financeira
    async criarMovimentacao(req, res) {
        try {
            const dados = req.body;
            // Validação básica
            if (!dados.tipo ||
                !dados.descricao ||
                !dados.valor ||
                !dados.data_movimentacao) {
                return res.status(400).json({
                    success: false,
                    message: "Dados obrigatórios não fornecidos",
                });
            }
            const movimentacao = await fluxoCaixaService.criarMovimentacao(dados);
            res.status(201).json({
                success: true,
                message: "Movimentação criada com sucesso",
                data: movimentacao,
            });
        }
        catch (error) {
            console.error("Erro ao criar movimentação:", error);
            res.status(500).json({
                success: false,
                message: "Erro interno do servidor",
                error: error instanceof Error ? error.message : "Erro desconhecido",
            });
        }
    }
    // Atualizar movimentação financeira
    async atualizarMovimentacao(req, res) {
        try {
            const { id } = req.params;
            const dados = req.body;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "ID da movimentação não fornecido",
                });
            }
            const movimentacao = await fluxoCaixaService.atualizarMovimentacao(Number(id), dados);
            res.json({
                success: true,
                message: "Movimentação atualizada com sucesso",
                data: movimentacao,
            });
        }
        catch (error) {
            console.error("Erro ao atualizar movimentação:", error);
            res.status(500).json({
                success: false,
                message: "Erro interno do servidor",
                error: error instanceof Error ? error.message : "Erro desconhecido",
            });
        }
    }
    // Excluir movimentação financeira
    async excluirMovimentacao(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "ID da movimentação não fornecido",
                });
            }
            await fluxoCaixaService.excluirMovimentacao(Number(id));
            res.json({
                success: true,
                message: "Movimentação excluída com sucesso",
            });
        }
        catch (error) {
            console.error("Erro ao excluir movimentação:", error);
            res.status(500).json({
                success: false,
                message: "Erro interno do servidor",
                error: error instanceof Error ? error.message : "Erro desconhecido",
            });
        }
    }
}
exports.FluxoCaixaController = FluxoCaixaController;
