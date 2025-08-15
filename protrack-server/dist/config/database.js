"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
// db.ts
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let db;
if (process.env.DATABASE_URL) {
    // Se DATABASE_URL estiver definida, conecta usando ela
    exports.db = db = promise_1.default.createPool(process.env.DATABASE_URL);
}
else {
    // Caso contrário, usa variáveis separadas
    exports.db = db = promise_1.default.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_DATABASE,
    });
}
