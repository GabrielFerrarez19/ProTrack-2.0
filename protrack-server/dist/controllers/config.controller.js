"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removerCategoria = exports.atualizarCategoria = exports.criarCategoria = exports.listarCategorias = exports.getMetodosPagamentoAtivosController = exports.toggleMetodoPagamentoController = exports.getMetodosPagamentoConfig = void 0;
const config_service_1 = require("../services/config.service");
// Controller: retorna todos os métodos de pagamento
const getMetodosPagamentoConfig = async (req, res) => {
    try {
        const metodos = await (0, config_service_1.getMetodosPagamento)();
        res.status(200).json(metodos);
    }
    catch (error) {
        console.error("Erro ao buscar métodos de pagamento:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
};
exports.getMetodosPagamentoConfig = getMetodosPagamentoConfig;
// controller
const toggleMetodoPagamentoController = async (req, res) => {
    const { id } = req.params;
    const { ativo } = req.body; // aqui deve vir true/false
    if (ativo === undefined) {
        return res.status(400).json({ error: "Campo 'ativo' é obrigatório" });
    }
    // chama o service com o valor real
    await (0, config_service_1.toggleMetodoPagamento)(Number(id), ativo);
    res.status(200).json({ message: "Método atualizado com sucesso" });
};
exports.toggleMetodoPagamentoController = toggleMetodoPagamentoController;
const getMetodosPagamentoAtivosController = async (req, res) => {
    const metodosAtivos = await (0, config_service_1.getMetodosPagamentoAtivos)();
    res.json(metodosAtivos);
};
exports.getMetodosPagamentoAtivosController = getMetodosPagamentoAtivosController;
// GET /categorias
const listarCategorias = async (req, res) => {
    try {
        const categorias = await (0, config_service_1.getCategorias)();
        res.json(categorias);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao listar categorias" });
    }
};
exports.listarCategorias = listarCategorias;
// POST /categorias
const criarCategoria = async (req, res) => {
    try {
        const { id, nome, tipo, cor } = req.body;
        if (!id || !nome || !tipo || !cor) {
            return res.status(400).json({ message: "Dados incompletos" });
        }
        await (0, config_service_1.addCategoria)({ id, nome, tipo, cor });
        res.status(201).json({ message: "Categoria criada com sucesso" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao criar categoria" });
    }
};
exports.criarCategoria = criarCategoria;
// PUT /categorias/:id
const atualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, tipo, cor } = req.body;
        if (!nome || !tipo || !cor) {
            return res.status(400).json({ message: "Dados incompletos" });
        }
        await (0, config_service_1.updateCategoria)({ id, nome, tipo, cor });
        res.json({ message: "Categoria atualizada com sucesso" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao atualizar categoria" });
    }
};
exports.atualizarCategoria = atualizarCategoria;
// DELETE /categorias/:id
const removerCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        await (0, config_service_1.deleteCategoria)(id);
        res.json({ message: "Categoria removida com sucesso" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao remover categoria" });
    }
};
exports.removerCategoria = removerCategoria;
