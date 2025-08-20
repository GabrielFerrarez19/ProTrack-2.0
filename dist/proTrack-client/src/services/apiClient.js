"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiClient = void 0;
// services/apiClient.ts
const axios_1 = __importDefault(require("axios"));
exports.apiClient = axios_1.default.create({
    baseURL: "http://localhost:8085",
    timeout: 5000, // timeout em ms
    headers: {
        "Content-Type": "application/json",
    },
});
// Interceptor de erro global (opcional)
exports.apiClient.interceptors.response.use((response) => response, (error) => {
    console.error("Erro na requisição:", error.response?.data || error.message);
    return Promise.reject(error.response?.data || { error: "Erro desconhecido" });
});
