"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDistribuicaoMargemLucroController = exports.getValorInvestidoPorCategoriaController = exports.getEvolucaoLucroMensalController = exports.getMargemLucroTotalController = exports.getProdutosMelhorMargemLucroController = exports.produtosQuantidadeBaixaController = exports.getProdutosMaisVendidosController = exports.getGiroEstoqueController = exports.getTotalEstoquePrecoController = exports.getAllProdutos = exports.getTotalEstoque = exports.updateProduct = exports.createProduct = void 0;
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
        console.error("Erro ao buscar produtos:", err); // já tem, mas vamos confirmar que imprime
        res.status(500).json({ error: err.message }); // mostra a mensagem real
    }
};
exports.getAllProdutos = getAllProdutos;
const getTotalEstoquePrecoController = async (req, res) => {
    try {
        const total = await (0, product_service_1.getTotalPrecoEstoque)();
        res.status(200).json({ totalEstoque: total });
    }
    catch (err) {
        console.error("Erro ao calcular o total do estoque:", err);
        res.status(500).json({ error: err.message });
    }
};
exports.getTotalEstoquePrecoController = getTotalEstoquePrecoController;
const getGiroEstoqueController = async (req, res) => {
    try {
        const giro = await (0, product_service_1.calcularGiroEstoque)();
        res.status(200).json({ giroEstoque: giro });
    }
    catch (err) {
        console.error("Erro ao calcular o giro de estoque:", err);
        res.status(500).json({ error: err.message });
    }
};
exports.getGiroEstoqueController = getGiroEstoqueController;
const getProdutosMaisVendidosController = async (req, res) => {
    try {
        // Podemos aceitar um parâmetro 'limit' opcional na query string
        const limit = req.query.limit ? Number(req.query.limit) : 5;
        const produtos = await (0, product_service_1.getProdutosMaisVendidos)(limit);
        res.status(200).json({ produtos });
    }
    catch (err) {
        console.error("Erro ao buscar produtos mais vendidos:", err);
        res.status(500).json({ error: err.message });
    }
};
exports.getProdutosMaisVendidosController = getProdutosMaisVendidosController;
const produtosQuantidadeBaixaController = async (req, res) => {
    try {
        const total = await (0, product_service_1.contarProdutosQuantidadeBaixa)();
        res.json({ total });
    }
    catch (error) {
        console.error("Erro ao contar produtos:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};
exports.produtosQuantidadeBaixaController = produtosQuantidadeBaixaController;
const getProdutosMelhorMargemLucroController = async (req, res) => {
    try {
        // Podemos aceitar um parâmetro 'limit' opcional na query string
        const limit = req.query.limit ? Number(req.query.limit) : 5;
        const produtos = await (0, product_service_1.getProdutosMelhorMargemLucro)(limit);
        res.status(200).json({ produtos });
    }
    catch (err) {
        console.error("Erro ao buscar produtos com melhor margem de lucro:", err);
        res.status(500).json({ error: err.message });
    }
};
exports.getProdutosMelhorMargemLucroController = getProdutosMelhorMargemLucroController;
const getMargemLucroTotalController = async (req, res) => {
    try {
        const margemLucroTotal = await (0, product_service_1.getMargemLucroTotal)();
        res.status(200).json(margemLucroTotal);
    }
    catch (err) {
        console.error("Erro ao calcular margem de lucro total:", err);
        res.status(500).json({ error: err.message });
    }
};
exports.getMargemLucroTotalController = getMargemLucroTotalController;
const getEvolucaoLucroMensalController = async (req, res) => {
    try {
        // Podemos aceitar um parâmetro 'meses' opcional na query string
        const meses = req.query.meses ? Number(req.query.meses) : 12;
        const evolucao = await (0, product_service_1.getEvolucaoLucroMensal)(meses);
        res.status(200).json({ evolucao });
    }
    catch (err) {
        console.error("Erro ao buscar evolução do lucro mensal:", err);
        res.status(500).json({ error: err.message });
    }
};
exports.getEvolucaoLucroMensalController = getEvolucaoLucroMensalController;
const getValorInvestidoPorCategoriaController = async (req, res) => {
    try {
        const valorInvestidoPorCategoria = await (0, product_service_1.getValorInvestidoPorCategoria)();
        res.status(200).json({ categorias: valorInvestidoPorCategoria });
    }
    catch (err) {
        console.error("Erro ao calcular valor investido por categoria:", err);
        res.status(500).json({ error: err.message });
    }
};
exports.getValorInvestidoPorCategoriaController = getValorInvestidoPorCategoriaController;
const getDistribuicaoMargemLucroController = async (req, res) => {
    try {
        const distribuicaoMargemLucro = await (0, product_service_1.getDistribuicaoMargemLucro)();
        res.status(200).json(distribuicaoMargemLucro);
    }
    catch (err) {
        console.error("Erro ao calcular distribuição de margem de lucro:", err);
        res.status(500).json({ error: err.message });
    }
};
exports.getDistribuicaoMargemLucroController = getDistribuicaoMargemLucroController;
