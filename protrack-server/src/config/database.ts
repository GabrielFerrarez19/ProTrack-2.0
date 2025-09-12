import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost", // IP público da EC2
  user: "root", // usuário que você criou
  password: "gabri1234", // senha correta
  database: "protrack",
  port: 3306, // porta padrão do MySQL
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
