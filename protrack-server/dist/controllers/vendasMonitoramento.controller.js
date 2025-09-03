"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatusMonitoramento = exports.limparVendasAntigas = exports.getEstatisticasVendasVencidas = exports.executarMonitoramento = void 0;
const vendasMonitoramento_service_1 = require("../services/vendasMonitoramento.service");
// Endpoint para executar monitoramento manual
const executarMonitoramento = async (req, res) => {
    try {
        const resultado = await (0, vendasMonitoramento_service_1.executarMonitoramentoVendas)();
        res.status(200).json({
            success: true,
            message: "Monitoramento executado com sucesso",
            resultado,
        });
    }
    catch (error) {
        console.error("Erro ao executar monitoramento:", error);
        res.status(500).json({
            success: false,
            error: "Erro interno do servidor",
            message: error.message,
        });
    }
};
exports.executarMonitoramento = executarMonitoramento;
// Endpoint para obter estatísticas de vendas vencidas
const getEstatisticasVendasVencidas = async (req, res) => {
    try {
        const estatisticas = await (0, vendasMonitoramento_service_1.obterEstatisticasVendasVencidas)();
        res.status(200).json({
            success: true,
            estatisticas,
        });
    }
    catch (error) {
        console.error("Erro ao obter estatísticas:", error);
        res.status(500).json({
            success: false,
            error: "Erro interno do servidor",
            message: error.message,
        });
    }
};
exports.getEstatisticasVendasVencidas = getEstatisticasVendasVencidas;
// Endpoint para limpar vendas vencidas antigas
const limparVendasAntigas = async (req, res) => {
    try {
        const { dias = 365 } = req.query;
        const diasAntigos = Number(dias);
        if (isNaN(diasAntigos) || diasAntigos < 1) {
            return res.status(400).json({
                success: false,
                error: "Parâmetro 'dias' deve ser um número válido maior que 0",
            });
        }
        const vendasArquivadas = await (0, vendasMonitoramento_service_1.limparVendasVencidasAntigas)(diasAntigos);
        res.status(200).json({
            success: true,
            message: `${vendasArquivadas} vendas vencidas foram arquivadas`,
            vendasArquivadas,
            diasAntigos,
        });
    }
    catch (error) {
        console.error("Erro ao limpar vendas antigas:", error);
        res.status(500).json({
            success: false,
            error: "Erro interno do servidor",
            message: error.message,
        });
    }
};
exports.limparVendasAntigas = limparVendasAntigas;
// Endpoint para verificar status do sistema de monitoramento
const getStatusMonitoramento = async (req, res) => {
    try {
        const estatisticas = await (0, vendasMonitoramento_service_1.obterEstatisticasVendasVencidas)();
        res.status(200).json({
            success: true,
            status: "ativo",
            timestamp: new Date(),
            estatisticas,
            sistema: {
                nome: "Monitoramento de Vendas Vencidas",
                versao: "1.0.0",
                descricao: "Sistema automático para identificar e marcar vendas vencidas",
            },
        });
    }
    catch (error) {
        console.error("Erro ao verificar status:", error);
        res.status(500).json({
            success: false,
            status: "erro",
            error: "Erro interno do servidor",
            message: error.message,
        });
    }
};
exports.getStatusMonitoramento = getStatusMonitoramento;
