"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoria = exports.updateCategoria = exports.addCategoria = exports.getCategorias = exports.getMetodosPagamentoAtivos = exports.toggleMetodoPagamento = exports.getMetodosPagamento = void 0;
const database_1 = require("../config/database");
// Retorna todos os métodos de pagamento
const getMetodosPagamento = async () => {
    const sql = `
    SELECT id, nome, tipo, ativo
    FROM metodos_pagamento
    ORDER BY nome ASC;
  `;
    const [rows] = await database_1.db.query(sql);
    return rows;
};
exports.getMetodosPagamento = getMetodosPagamento;
// service
const toggleMetodoPagamento = async (id, ativo) => {
    const sql = `
    UPDATE metodos_pagamento
    SET ativo = ?
    WHERE id = ?;
  `;
    await database_1.db.query(sql, [ativo, id]);
};
exports.toggleMetodoPagamento = toggleMetodoPagamento;
const getMetodosPagamentoAtivos = async () => {
    const sql = `
    SELECT nome, tipo, id
    FROM metodos_pagamento
    WHERE ativo = 1
    ORDER BY nome ASC;
  `;
    const [rows] = await database_1.db.query(sql);
    return rows;
};
exports.getMetodosPagamentoAtivos = getMetodosPagamentoAtivos;
// Lista todas as categorias
const getCategorias = async () => {
    const sql = `
    SELECT id, nome, tipo, cor
    FROM categorias
    ORDER BY nome ASC;
  `;
    const [rows] = await database_1.db.query(sql);
    return rows;
};
exports.getCategorias = getCategorias;
// Adiciona uma nova categoria
const addCategoria = async (categoria) => {
    const sql = `
    INSERT INTO categorias (id, nome, tipo, cor)
    VALUES (?, ?, ?, ?);
  `;
    const [result] = await database_1.db.query(sql, [
        categoria.id,
        categoria.nome,
        categoria.tipo,
        categoria.cor,
    ]);
    return result;
};
exports.addCategoria = addCategoria;
// Atualiza uma categoria existente
const updateCategoria = async (categoria) => {
    const sql = `
    UPDATE categorias
    SET nome = ?, tipo = ?, cor = ?
    WHERE id = ?;
  `;
    const [result] = await database_1.db.query(sql, [
        categoria.nome,
        categoria.tipo,
        categoria.cor,
        categoria.id,
    ]);
    return result;
};
exports.updateCategoria = updateCategoria;
// Remove uma categoria pelo id
const deleteCategoria = async (id) => {
    const sql = `
    DELETE FROM categorias
    WHERE id = ?;
  `;
    const [result] = await database_1.db.query(sql, [id]);
    return result;
};
exports.deleteCategoria = deleteCategoria;
