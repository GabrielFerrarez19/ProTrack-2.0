import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "caboose.proxy.rlwy.net",
  user: "root",
  password: "BOwuyhBlulgOsPBiNVszpLGGmPQceMaH",
  database: "protrack",
  port: 44969,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
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
