import { MetodoPagamentoConfig } from "../@types/types.service";
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

// Lista todas as categorias
export const getCategorias = async () => {
  const sql = `
    SELECT id, nome, tipo, cor
    FROM categorias
    ORDER BY nome ASC;
  `;
  const [rows]: any = await db.query(sql);
  return rows;
};

// Adiciona uma nova categoria
export const addCategoria = async (categoria: {
  id: string;
  nome: string;
  tipo: "receita" | "despesa";
  cor: string;
}) => {
  const sql = `
    INSERT INTO categorias (id, nome, tipo, cor)
    VALUES (?, ?, ?, ?);
  `;
  const [result]: any = await db.query(sql, [
    categoria.id,
    categoria.nome,
    categoria.tipo,
    categoria.cor,
  ]);
  return result;
};

// Atualiza uma categoria existente
export const updateCategoria = async (categoria: {
  id: string;
  nome: string;
  tipo: "receita" | "despesa";
  cor: string;
}) => {
  const sql = `
    UPDATE categorias
    SET nome = ?, tipo = ?, cor = ?
    WHERE id = ?;
  `;
  const [result]: any = await db.query(sql, [
    categoria.nome,
    categoria.tipo,
    categoria.cor,
    categoria.id,
  ]);
  return result;
};

// Remove uma categoria pelo id
export const deleteCategoria = async (id: string) => {
  const sql = `
    DELETE FROM categorias
    WHERE id = ?;
  `;
  const [result]: any = await db.query(sql, [id]);
  return result;
};
