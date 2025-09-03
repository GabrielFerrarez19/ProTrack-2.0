import { db } from "../config/database";

// Interface para contas a pagar vencidas
export interface ContaPagarVencida {
  id: number;
  fornecedor_nome: string;
  data_vencimento: string;
  valor: number;
  status: string;
  descricao: string;
  categoria_id: number;
}

// Função para identificar contas a pagar vencidas
export const identificarContasVencidas = async (): Promise<
  ContaPagarVencida[]
> => {
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

  const [rows]: any = await db.query(sql);
  return rows;
};

// Função para marcar contas como vencidas
export const marcarContasComoVencidas = async (
  contasVencidas: ContaPagarVencida[]
): Promise<void> => {
  if (contasVencidas.length === 0) return;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    for (const conta of contasVencidas) {
      // Atualiza status para vencido
      await connection.query(
        `UPDATE contas_pagar SET status = 'vencido' WHERE id = ?`,
        [conta.id]
      );

      console.log(
        `Conta #${conta.id} do fornecedor ${conta.fornecedor_nome} marcada como vencida`
      );
    }

    await connection.commit();
    console.log(`${contasVencidas.length} contas marcadas como vencidas`);
  } catch (error) {
    await connection.rollback();
    console.error("Erro ao marcar contas como vencidas:", error);
    throw error;
  } finally {
    connection.release();
  }
};

// Função principal de monitoramento que executa o processo completo
export const executarMonitoramentoContasPagar = async (): Promise<{
  contasIdentificadas: number;
  contasProcessadas: number;
  timestamp: Date;
}> => {
  try {
    console.log("Iniciando monitoramento de contas a pagar vencidas...");

    // 1. Identifica contas vencidas
    const contasVencidas = await identificarContasVencidas();

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
    await marcarContasComoVencidas(contasVencidas);

    return {
      contasIdentificadas: contasVencidas.length,
      contasProcessadas: contasVencidas.length,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Erro durante monitoramento de contas:", error);
    throw error;
  }
};

// Função para obter estatísticas de contas vencidas
export const obterEstatisticasContasVencidas = async (): Promise<{
  totalVencidas: number;
  valorTotalVencido: number;
  ultimaVerificacao?: Date;
}> => {
  try {
    const sql = `
      SELECT 
        COUNT(*) as total_vencidas,
        COALESCE(SUM(valor), 0) as valor_total_vencido
      FROM contas_pagar 
      WHERE status = 'vencido'
    `;

    const [rows]: any = await db.query(sql);
    const row = rows[0];

    return {
      totalVencidas: row.total_vencidas || 0,
      valorTotalVencido: row.valor_total_vencido || 0,
      ultimaVerificacao: new Date(),
    };
  } catch (error) {
    console.error("Erro ao obter estatísticas de contas vencidas:", error);
    throw error;
  }
};

// Função para limpar contas vencidas antigas (opcional - para manutenção)
export const limparContasVencidasAntigas = async (
  diasAntigos: number = 365
): Promise<number> => {
  try {
    const sql = `
      UPDATE contas_pagar 
      SET status = 'arquivado' 
      WHERE status = 'vencido' 
        AND data_vencimento < DATE_SUB(CURDATE(), INTERVAL ? DAY)
    `;

    const [result]: any = await db.query(sql, [diasAntigos]);
    const contasArquivadas = result.affectedRows || 0;

    console.log(`${contasArquivadas} contas vencidas arquivadas`);
    return contasArquivadas;
  } catch (error) {
    console.error("Erro ao limpar contas vencidas antigas:", error);
    throw error;
  }
};
