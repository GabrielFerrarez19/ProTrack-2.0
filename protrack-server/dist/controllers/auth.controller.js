"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserController = exports.login = void 0;
const user_service_1 = require("../services/user.service");
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await (0, user_service_1.findUserByEmailAndPassword)(email, password);
        if (!user) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }
        return res.status(200).json({ message: "Login bem-sucedido", user });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};
exports.login = login;
const createUserController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ error: "Nome, email e senha são obrigatórios." });
        }
        const result = await (0, user_service_1.createUser)(name, email, password);
        return res.status(201).json(result);
    }
    catch (error) {
        console.error("Erro ao criar usuário:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
};
exports.createUserController = createUserController;
