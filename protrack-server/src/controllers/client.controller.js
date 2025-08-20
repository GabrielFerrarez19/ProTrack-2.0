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
exports.getAllClientes = exports.getTotalClientes = exports.updateCliente = exports.createCliente = void 0;
const client_service_1 = require("../services/client.service");
const createCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const id = yield (0, client_service_1.createClienteDb)(cliente);
        res.status(201).json({ message: "Cliente cadastrado com sucesso!", id });
    }
    catch (err) {
        console.error("Erro ao criar cliente:", err);
        res.status(500).json({ error: "Erro interno ao cadastrar cliente" });
    }
});
exports.createCliente = createCliente;
const updateCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield (0, client_service_1.updateClienteDb)(id, cliente);
        res.status(200).json({ message: "Cliente atualizado com sucesso" });
    }
    catch (err) {
        if (err.message === "Cliente não encontrado")
            return res.status(404).json({ error: err.message });
        console.error("Erro ao atualizar cliente:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
exports.updateCliente = updateCliente;
const getTotalClientes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const total = yield (0, client_service_1.getTotalClientesDb)();
        res.status(200).json({ totalClientes: total });
    }
    catch (err) {
        console.error("Erro ao buscar total de clientes:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
exports.getTotalClientes = getTotalClientes;
const getAllClientes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientes = yield (0, client_service_1.getAllClientesDb)();
        res.status(200).json({ clientes });
    }
    catch (err) {
        console.error("Erro ao buscar clientes:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
exports.getAllClientes = getAllClientes;
