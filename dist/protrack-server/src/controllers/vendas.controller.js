"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.atualizarVenda = exports.getAllVendas = exports.getTotalVendas = exports.criarVenda = void 0;
const database_1 = require("../config/database");
const venda_service_1 = require("../services/venda.service");
const criarVenda = async (req, res) => {
    const dados = req.body;
    if (!dados.clienteId ||
        !dados.dataVenda ||
        !dados.produtos ||
        !Array.isArray(dados.produtos)) {
        return res.status(400).json({ error: "Dados inválidos" });
    }
    try {
        const vendaId = await (0, venda_service_1.criarVendaDb)(dados);
        res.status(201).json({ message: "Venda criada com sucesso", vendaId });
    }
    catch (error) {
        console.error("Erro ao criar venda:", error);
        res.status(500).json({ error: "Erro ao criar venda" });
    }
};
exports.criarVenda = criarVenda;
const getTotalVendas = async (req, res) => {
    try {
        const total = await (0, venda_service_1.getTotalVendasDb)();
        res.status(200).json({ totalVendas: total });
    }
    catch (error) {
        console.error("Erro ao buscar total de vendas:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};
exports.getTotalVendas = getTotalVendas;
// Controller para retornar todas as vendas com os itens
const getAllVendas = async (req, res) => {
    try {
        const rows = await (0, venda_service_1.getAllVendasDb)();
        const vendas = (0, venda_service_1.mapVendasComItens)(rows);
        res.status(200).json(vendas);
    }
    catch (err) {
        console.error("Erro ao buscar vendas:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};
exports.getAllVendas = getAllVendas;
const atualizarVenda = async (req, res) => {
    const vendaId = Number(req.params.id);
    const dados = req.body;
    const connection = await database_1.db.getConnection();
    try {
        await connection.beginTransaction();
        await (0, venda_service_1.atualizarVendaDb)(vendaId, dados, connection);
        await connection.commit();
        res.json({ message: "Venda atualizada com sucesso" });
    }
    catch (error) {
        await connection.rollback();
        console.error("Erro ao atualizar venda:", error);
        res.status(500).json({ error: error.message });
    }
    finally {
        connection.release();
    }
};
exports.atualizarVenda = atualizarVenda;
