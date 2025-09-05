"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.listAllUsers = exports.changeUserStatus = exports.updateUserById = exports.updateCurrentUser = exports.getUserById = exports.getCurrentUser = void 0;
const user_service_1 = require("../services/user.service");
const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Usuário não autenticado" });
        }
        return res.status(200).json({
            success: true,
            user: req.user,
        });
    }
    catch (error) {
        console.error("Erro ao buscar usuário atual:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};
exports.getCurrentUser = getCurrentUser;
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await (0, user_service_1.findUserById)(BigInt(id));
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        return res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        console.error("Erro ao buscar usuário:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};
exports.getUserById = getUserById;
const updateCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Usuário não autenticado" });
        }
        const { name, email, username, role, empresa_id, departamento_id } = req.body;
        const updateData = {
            name,
            email,
            username,
            role,
            empresa_id: empresa_id ? BigInt(empresa_id) : undefined,
            departamento_id: departamento_id ? BigInt(departamento_id) : undefined,
        };
        const result = await (0, user_service_1.updateUser)(BigInt(req.user.id), updateData, BigInt(req.user.id));
        return res.status(200).json({
            success: true,
            message: result.message,
        });
    }
    catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};
exports.updateCurrentUser = updateCurrentUser;
const updateUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, username, role, empresa_id, departamento_id } = req.body;
        const updateData = {
            name,
            email,
            username,
            role,
            empresa_id: empresa_id ? BigInt(empresa_id) : undefined,
            departamento_id: departamento_id ? BigInt(departamento_id) : undefined,
        };
        const result = await (0, user_service_1.updateUser)(BigInt(id), updateData, req.user?.id ? BigInt(req.user.id) : undefined);
        return res.status(200).json({
            success: true,
            message: result.message,
        });
    }
    catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};
exports.updateUserById = updateUserById;
const changeUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!["ativo", "inativo", "bloqueado"].includes(status)) {
            return res.status(400).json({
                error: "Status inválido. Use: ativo, inativo ou bloqueado",
            });
        }
        const result = await (0, user_service_1.updateUserStatus)(BigInt(id), status, req.user?.id ? BigInt(req.user.id) : undefined);
        return res.status(200).json({
            success: true,
            message: result.message,
        });
    }
    catch (error) {
        console.error("Erro ao alterar status do usuário:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};
exports.changeUserStatus = changeUserStatus;
const listAllUsers = async (req, res) => {
    try {
        const users = await (0, user_service_1.getAllUsers)();
        return res.status(200).json({
            success: true,
            users,
            total: users.length,
        });
    }
    catch (error) {
        console.error("Erro ao listar usuários:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};
exports.listAllUsers = listAllUsers;
const logout = async (req, res) => {
    try {
        // Em um sistema mais robusto, você poderia invalidar o token aqui
        // Por enquanto, apenas retornamos sucesso
        return res.status(200).json({
            success: true,
            message: "Logout realizado com sucesso",
        });
    }
    catch (error) {
        console.error("Erro ao fazer logout:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};
exports.logout = logout;
