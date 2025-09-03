"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = __importDefault(require("./user.routes"));
const productRoutes_1 = __importDefault(require("./productRoutes"));
const clientRoutes_1 = __importDefault(require("./clientRoutes"));
const vendasRoutes_1 = __importDefault(require("./vendasRoutes"));
const configRoutes_1 = __importDefault(require("./configRoutes"));
const relatorioRoutes_1 = __importDefault(require("./relatorioRoutes"));
const vendasMonitoramentoRoutes_1 = __importDefault(require("./vendasMonitoramentoRoutes"));
const fluxoCaixaRoutes_1 = __importDefault(require("./fluxoCaixaRoutes"));
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.send("API Online ✅");
});
router.use("/login", user_routes_1.default);
router.use("/users", user_routes_1.default);
router.use("/product", productRoutes_1.default);
router.use("/clients", clientRoutes_1.default);
router.use("/vendas", vendasRoutes_1.default);
router.use("/config", configRoutes_1.default);
router.use("/relatorios", relatorioRoutes_1.default);
router.use("/monitoramento", vendasMonitoramentoRoutes_1.default);
router.use("/fluxo-caixa", fluxoCaixaRoutes_1.default);
exports.default = router;
