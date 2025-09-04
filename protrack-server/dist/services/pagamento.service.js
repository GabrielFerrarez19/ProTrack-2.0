"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVendasPendentesComPagamento = exports.getTotalPagoVenda = exports.getTotalPagoCliente = exports.getHistoricoPagamentos = exports.registrarPagamento = void 0;
const database_1 = require("../config/database");
// Registra um pagamento no histórico
const registrarPagamento = async (pagamento) => {
    const sql = `
    INSERT INTO historico_pagamentos (cliente_id, venda_id, valor_pago, observacoes)
    VALUES (?, ?, ?, ?)
  `;
    const [result] = await database_1.db.query(sql, [
        pagamento.cliente_id,
        pagamento.venda_id || null,
        pagamento.valor_pago,
        pagamento.observacoes || null,
    ]);
    return result.insertId;
};
exports.registrarPagamento = registrarPagamento;
// Busca histórico de pagamentos de um cliente
const getHistoricoPagamentos = async (clienteId) => {
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
    const [results] = await database_1.db.query(sql, [clienteId]);
    return results;
};
exports.getHistoricoPagamentos = getHistoricoPagamentos;
// Calcula o total pago por um cliente
const getTotalPagoCliente = async (clienteId) => {
    const sql = `
    SELECT COALESCE(SUM(valor_pago), 0) as total_pago
    FROM historico_pagamentos
    WHERE cliente_id = ?
  `;
    const [results] = await database_1.db.query(sql, [clienteId]);
    return parseFloat(results[0]?.total_pago || 0);
};
exports.getTotalPagoCliente = getTotalPagoCliente;
// Calcula o total pago para uma venda específica
const getTotalPagoVenda = async (vendaId) => {
    const sql = `
    SELECT COALESCE(SUM(valor_pago), 0) as total_pago
    FROM historico_pagamentos
    WHERE venda_id = ?
  `;
    const [results] = await database_1.db.query(sql, [vendaId]);
    return parseFloat(results[0]?.total_pago || 0);
};
exports.getTotalPagoVenda = getTotalPagoVenda;
// Busca vendas pendentes com total pago
const getVendasPendentesComPagamento = async (clienteId) => {
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
    const [results] = await database_1.db.query(sql, [clienteId]);
    return results;
};
exports.getVendasPendentesComPagamento = getVendasPendentesComPagamento;
