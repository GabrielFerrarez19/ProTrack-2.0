"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
exports.db = promise_1.default.createPool({
    host: "localhost",
    user: "root",
    password: "gabri1234",
    database: "protrack",
    port: 3306,
    authPlugins: {
        mysql_clear_password: () => () => Buffer.from("gabri1234\0"),
    },
});
// Teste a conexão
(async () => {
    try {
        const conn = await exports.db.getConnection();
        console.log("Banco de dados conectado ✅");
        conn.release();
    }
    catch (err) {
        console.error("Erro ao conectar ao banco:", err);
    }
})();
