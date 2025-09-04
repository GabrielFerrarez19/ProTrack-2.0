import { db } from "../config/database";

export interface PagamentoData {
  cliente_id: number;
  venda_id?: number;
  valor_pago: number;
  observacoes?: string;
}

export interface HistoricoPagamento {
  id: number;
  cliente_id: number;
  venda_id?: number;
  valor_pago: number;
  data_pagamento: string;
  observacoes?: string;
}

// Registra um pagamento no histórico
export const registrarPagamento = async (
  pagamento: PagamentoData
): Promise<number> => {
  const sql = `
    INSERT INTO historico_pagamentos (cliente_id, venda_id, valor_pago, observacoes)
    VALUES (?, ?, ?, ?)
  `;

  const [result]: any = await db.query(sql, [
    pagamento.cliente_id,
    pagamento.venda_id || null,
    pagamento.valor_pago,
    pagamento.observacoes || null,
  ]);

  return result.insertId;
};

// Busca histórico de pagamentos de um cliente
export const getHistoricoPagamentos = async (
  clienteId: number
): Promise<HistoricoPagamento[]> => {
  const sql = `
    SELECT 
      hp.id,
      hp.cliente_id,
      hp.venda_id,
      hp.valor_pago,
      hp.data_pagamento,
      hp.observacoes,
      v.total_com_desconto as valor_venda
    FROM historico_pagamentos hp
    LEFT JOIN vendas v ON hp.venda_id = v.id
    WHERE hp.cliente_id = ?
    ORDER BY hp.data_pagamento DESC
  `;

  const [results]: any[] = await db.query(sql, [clienteId]);
  return results;
};

// Calcula o total pago por um cliente
export const getTotalPagoCliente = async (
  clienteId: number
): Promise<number> => {
  const sql = `
    SELECT COALESCE(SUM(valor_pago), 0) as total_pago
    FROM historico_pagamentos
    WHERE cliente_id = ?
  `;

  const [results]: any[] = await db.query(sql, [clienteId]);
  return parseFloat(results[0]?.total_pago || 0);
};

// Calcula o total pago para uma venda específica
export const getTotalPagoVenda = async (vendaId: number): Promise<number> => {
  const sql = `
    SELECT COALESCE(SUM(valor_pago), 0) as total_pago
    FROM historico_pagamentos
    WHERE venda_id = ?
  `;

  const [results]: any[] = await db.query(sql, [vendaId]);
  return parseFloat(results[0]?.total_pago || 0);
};

// Busca vendas pendentes com total pago
export const getVendasPendentesComPagamento = async (clienteId: number) => {
  const sql = `
    SELECT 
      v.id,
      v.total_com_desconto,
      v.status,
      v.data_venda,
      COALESCE(SUM(hp.valor_pago), 0) as total_pago,
      (v.total_com_desconto - COALESCE(SUM(hp.valor_pago), 0)) as valor_restante
    FROM vendas v
    LEFT JOIN historico_pagamentos hp ON v.id = hp.venda_id
    WHERE v.cliente_id = ? AND v.status IN ('pendente', 'aprazo', 'vencido')
    GROUP BY v.id, v.total_com_desconto, v.status, v.data_venda
    ORDER BY v.data_venda ASC
  `;

  const [results]: any[] = await db.query(sql, [clienteId]);
  return results;
};
