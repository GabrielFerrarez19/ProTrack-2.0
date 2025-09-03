"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmailAndPassword = exports.createUser = void 0;
// userService.ts
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../config/database");
const createUser = async (name, email, password) => {
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    await database_1.db.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);
    return { message: "Usuário criado com sucesso!" };
};
exports.createUser = createUser;
const findUserByEmailAndPassword = async (email, password) => {
    const [rows] = await database_1.db.execute("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
    if (rows.length === 0)
        return null;
    const user = rows[0];
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch)
        return null;
    return user;
};
exports.findUserByEmailAndPassword = findUserByEmailAndPassword;
