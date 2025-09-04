"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResumoPagamentos = exports.getHistoricoCliente = void 0;
const pagamento_service_1 = require("../services/pagamento.service");
// Busca histórico de pagamentos de um cliente
const getHistoricoCliente = async (req, res) => {
    try {
        const { clienteId } = req.params;
        if (!clienteId) {
            return res.status(400).json({ error: "ID do cliente é obrigatório" });
        }
        const historico = await (0, pagamento_service_1.getHistoricoPagamentos)(parseInt(clienteId));
        const totalPago = await (0, pagamento_service_1.getTotalPagoCliente)(parseInt(clienteId));
        const vendasComPagamento = await (0, pagamento_service_1.getVendasPendentesComPagamento)(parseInt(clienteId));
        res.json({
            historico,
            totalPago,
            vendasComPagamento,
            resumo: {
                totalPagamentos: historico.length,
                valorTotalPago: totalPago,
                vendasPendentes: vendasComPagamento.length,
            },
        });
    }
    catch (error) {
        console.error("Erro ao buscar histórico de pagamentos:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};
exports.getHistoricoCliente = getHistoricoCliente;
// Busca resumo de pagamentos de um cliente
const getResumoPagamentos = async (req, res) => {
    try {
        const { clienteId } = req.params;
        if (!clienteId) {
            return res.status(400).json({ error: "ID do cliente é obrigatório" });
        }
        const totalPago = await (0, pagamento_service_1.getTotalPagoCliente)(parseInt(clienteId));
        const vendasComPagamento = await (0, pagamento_service_1.getVendasPendentesComPagamento)(parseInt(clienteId));
        // Calcula estatísticas
        const totalVendasPendentes = vendasComPagamento.reduce((sum, venda) => sum + parseFloat(venda.total_com_desconto), 0);
        const totalPagoVendasPendentes = vendasComPagamento.reduce((sum, venda) => sum + parseFloat(venda.total_pago), 0);
        const valorRestanteTotal = totalVendasPendentes - totalPagoVendasPendentes;
        res.json({
            totalPago,
            vendasPendentes: vendasComPagamento.length,
            valorTotalVendasPendentes: totalVendasPendentes,
            valorTotalPagoVendasPendentes: totalPagoVendasPendentes,
            valorRestanteTotal,
            progressoPagamento: totalVendasPendentes > 0
                ? (totalPagoVendasPendentes / totalVendasPendentes) * 100
                : 0,
        });
    }
    catch (error) {
        console.error("Erro ao buscar resumo de pagamentos:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};
exports.getResumoPagamentos = getResumoPagamentos;
