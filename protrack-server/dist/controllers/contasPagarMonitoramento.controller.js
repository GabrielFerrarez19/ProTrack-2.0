"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatusMonitoramento = exports.limparContasAntigas = exports.getEstatisticasContasVencidas = exports.executarMonitoramento = void 0;
const contasPagarMonitoramento_service_1 = require("../services/contasPagarMonitoramento.service");
// Endpoint para executar monitoramento manual
const executarMonitoramento = async (req, res) => {
    try {
        const resultado = await (0, contasPagarMonitoramento_service_1.executarMonitoramentoContasPagar)();
        res.status(200).json({
            success: true,
            message: "Monitoramento de contas a pagar executado com sucesso",
            resultado,
        });
    }
    catch (error) {
        console.error("Erro ao executar monitoramento de contas:", error);
        res.status(500).json({
            success: false,
            error: "Erro interno do servidor",
            message: error.message,
        });
    }
};
exports.executarMonitoramento = executarMonitoramento;
// Endpoint para obter estatísticas de contas vencidas
const getEstatisticasContasVencidas = async (req, res) => {
    try {
        const estatisticas = await (0, contasPagarMonitoramento_service_1.obterEstatisticasContasVencidas)();
        res.status(200).json({
            success: true,
            estatisticas,
        });
    }
    catch (error) {
        console.error("Erro ao obter estatísticas de contas:", error);
        res.status(500).json({
            success: false,
            error: "Erro interno do servidor",
            message: error.message,
        });
    }
};
exports.getEstatisticasContasVencidas = getEstatisticasContasVencidas;
// Endpoint para limpar contas vencidas antigas
const limparContasAntigas = async (req, res) => {
    try {
        const { dias = 365 } = req.query;
        const diasAntigos = Number(dias);
        if (isNaN(diasAntigos) || diasAntigos < 1) {
            return res.status(400).json({
                success: false,
                error: "Parâmetro 'dias' deve ser um número válido maior que 0",
            });
        }
        const contasArquivadas = await (0, contasPagarMonitoramento_service_1.limparContasVencidasAntigas)(diasAntigos);
        res.status(200).json({
            success: true,
            message: `${contasArquivadas} contas vencidas foram arquivadas`,
            contasArquivadas,
            diasAntigos,
        });
    }
    catch (error) {
        console.error("Erro ao limpar contas antigas:", error);
        res.status(500).json({
            success: false,
            error: "Erro interno do servidor",
            message: error.message,
        });
    }
};
exports.limparContasAntigas = limparContasAntigas;
// Endpoint para verificar status do sistema de monitoramento
const getStatusMonitoramento = async (req, res) => {
    try {
        const estatisticas = await (0, contasPagarMonitoramento_service_1.obterEstatisticasContasVencidas)();
        res.status(200).json({
            success: true,
            status: "ativo",
            timestamp: new Date(),
            estatisticas,
            sistema: {
                nome: "Monitoramento de Contas a Pagar Vencidas",
                versao: "1.0.0",
                descricao: "Sistema automático para identificar e marcar contas a pagar vencidas",
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
