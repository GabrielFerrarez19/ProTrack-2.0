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
exports.criarVendaDb = exports.getTotalVendasDb = exports.mapVendasComItens = exports.getAllVendasDb = exports.atualizarVendaDb = void 0;
const database_1 = require("../config/database");
const atualizarVendaDb = (vendaId, dados, connection) => __awaiter(void 0, void 0, void 0, function* () {
    const updateFields = [];
    const updateValues = [];
    if (dados.clienteId != null) {
        updateFields.push("cliente_id = ?");
        updateValues.push(dados.clienteId);
    }
    if (dados.dataVenda) {
        updateFields.push("data_venda = ?");
        updateValues.push(dados.dataVenda);
    }
    if (dados.desconto != null) {
        updateFields.push("desconto = ?");
        updateValues.push(Number(dados.desconto));
    }
    if (dados.total != null) {
        updateFields.push("total = ?");
        updateValues.push(Number(dados.total));
    }
    if (dados.totalComDesconto != null) {
        updateFields.push("total_com_desconto = ?");
        updateValues.push(Number(dados.totalComDesconto));
    }
    if (dados.status) {
        updateFields.push("status = ?");
        updateValues.push(dados.status);
    }
    if (updateFields.length > 0) {
        const sql = `UPDATE vendas SET ${updateFields.join(", ")} WHERE id = ?`;
        updateValues.push(vendaId);
        yield connection.query(sql, updateValues);
    }
    if (Array.isArray(dados.produtos) && dados.produtos.length > 0) {
        yield connection.query(`DELETE FROM itens_venda WHERE venda_id = ?`, [
            vendaId,
        ]);
        for (const item of dados.produtos) {
            const { produtoId, quantidade, precoUnitario, desconto = 0 } = item;
            yield connection.query(`INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario, desconto)
           VALUES (?, ?, ?, ?, ?)`, [vendaId, produtoId, quantidade, precoUnitario, Number(desconto)]);
        }
    }
});
exports.atualizarVendaDb = atualizarVendaDb;
// Função que retorna todas as vendas com os itens
const getAllVendasDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const sql = `
    SELECT 
      v.id AS venda_id,
      v.cliente_id,
      c.nome AS cliente_nome,
      v.data_venda,
      v.desconto AS venda_desconto,
      v.total,
      v.total_com_desconto,
      v.status,
      v.data_cadastro,
      iv.id AS item_id,
      iv.produto_id,
      p.nome AS produto_nome,
      iv.quantidade,
      iv.preco_unitario,
      iv.desconto AS item_desconto
    FROM vendas v
    JOIN clientes c ON v.cliente_id = c.id
    LEFT JOIN itens_venda iv ON iv.venda_id = v.id
    LEFT JOIN produtos p ON iv.produto_id = p.id
    ORDER BY v.id, iv.id;
  `;
    const [results] = yield database_1.db.query(sql);
    return results;
});
exports.getAllVendasDb = getAllVendasDb;
// Função que organiza os dados em vendas com itens
const mapVendasComItens = (rows) => {
    const vendasMap = {};
    rows.forEach((row) => {
        if (!vendasMap[row.venda_id]) {
            vendasMap[row.venda_id] = {
                id: row.venda_id,
                cliente_id: row.cliente_id,
                cliente_nome: row.cliente_nome,
                data_venda: row.data_venda,
                desconto: row.venda_desconto,
                total: row.total,
                total_com_desconto: row.total_com_desconto,
                status: row.status,
                data_cadastro: row.data_cadastro,
                itens: [],
            };
        }
        if (row.item_id) {
            vendasMap[row.venda_id].itens.push({
                id: row.item_id,
                venda_id: row.venda_id,
                produto_id: row.produto_id,
                produto_nome: row.produto_nome,
                quantidade: row.quantidade,
                preco_unitario: row.preco_unitario,
                desconto: row.item_desconto,
            });
        }
    });
    return Object.values(vendasMap);
};
exports.mapVendasComItens = mapVendasComItens;
const getTotalVendasDb = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const [rows] = yield database_1.db.query("SELECT COUNT(*) AS totalVendas FROM vendas");
    return ((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.totalVendas) || 0;
});
exports.getTotalVendasDb = getTotalVendasDb;
const criarVendaDb = (dados) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield database_1.db.getConnection();
    try {
        yield connection.beginTransaction();
        // Inserir a venda
        const [vendaResult] = yield connection.execute(`
          INSERT INTO vendas (cliente_id, data_venda, desconto, total, total_com_desconto, status)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [
            dados.clienteId,
            dados.dataVenda,
            dados.desconto || 0,
            dados.total,
            dados.totalComDesconto,
            dados.status || "pendente",
        ]);
        const vendaId = vendaResult.insertId;
        // Inserir itens da venda
        const itensValues = dados.produtos.map((item) => {
            var _a;
            return [
                vendaId,
                item.produtoId,
                item.quantidade,
                item.precoUnitario,
                (_a = item.desconto) !== null && _a !== void 0 ? _a : 0,
            ];
        });
        yield connection.query(`
          INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario, desconto)
          VALUES ?
        `, [itensValues]);
        yield connection.commit();
        return vendaId;
    }
    catch (error) {
        yield connection.rollback();
        throw error;
    }
    finally {
        connection.release();
    }
});
exports.criarVendaDb = criarVendaDb;
