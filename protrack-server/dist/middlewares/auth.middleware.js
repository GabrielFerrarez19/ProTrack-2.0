"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.requireRole = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_service_1 = require("../services/user.service");
const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta_super_segura_aqui";
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
        if (!token) {
            return res.status(401).json({ error: "Token de acesso necessário" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await (0, user_service_1.findUserById)(BigInt(decoded.userId));
        if (!user) {
            return res.status(401).json({ error: "Usuário não encontrado" });
        }
        if (user.status !== "ativo") {
            return res.status(401).json({ error: "Usuário inativo" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Erro na autenticação:", error);
        return res.status(403).json({ error: "Token inválido" });
    }
};
exports.authenticateToken = authenticateToken;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Usuário não autenticado" });
        }
        if (!roles.includes(req.user.role)) {
            return res
                .status(403)
                .json({ error: "Acesso negado. Permissão insuficiente." });
        }
        next();
    };
};
exports.requireRole = requireRole;
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId: userId.toString() }, JWT_SECRET, {
        expiresIn: "24h",
    });
};
exports.generateToken = generateToken;
