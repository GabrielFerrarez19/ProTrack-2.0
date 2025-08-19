import mysql from "mysql2/promise";

export const db = mysql.createPool({
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
    const conn = await db.getConnection();
    console.log("Banco de dados conectado ✅");
    conn.release();
  } catch (err) {
    console.error("Erro ao conectar ao banco:", err);
  }
})();
