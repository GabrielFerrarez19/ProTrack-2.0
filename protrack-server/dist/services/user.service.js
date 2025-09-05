"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getAllUsers = exports.updateUserStatus = exports.updateLastLogin = exports.findUserById = exports.findUserByEmail = exports.findUserByEmailAndPassword = exports.createUser = void 0;
// userService.ts
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../config/database");
const createUser = async (userData) => {
    const { name, email, password, username, role = "user", empresa_id, departamento_id, criado_por, } = userData;
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const query = `
    INSERT INTO users (
      name, email, password_hash, username, role, 
      empresa_id, departamento_id, criado_por
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
    await database_1.db.execute(query, [
        name,
        email,
        hashedPassword,
        username || null,
        role,
        empresa_id || null,
        departamento_id || null,
        criado_por || null,
    ]);
    return { message: "Usuário criado com sucesso!" };
};
exports.createUser = createUser;
const findUserByEmailAndPassword = async (email, password) => {
    const [rows] = await database_1.db.execute("SELECT * FROM users WHERE email = ? AND status = 'ativo' LIMIT 1", [email]);
    if (rows.length === 0)
        return null;
    const user = rows[0];
    const isMatch = await bcrypt_1.default.compare(password, user.password_hash);
    if (!isMatch)
        return null;
    // Atualizar último login
    await (0, exports.updateLastLogin)(user.id);
    // Remover password_hash da resposta e converter bigint para string
    const { password_hash, ...userWithoutPassword } = user;
    // Converter bigint para string para compatibilidade com frontend
    return {
        ...userWithoutPassword,
        id: userWithoutPassword.id.toString(),
        empresa_id: userWithoutPassword.empresa_id?.toString(),
        departamento_id: userWithoutPassword.departamento_id?.toString(),
        criado_por: userWithoutPassword.criado_por?.toString(),
        atualizado_por: userWithoutPassword.atualizado_por?.toString(),
    };
};
exports.findUserByEmailAndPassword = findUserByEmailAndPassword;
const findUserByEmail = async (email) => {
    const [rows] = await database_1.db.execute("SELECT * FROM users WHERE email = ? AND status = 'ativo' LIMIT 1", [email]);
    if (rows.length === 0)
        return null;
    const { password_hash, ...user } = rows[0];
    // Converter bigint para string para compatibilidade com frontend
    return {
        ...user,
        id: user.id.toString(),
        empresa_id: user.empresa_id?.toString(),
        departamento_id: user.departamento_id?.toString(),
        criado_por: user.criado_por?.toString(),
        atualizado_por: user.atualizado_por?.toString(),
    };
};
exports.findUserByEmail = findUserByEmail;
const findUserById = async (id) => {
    const [rows] = await database_1.db.execute("SELECT * FROM users WHERE id = ? AND status = 'ativo' LIMIT 1", [id]);
    if (rows.length === 0)
        return null;
    const { password_hash, ...user } = rows[0];
    // Converter bigint para string para compatibilidade com frontend
    return {
        ...user,
        id: user.id.toString(),
        empresa_id: user.empresa_id?.toString(),
        departamento_id: user.departamento_id?.toString(),
        criado_por: user.criado_por?.toString(),
        atualizado_por: user.atualizado_por?.toString(),
    };
};
exports.findUserById = findUserById;
const updateLastLogin = async (userId) => {
    await database_1.db.execute("UPDATE users SET ultimo_login = NOW() WHERE id = ?", [
        userId,
    ]);
};
exports.updateLastLogin = updateLastLogin;
const updateUserStatus = async (userId, status, atualizado_por) => {
    await database_1.db.execute("UPDATE users SET status = ?, atualizado_por = ?, updated_at = NOW() WHERE id = ?", [status, atualizado_por || null, userId]);
    return { message: "Status do usuário atualizado com sucesso!" };
};
exports.updateUserStatus = updateUserStatus;
const getAllUsers = async () => {
    const [rows] = await database_1.db.execute("SELECT id, name, email, username, role, status, empresa_id, departamento_id, ultimo_login, criado_por, atualizado_por, created_at, updated_at FROM users ORDER BY created_at DESC");
    // Converter bigint para string para compatibilidade com frontend
    return rows.map((user) => ({
        ...user,
        id: user.id.toString(),
        empresa_id: user.empresa_id?.toString(),
        departamento_id: user.departamento_id?.toString(),
        criado_por: user.criado_por?.toString(),
        atualizado_por: user.atualizado_por?.toString(),
    }));
};
exports.getAllUsers = getAllUsers;
const updateUser = async (userId, updateData, atualizado_por) => {
    const allowedFields = [
        "name",
        "email",
        "username",
        "role",
        "empresa_id",
        "departamento_id",
    ];
    const updates = [];
    const values = [];
    for (const [key, value] of Object.entries(updateData)) {
        if (allowedFields.includes(key) && value !== undefined) {
            updates.push(`${key} = ?`);
            values.push(value);
        }
    }
    if (updates.length === 0) {
        throw new Error("Nenhum campo válido para atualização");
    }
    updates.push("atualizado_por = ?", "updated_at = NOW()");
    values.push(atualizado_por || null, userId);
    const query = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
    await database_1.db.execute(query, values);
    return { message: "Usuário atualizado com sucesso!" };
};
exports.updateUser = updateUser;
