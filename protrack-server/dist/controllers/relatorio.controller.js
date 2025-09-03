"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelatorioPorTipoController = exports.getRelatorioCompletoController = exports.getRelatorioEstoqueInvestimentoController = exports.getRelatorioLucroPeriodoController = exports.getRelatorioLucroCategoriaController = exports.getRelatorioLucroProdutoController = void 0;
const relatorio_service_1 = require("../services/relatorio.service");
// Relatório de Lucro por Produto
const getRelatorioLucroProdutoController = async (req, res) => {
    try {
        const relatorio = await (0, relatorio_service_1.getRelatorioLucroProduto)();
        res.status(200).json({ relatorio });
    }
    catch (err) {
        console.error("Erro ao gerar relatório de lucro por produto:", err);
        res.status(500).json({ error: err.message });
    }
};
exports.getRelatorioLucroProdutoController = getRelatorioLucroProdutoController;
// Relatório de Lucro por Categoria
const getRelatorioLucroCategoriaController = async (req, res) => {
    try {
        const relatorio = await (0, relatorio_service_1.getRelatorioLucroCategoria)();
        res.status(200).json({ relatorio });
    }
    catch (err) {
        console.error("Erro ao gerar relatório de lucro por categoria:", err);
        res.status(500).json({ error: err.message });
    }
};
exports.getRelatorioLucroCategoriaController = getRelatorioLucroCategoriaController;
// Relatório de Lucro por Período
const getRelatorioLucroPeriodoController = async (req, res) => {
    try {
        const { dataInicio, dataFim } = req.query;
        if (!dataInicio || !dataFim) {
            return res.status(400).json({
                error: "Data de início e data de fim são obrigatórias",
            });
        }
        const relatorio = await (0, relatorio_service_1.getRelatorioLucroPeriodo)(dataInicio, dataFim);
        res.status(200).json({ relatorio });
    }
    catch (err) {
        console.error("Erro ao gerar relatório de lucro por período:", err);
        res.status(500).json({ error: err.message });
    }
};
exports.getRelatorioLucroPeriodoController = getRelatorioLucroPeriodoController;
// Relatório de Estoque x Investimento
const getRelatorioEstoqueInvestimentoController = async (req, res) => {
    try {
        const relatorio = await (0, relatorio_service_1.getRelatorioEstoqueInvestimento)();
        res.status(200).json({ relatorio });
    }
    catch (err) {
        console.error("Erro ao gerar relatório de estoque x investimento:", err);
        res.status(500).json({ error: err.message });
    }
};
exports.getRelatorioEstoqueInvestimentoController = getRelatorioEstoqueInvestimentoController;
// Relatório Completo
const getRelatorioCompletoController = async (req, res) => {
    try {
        const { dataInicio, dataFim } = req.query;
        if (!dataInicio || !dataFim) {
            return res.status(400).json({
                error: "Data de início e data de fim são obrigatórias",
            });
        }
        const relatorio = await (0, relatorio_service_1.getRelatorioCompleto)(dataInicio, dataFim);
        res.status(200).json(relatorio);
    }
    catch (err) {
        console.error("Erro ao gerar relatório completo:", err);
        res.status(500).json({ error: err.message });
    }
};
exports.getRelatorioCompletoController = getRelatorioCompletoController;
// Relatório por Tipo (endpoint genérico)
const getRelatorioPorTipoController = async (req, res) => {
    try {
        const { tipo, dataInicio, dataFim } = req.query;
        if (!tipo) {
            return res.status(400).json({
                error: "Tipo de relatório é obrigatório",
            });
        }
        let relatorio;
        switch (tipo) {
            case "lucro-produto":
                relatorio = await (0, relatorio_service_1.getRelatorioLucroProduto)();
                break;
            case "lucro-categoria":
                relatorio = await (0, relatorio_service_1.getRelatorioLucroCategoria)();
                break;
            case "lucro-periodo":
                if (!dataInicio || !dataFim) {
                    return res.status(400).json({
                        error: "Data de início e data de fim são obrigatórias para este tipo de relatório",
                    });
                }
                relatorio = await (0, relatorio_service_1.getRelatorioLucroPeriodo)(dataInicio, dataFim);
                break;
            case "estoque-investimento":
                relatorio = await (0, relatorio_service_1.getRelatorioEstoqueInvestimento)();
                break;
            case "completo":
                if (!dataInicio || !dataFim) {
                    return res.status(400).json({
                        error: "Data de início e data de fim são obrigatórias para este tipo de relatório",
                    });
                }
                relatorio = await (0, relatorio_service_1.getRelatorioCompleto)(dataInicio, dataFim);
                break;
            default:
                return res.status(400).json({
                    error: "Tipo de relatório inválido",
                });
        }
        res.status(200).json({ relatorio });
    }
    catch (err) {
        console.error("Erro ao gerar relatório:", err);
        res.status(500).json({ error: err.message });
    }
};
exports.getRelatorioPorTipoController = getRelatorioPorTipoController;
