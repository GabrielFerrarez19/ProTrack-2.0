import { MetodoPagamentoConfig } from "../@types/types.controller";
import { db } from "../config/database";

// Retorna todos os métodos de pagamento
export const getMetodosPagamento = async (): Promise<
  MetodoPagamentoConfig[]
> => {
  const sql = `
    SELECT id, nome, tipo, ativo
    FROM metodos_pagamento
    ORDER BY nome ASC;
  `;
  const [rows]: any = await db.query(sql);
  return rows as MetodoPagamentoConfig[];
};

// service
export const toggleMetodoPagamento = async (id: number, ativo: boolean) => {
  const sql = `
    UPDATE metodos_pagamento
    SET ativo = ?
    WHERE id = ?;
  `;
  await db.query(sql, [ativo, id]);
};

export const getMetodosPagamentoAtivos = async () => {
  const sql = `
    SELECT nome, tipo, id
    FROM metodos_pagamento
    WHERE ativo = 1
    ORDER BY nome ASC;
  `;
  const [rows]: any = await db.query(sql);
  return rows;
};
