import { VendaResponse } from "../@types/types.service";

export function mapVendasComItensF(rows: any[]): VendaResponse[] {
  const vendasMap = new Map<number, VendaResponse>();

  for (const row of rows) {
    if (!vendasMap.has(row.venda_id)) {
      vendasMap.set(row.venda_id, {
        id: row.venda_id,
        cliente_id: row.cliente_id,
        cliente_nome: row.cliente_nome,
        data_venda: row.data_venda,
        desconto: row.venda_desconto,
        total: row.total,
        total_com_desconto: row.total_com_desconto,
        status: row.status,
        forma_pagamento: row.forma_pagamento,
        data_cadastro: row.data_cadastro,
        itens: [],
      });
    }

    if (row.item_id) {
      vendasMap.get(row.venda_id)!.itens.push({
        id: row.item_id,
        venda_id: row.venda_id,
        produto_id: row.produto_id,
        produto_nome: row.produto_nome,
        quantidade: row.quantidade,
        preco_unitario: row.preco_unitario,
        desconto: row.item_desconto,
      });
    }
  }

  return Array.from(vendasMap.values());
}
