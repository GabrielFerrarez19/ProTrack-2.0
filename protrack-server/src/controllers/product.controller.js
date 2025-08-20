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
exports.getAllProdutos = exports.getTotalEstoque = exports.updateProduct = exports.createProduct = void 0;
const product_service_1 = require("../services/product.service");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const produto = req.body;
    if (!produto.nome ||
        produto.preco_custo === undefined ||
        produto.preco_venda === undefined) {
        return res.status(400).json({
            error: "Nome, preço de custo e preço de venda são obrigatórios",
        });
    }
    try {
        const id = yield (0, product_service_1.createProductDb)(produto);
        res.status(201).json({ message: "Produto criado com sucesso", id });
    }
    catch (err) {
        console.error("Erro ao criar produto:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield (0, product_service_1.updateProductDb)(id, produto);
        res.status(200).json({ message: "Produto atualizado com sucesso" });
    }
    catch (err) {
        if (err.message === "Produto não encontrado")
            return res.status(404).json({ error: err.message });
        console.error("Erro ao atualizar produto:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
exports.updateProduct = updateProduct;
const getTotalEstoque = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const total = yield (0, product_service_1.getTotalEstoqueDb)();
        res.status(200).json({ totalEstoque: total });
    }
    catch (err) {
        console.error("Erro ao buscar total do estoque:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
exports.getTotalEstoque = getTotalEstoque;
const getAllProdutos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const produtos = yield (0, product_service_1.getAllProdutosDb)();
        res.status(200).json(produtos);
    }
    catch (err) {
        console.error("Erro ao buscar produtos:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
exports.getAllProdutos = getAllProdutos;
