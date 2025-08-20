"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProdutos = exports.getTotalEstoque = exports.updateProduct = exports.createProduct = void 0;
const product_service_1 = require("../services/product.service");
const createProduct = async (req, res) => {
    const produto = req.body;
    if (!produto.nome ||
        produto.preco_custo === undefined ||
        produto.preco_venda === undefined) {
        return res.status(400).json({
            error: "Nome, preço de custo e preço de venda são obrigatórios",
        });
    }
    try {
        const id = await (0, product_service_1.createProductDb)(produto);
        res.status(201).json({ message: "Produto criado com sucesso", id });
    }
    catch (err) {
        console.error("Erro ao criar produto:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    const id = Number(req.params.id);
    const produto = req.body;
    if (!id ||
        !produto.nome ||
        produto.preco_custo === undefined ||
        produto.preco_venda === undefined) {
        return res.status(400).json({
            error: "ID, nome, preço de custo e preço de venda são obrigatórios",
        });
    }
    try {
        await (0, product_service_1.updateProductDb)(id, produto);
        res.status(200).json({ message: "Produto atualizado com sucesso" });
    }
    catch (err) {
        if (err.message === "Produto não encontrado")
            return res.status(404).json({ error: err.message });
        console.error("Erro ao atualizar produto:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};
exports.updateProduct = updateProduct;
const getTotalEstoque = async (req, res) => {
    try {
        const total = await (0, product_service_1.getTotalEstoqueDb)();
        res.status(200).json({ totalEstoque: total });
    }
    catch (err) {
        console.error("Erro ao buscar total do estoque:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};
exports.getTotalEstoque = getTotalEstoque;
const getAllProdutos = async (req, res) => {
    try {
        const produtos = await (0, product_service_1.getAllProdutosDb)();
        res.status(200).json(produtos);
    }
    catch (err) {
        console.error("Erro ao buscar produtos:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};
exports.getAllProdutos = getAllProdutos;
