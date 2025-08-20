"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProdutosDb = exports.getTotalEstoqueDb = exports.updateProductDb = exports.createProductDb = void 0;
const connection_1 = require("../db/connection");
const createProductDb = (produto) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = `
    INSERT INTO produtos 
    (nome, descricao, categoria, codigo_barras, quantidade, tamanho, preco_custo, preco_venda)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
    const values = [
        produto.nome,
        produto.descricao || null,
        produto.categoria || null,
        produto.codigo_barras || null,
        produto.quantidade || 0,
        produto.tamanho || null,
        produto.preco_custo,
        produto.preco_venda,
    ];
    return new Promise((resolve, reject) => {
        connection_1.db.query(sql, values, (err, results) => {
            if (err)
                return reject(err);
            resolve(results.insertId);
        });
    });
});
exports.createProductDb = createProductDb;
const updateProductDb = (id, produto) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = `
    UPDATE produtos SET 
      nome = ?, 
      descricao = ?, 
      categoria = ?, 
      codigo_barras = ?, 
      quantidade = ?, 
      tamanho = ?, 
      preco_custo = ?, 
      preco_venda = ?
    WHERE id = ?
  `;
    const values = [
        produto.nome,
        produto.descricao || null,
        produto.categoria || null,
        produto.codigo_barras || null,
        produto.quantidade || 0,
        produto.tamanho || null,
        produto.preco_custo,
        produto.preco_venda,
        id,
    ];
    return new Promise((resolve, reject) => {
        connection_1.db.query(sql, values, (err, results) => {
            if (err)
                return reject(err);
            if (results.affectedRows === 0)
                return reject(new Error("Produto não encontrado"));
            resolve();
        });
    });
});
exports.updateProductDb = updateProductDb;
const getTotalEstoqueDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const sql = "SELECT SUM(quantidade) AS totalEstoque FROM produtos";
    return new Promise((resolve, reject) => {
        connection_1.db.query(sql, (err, results) => {
            if (err)
                return reject(err);
            resolve(results[0].totalEstoque || 0);
        });
    });
});
exports.getTotalEstoqueDb = getTotalEstoqueDb;
const getAllProdutosDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const sql = "SELECT * FROM produtos";
    return new Promise((resolve, reject) => {
        connection_1.db.query(sql, (err, results) => {
            if (err)
                return reject(err);
            resolve(results);
        });
    });
});
exports.getAllProdutosDb = getAllProdutosDb;
