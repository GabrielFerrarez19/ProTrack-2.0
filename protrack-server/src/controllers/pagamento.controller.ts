import { Request, Response } from "express";
import {
  getHistoricoPagamentos,
  getTotalPagoCliente,
  getVendasPendentesComPagamento,
} from "../services/pagamento.service";

// Busca histórico de pagamentos de um cliente
export const getHistoricoCliente = async (req: Request, res: Response) => {
  try {
    const { clienteId } = req.params;

    if (!clienteId) {
      return res.status(400).json({ error: "ID do cliente é obrigatório" });
    }

    const historico = await getHistoricoPagamentos(parseInt(clienteId));
    const totalPago = await getTotalPagoCliente(parseInt(clienteId));
    const vendasComPagamento = await getVendasPendentesComPagamento(
      parseInt(clienteId)
    );

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
  } catch (error) {
    console.error("Erro ao buscar histórico de pagamentos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Busca resumo de pagamentos de um cliente
export const getResumoPagamentos = async (req: Request, res: Response) => {
  try {
    const { clienteId } = req.params;

    if (!clienteId) {
      return res.status(400).json({ error: "ID do cliente é obrigatório" });
    }

    const totalPago = await getTotalPagoCliente(parseInt(clienteId));
    const vendasComPagamento = await getVendasPendentesComPagamento(
      parseInt(clienteId)
    );

    // Calcula estatísticas
    const totalVendasPendentes = vendasComPagamento.reduce(
      (sum: number, venda: any) => sum + parseFloat(venda.total_com_desconto),
      0
    );
    const totalPagoVendasPendentes = vendasComPagamento.reduce(
      (sum: number, venda: any) => sum + parseFloat(venda.total_pago),
      0
    );
    const valorRestanteTotal = totalVendasPendentes - totalPagoVendasPendentes;

    res.json({
      totalPago,
      vendasPendentes: vendasComPagamento.length,
      valorTotalVendasPendentes: totalVendasPendentes,
      valorTotalPagoVendasPendentes: totalPagoVendasPendentes,
      valorRestanteTotal,
      progressoPagamento:
        totalVendasPendentes > 0
          ? (totalPagoVendasPendentes / totalVendasPendentes) * 100
          : 0,
    });
  } catch (error) {
    console.error("Erro ao buscar resumo de pagamentos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
