"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const productRoutes_1 = __importDefault(require("./productRoutes"));
const clientRoutes_1 = __importDefault(require("./clientRoutes"));
const vendasRoutes_1 = __importDefault(require("./vendasRoutes"));
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.send("API Online ✅");
});
router.use("/login", authRoutes_1.default);
router.use("/users", user_routes_1.default);
router.use("/product", productRoutes_1.default);
router.use("/clients", clientRoutes_1.default);
router.use("/vendas", vendasRoutes_1.default);
exports.default = router;
