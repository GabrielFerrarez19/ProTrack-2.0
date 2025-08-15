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
exports.atualizarVenda = exports.getAllVendas = exports.getTotalVendas = exports.criarVenda = void 0;
const database_1 = require("../config/database");
const venda_service_1 = require("../services/venda.service");
const criarVenda = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dados = req.body;
    if (!dados.clienteId ||
        !dados.dataVenda ||
        !dados.produtos ||
        !Array.isArray(dados.produtos)) {
        return res.status(400).json({ error: "Dados inválidos" });
    }
    try {
        const vendaId = yield (0, venda_service_1.criarVendaDb)(dados);
        res.status(201).json({ message: "Venda criada com sucesso", vendaId });
    }
    catch (error) {
        console.error("Erro ao criar venda:", error);
        res.status(500).json({ error: "Erro ao criar venda" });
    }
});
exports.criarVenda = criarVenda;
const getTotalVendas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const total = yield (0, venda_service_1.getTotalVendasDb)();
        res.status(200).json({ totalVendas: total });
    }
    catch (error) {
        console.error("Erro ao buscar total de vendas:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
exports.getTotalVendas = getTotalVendas;
// Controller para retornar todas as vendas com os itens
const getAllVendas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rows = yield (0, venda_service_1.getAllVendasDb)();
        const vendas = (0, venda_service_1.mapVendasComItens)(rows);
        res.status(200).json(vendas);
    }
    catch (err) {
        console.error("Erro ao buscar vendas:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
exports.getAllVendas = getAllVendas;
const atualizarVenda = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendaId = Number(req.params.id);
    const dados = req.body;
    const connection = yield database_1.db.getConnection();
    try {
        yield connection.beginTransaction();
        yield (0, venda_service_1.atualizarVendaDb)(vendaId, dados, connection);
        yield connection.commit();
        res.json({ message: "Venda atualizada com sucesso" });
    }
    catch (error) {
        yield connection.rollback();
        console.error("Erro ao atualizar venda:", error);
        res.status(500).json({ error: error.message });
    }
    finally {
        connection.release();
    }
});
exports.atualizarVenda = atualizarVenda;
