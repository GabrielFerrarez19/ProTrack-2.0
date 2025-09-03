"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientesEmAbertoCountController = exports.getTotalGeralAReceberController = exports.getVendasCliente = exports.getAllClientes = exports.getTotalClientes = exports.updateCliente = exports.createCliente = void 0;
const client_service_1 = require("../services/client.service");
const createCliente = async (req, res) => {
    const cliente = req.body;
    if (!cliente.nome ||
        !cliente.dataNascimento ||
        !cliente.cpf ||
        !cliente.email) {
        return res.status(400).json({
            error: "Nome, data de nascimento, CPF e e-mail são obrigatórios.",
        });
    }
    try {
        const id = await (0, client_service_1.createClienteDb)(cliente);
        res.status(201).json({ message: "Cliente cadastrado com sucesso!", id });
    }
    catch (err) {
        console.error("Erro ao criar cliente:", err);
        res.status(500).json({ error: "Erro interno ao cadastrar cliente" });
    }
};
exports.createCliente = createCliente;
const updateCliente = async (req, res) => {
    const id = Number(req.params.id);
    const cliente = req.body;
    if (!id ||
        !cliente.nome ||
        !cliente.dataNascimento ||
        !cliente.cpf ||
        !cliente.email) {
        return res.status(400).json({
            error: "ID, nome, data de nascimento, CPF e e-mail são obrigatórios.",
        });
    }
    try {
        await (0, client_service_1.updateClienteDb)(id, cliente);
        res.status(200).json({ message: "Cliente atualizado com sucesso" });
    }
    catch (err) {
        if (err.message === "Cliente não encontrado")
            return res.status(404).json({ error: err.message });
        console.error("Erro ao atualizar cliente:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};
exports.updateCliente = updateCliente;
const getTotalClientes = async (req, res) => {
    try {
        const total = await (0, client_service_1.getTotalClientesDb)();
        res.status(200).json({ totalClientes: total });
    }
    catch (err) {
        console.error("Erro ao buscar total de clientes:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};
exports.getTotalClientes = getTotalClientes;
const getAllClientes = async (req, res) => {
    try {
        const clientes = await (0, client_service_1.getAllClientesDb)();
        res.status(200).json({ clientes });
    }
    catch (err) {
        console.error("Erro ao buscar clientes:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};
exports.getAllClientes = getAllClientes;
const getVendasCliente = async (req, res) => {
    try {
        const idCliente = Number(req.params.id);
        if (isNaN(idCliente)) {
            return res.status(400).json({ error: "ID de cliente inválido." });
        }
        const vendas = await (0, client_service_1.getVendasByClienteId)(idCliente);
        res.json(vendas);
    }
    catch (error) {
        console.error("Erro ao buscar vendas do cliente:", error);
        res
            .status(500)
            .json({ error: "Erro interno ao buscar vendas do cliente." });
    }
};
exports.getVendasCliente = getVendasCliente;
const getTotalGeralAReceberController = async (req, res) => {
    try {
        const totalGeral = await (0, client_service_1.getTotalAPagarGeral)();
        res.status(200).json({
            total_geral: totalGeral ?? 0, // garante número
        });
    }
    catch (err) {
        console.error("Erro ao buscar total geral a receber:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};
exports.getTotalGeralAReceberController = getTotalGeralAReceberController;
const getClientesEmAbertoCountController = async (req, res) => {
    try {
        const total = await (0, client_service_1.getClientesEmAbertoCountDb)();
        res.status(200).json({ totalClientesEmAberto: total });
    }
    catch (err) {
        console.error("Erro ao buscar contagem de clientes em aberto:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};
exports.getClientesEmAbertoCountController = getClientesEmAbertoCountController;
