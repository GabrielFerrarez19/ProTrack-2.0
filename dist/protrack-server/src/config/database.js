"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
exports.db = promise_1.default.createPool({
    host: "localhost", // conecta na própria EC2
    user: "root", // usuário que você configurou
    password: "gabri1234", // senha definida
    port: 3306, // porta padrão do MySQL
    database: "protrack", // banco que você criou
});
