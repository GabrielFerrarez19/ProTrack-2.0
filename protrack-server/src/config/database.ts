// db.ts
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let db;

if (process.env.DATABASE_URL) {
  // Se DATABASE_URL estiver definida, conecta usando ela
  db = mysql.createPool(process.env.DATABASE_URL);
} else {
  // Caso contrário, usa variáveis separadas
  db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
  });
}

export { db };
