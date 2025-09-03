"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
// Configura CORS para permitir requisições do frontend Vite
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
// Middleware para JSON
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Todas as rotas
app.use("/", routes_1.default);
// Porta fixa
const PORT = 8085;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
// Captura erros não tratados
process.on("uncaughtException", (err) => {
    console.error("Erro não tratado:", err);
});
