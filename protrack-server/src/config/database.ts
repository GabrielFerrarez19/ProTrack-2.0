// db.ts
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

// Teste a conexão
(async () => {
  try {
    const conn = await db.getConnection();
    console.log("Banco de dados conectado ✅");
    conn.release();
  } catch (err) {
    console.error("Erro ao conectar ao banco:", err);
  }
})();
