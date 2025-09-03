const mysql = require("mysql2/promise");

async function testarQuery() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "protrack",
  });

  try {
    console.log("🔍 Testando queries do resumo...");

    // Testar cada query individualmente
    const queries = [
      "SELECT COALESCE(SUM(valor), 0) as total FROM contas_pagar WHERE status = 'pendente'",
      "SELECT COALESCE(SUM(valor), 0) as total FROM contas_pagar WHERE status = 'vencido'",
      "SELECT COALESCE(SUM(valor), 0) as total FROM contas_pagar WHERE status = 'agendado'",
      "SELECT COUNT(*) as total FROM contas_pagar WHERE status = 'vencido'",
    ];

    for (let i = 0; i < queries.length; i++) {
      const [rows] = await connection.execute(queries[i]);
      console.log(`Query ${i + 1}:`, queries[i]);
      console.log("Resultado:", rows[0]);
      console.log("---");
    }

    // Verificar todas as contas
    const [contas] = await connection.execute(
      "SELECT status, valor FROM contas_pagar"
    );
    console.log("📋 Todas as contas:");
    contas.forEach((conta) => {
      console.log(`  - Status: ${conta.status}, Valor: ${conta.valor}`);
    });
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await connection.end();
  }
}

testarQuery();
