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
const express_1 = require("express");
const database_1 = require("../config/database");
const router = (0, express_1.Router)();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log("Requisição login:", { email, password });
    try {
        const [rows] = yield database_1.db.execute("SELECT * FROM users WHERE email = ?", [email]);
        const user = rows.length > 0 ? rows[0] : null;
        console.log("Usuário encontrado:", user);
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        // Comparação direta sem bcrypt
        if (password !== user.password) {
            return res.status(401).json({ error: "Senha incorreta" });
        }
        return res.json({
            message: "Login realizado com sucesso",
            user: { id: user.id, name: user.name, email: user.email },
        });
    }
    catch (error) {
        console.error("Erro ao autenticar:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}));
exports.default = router;
