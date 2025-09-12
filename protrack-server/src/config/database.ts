import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "dbprotrack.crgu2cuw8qsn.sa-east-1.rds.amazonaws.com", // IP público da EC2
  user: "app_user", // usuário que você criou
  password: "Pr0Tr@ckBR", // senha correta
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
