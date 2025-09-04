"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.limparContasVencidasAntigas = exports.obterEstatisticasContasVencidas = exports.executarMonitoramentoContasPagar = exports.marcarContasComoVencidas = exports.identificarContasVencidas = void 0;
const database_1 = require("../config/database");
// Função para identificar contas a pagar vencidas
const identificarContasVencidas = async () => {
    const sql = `
    SELECT 
      cp.id,
      cp.fornecedor_nome,
      cp.data_vencimento,
      cp.valor,
      cp.status,
      cp.descricao,
      cp.categoria_id
    FROM contas_pagar cp
    WHERE cp.status NOT IN ('pago', 'cancelado', 'vencido', 'arquivado')
      AND cp.data_vencimento < CURDATE()
  `;
    const [rows] = await database_1.db.query(sql);
    return rows;
};
exports.identificarContasVencidas = identificarContasVencidas;
// Função para marcar contas como vencidas
const marcarContasComoVencidas = async (contasVencidas) => {
    if (contasVencidas.length === 0)
        return;
    const connection = await database_1.db.getConnection();
    try {
        await connection.beginTransaction();
        for (const conta of contasVencidas) {
            // Atualiza status para vencido
            await connection.query(`UPDATE contas_pagar SET status = 'vencido' WHERE id = ?`, [conta.id]);
            console.log(`Conta #${conta.id} do fornecedor ${conta.fornecedor_nome} marcada como vencida`);
        }
        await connection.commit();
        console.log(`${contasVencidas.length} contas marcadas como vencidas`);
    }
    catch (error) {
        await connection.rollback();
        console.error("Erro ao marcar contas como vencidas:", error);
        throw error;
    }
    finally {
        connection.release();
    }
};
exports.marcarContasComoVencidas = marcarContasComoVencidas;
// Função principal de monitoramento que executa o processo completo
const executarMonitoramentoContasPagar = async () => {
    try {
        console.log("Iniciando monitoramento de contas a pagar vencidas...");
        // 1. Identifica contas vencidas
        const contasVencidas = await (0, exports.identificarContasVencidas)();
        if (contasVencidas.length === 0) {
            console.log("Nenhuma conta vencida encontrada");
            return {
                contasIdentificadas: 0,
                contasProcessadas: 0,
                timestamp: new Date(),
            };
        }
        console.log(`${contasVencidas.length} contas vencidas identificadas`);
        // 2. Marca contas como vencidas
        await (0, exports.marcarContasComoVencidas)(contasVencidas);
        return {
            contasIdentificadas: contasVencidas.length,
            contasProcessadas: contasVencidas.length,
            timestamp: new Date(),
        };
    }
    catch (error) {
        console.error("Erro durante monitoramento de contas:", error);
        throw error;
    }
};
exports.executarMonitoramentoContasPagar = executarMonitoramentoContasPagar;
// Função para obter estatísticas de contas vencidas
const obterEstatisticasContasVencidas = async () => {
    try {
        const sql = `
      SELECT 
        COUNT(*) as total_vencidas,
        COALESCE(SUM(valor), 0) as valor_total_vencido
      FROM contas_pagar 
      WHERE status = 'vencido'
    `;
        const [rows] = await database_1.db.query(sql);
        const row = rows[0];
        return {
            totalVencidas: row.total_vencidas || 0,
            valorTotalVencido: row.valor_total_vencido || 0,
            ultimaVerificacao: new Date(),
        };
    }
    catch (error) {
        console.error("Erro ao obter estatísticas de contas vencidas:", error);
        throw error;
    }
};
exports.obterEstatisticasContasVencidas = obterEstatisticasContasVencidas;
// Função para limpar contas vencidas antigas (opcional - para manutenção)
const limparContasVencidasAntigas = async (diasAntigos = 365) => {
    try {
        const sql = `
      UPDATE contas_pagar 
      SET status = 'arquivado' 
      WHERE status = 'vencido' 
        AND data_vencimento < DATE_SUB(CURDATE(), INTERVAL ? DAY)
    `;
        const [result] = await database_1.db.query(sql, [diasAntigos]);
        const contasArquivadas = result.affectedRows || 0;
        console.log(`${contasArquivadas} contas vencidas arquivadas`);
        return contasArquivadas;
    }
    catch (error) {
        console.error("Erro ao limpar contas vencidas antigas:", error);
        throw error;
    }
};
exports.limparContasVencidasAntigas = limparContasVencidasAntigas;
