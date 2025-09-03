const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "gabri1234",
  database: "protrack",
  port: 3306,
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from("gabri1234\0"),
  },
});

async function atualizarStatusContas() {
  try {
    console.log("🔄 Iniciando atualização de status das contas...");

    const hoje = new Date();

    // Marcar contas vencidas
    const [contasVencidas] = await db.execute(
      `UPDATE contas_pagar 
       SET status = 'vencido', atualizado_em = ? 
       WHERE status = 'pendente' AND data_vencimento < ?`,
      [hoje, hoje]
    );

    console.log(
      `✅ ${contasVencidas.affectedRows} contas marcadas como vencidas`
    );

    // Marcar contas agendadas como pendentes quando chegar a data
    const [contasAgendadas] = await db.execute(
      `UPDATE contas_pagar 
       SET status = 'pendente', atualizado_em = ? 
       WHERE status = 'agendado' AND data_agendamento <= ?`,
      [hoje, hoje]
    );

    console.log(
      `✅ ${contasAgendadas.affectedRows} contas agendadas marcadas como pendentes`
    );

    // Buscar contas vencidas para relatório
    const [contasVencidasCount] = await db.execute(
      "SELECT COUNT(*) as total FROM contas_pagar WHERE status = 'vencido'"
    );

    const [totalVencido] = await db.execute(
      "SELECT COALESCE(SUM(valor), 0) as total FROM contas_pagar WHERE status = 'vencido'"
    );

    console.log(
      `📊 Resumo: ${
        contasVencidasCount[0].total
      } contas vencidas totalizando R$ ${(totalVencido[0].total || 0).toFixed(
        2
      )}`
    );

    console.log("✅ Atualização de status concluída com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao atualizar status das contas:", error);
  } finally {
    await db.end();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  atualizarStatusContas();
}

module.exports = { atualizarStatusContas };
