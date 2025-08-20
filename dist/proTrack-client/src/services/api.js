"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.atualizarVenda = exports.fetchAllVendas = exports.fetchTotalVendas = exports.atualizarCliente = exports.fetchAllClientes = exports.fetchTotalClientes = exports.cadastrarCliente = exports.fetchAllProdutos = exports.fetchTotalEstoque = exports.atualizarProduto = exports.cadastrarProduto = exports.loginUser = void 0;
exports.criarVenda = criarVenda;
const axios_1 = __importDefault(require("axios"));
// Instância Axios central
const api = axios_1.default.create({
    baseURL: "http://localhost:8085",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 5000,
});
// Interceptor global de erros (opcional)
api.interceptors.response.use((response) => response, (error) => {
    const err = error;
    return Promise.reject(err.response?.data || { error: "Erro desconhecido" });
});
const loginUser = async (email, password) => {
    const response = await api.post("/login", { email, password });
    return response.data;
};
exports.loginUser = loginUser;
const cadastrarProduto = async (produto) => {
    const response = await api.post("/product/produtos", produto);
    return response.data;
};
exports.cadastrarProduto = cadastrarProduto;
const atualizarProduto = async (produto) => {
    if (!produto.id)
        throw { error: "ID do produto é obrigatório para atualização" };
    const response = await api.put(`/product/produtos/${produto.id}`, produto);
    return response.data;
};
exports.atualizarProduto = atualizarProduto;
const fetchTotalEstoque = async () => {
    const response = await api.get("/product/produtos/estoque-total");
    return response.data;
};
exports.fetchTotalEstoque = fetchTotalEstoque;
const fetchAllProdutos = async () => {
    const response = await api.get("/product/produtos/todos");
    return response.data;
};
exports.fetchAllProdutos = fetchAllProdutos;
const cadastrarCliente = async (cliente) => {
    const response = await api.post("/clients/clientes", cliente);
    return response.data;
};
exports.cadastrarCliente = cadastrarCliente;
const fetchTotalClientes = async () => {
    const response = await api.get("/clients/clientes/total");
    return response.data;
};
exports.fetchTotalClientes = fetchTotalClientes;
const fetchAllClientes = async () => {
    const response = await api.get("/clients/clientes/todos");
    return response.data;
};
exports.fetchAllClientes = fetchAllClientes;
const atualizarCliente = async (id, cliente) => {
    if (!id)
        throw { error: "ID do cliente é obrigatório para atualização" };
    const response = await api.put(`/clients/altera/${id}`, cliente);
    return response.data;
};
exports.atualizarCliente = atualizarCliente;
async function criarVenda(data) {
    const response = await api.post("/vendas/cadvendas", data);
    return response.data;
}
const fetchTotalVendas = async () => {
    const response = await api.get("/vendas/totalvendas");
    return response.data;
};
exports.fetchTotalVendas = fetchTotalVendas;
const fetchAllVendas = async () => {
    const response = await api.get("/vendas/todas");
    return response.data;
};
exports.fetchAllVendas = fetchAllVendas;
const atualizarVenda = async (id, venda) => {
    const response = await api.put(`/vendas/altera/${id}`, venda);
    return response.data;
};
exports.atualizarVenda = atualizarVenda;
