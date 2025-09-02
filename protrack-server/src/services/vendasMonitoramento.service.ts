import { db } from "../config/database";

// Interface para vendas vencidas
export interface VendaVencida {
  id: number;
  cliente_id: number;
  data_venda: string;
  dias_vencimento: number;
  status: string;
  total_com_desconto: number;
}

// Função para identificar vendas vencidas
export const identificarVendasVencidas = async (): Promise<VendaVencida[]> => {
  const sql = `
    SELECT 
      v.id,
      v.cliente_id,
      v.data_venda,
      v.dias_vencimento,
      v.status,
      v.total_com_desconto
    FROM vendas v
    WHERE v.forma_pagamento = 'aprazo'
      AND v.status NOT IN ('pago', 'cancelado', 'vencido')
      AND DATE_ADD(v.data_venda, INTERVAL v.dias_vencimento DAY) < CURDATE()
  `;

  const [rows]: any = await db.query(sql);
  return rows;
};

// Função para marcar vendas como vencidas
export const marcarVendasComoVencidas = async (
  vendasVencidas: VendaVencida[]
): Promise<void> => {
  if (vendasVencidas.length === 0) return;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    for (const venda of vendasVencidas) {
      // Atualiza status para vencido
      await connection.query(
        `UPDATE vendas SET status = 'vencido' WHERE id = ?`,
        [venda.id]
      );

      // Atualiza valor_a_pagar do cliente (mantém o valor pois ainda não foi pago)
      // O valor já está sendo controlado pelo sistema de vendas
      console.log(`Venda #${venda.id} marcada como vencida`);
    }

    await connection.commit();
    console.log(`${vendasVencidas.length} vendas marcadas como vencidas`);
  } catch (error) {
    await connection.rollback();
    console.error("Erro ao marcar vendas como vencidas:", error);
    throw error;
  } finally {
    connection.release();
  }
};

// Função principal de monitoramento que executa o processo completo
export const executarMonitoramentoVendas = async (): Promise<{
  vendasIdentificadas: number;
  vendasProcessadas: number;
  timestamp: Date;
}> => {
  try {
    console.log("Iniciando monitoramento de vendas vencidas...");

    // 1. Identifica vendas vencidas
    const vendasVencidas = await identificarVendasVencidas();

    if (vendasVencidas.length === 0) {
      console.log("Nenhuma venda vencida encontrada");
      return {
        vendasIdentificadas: 0,
        vendasProcessadas: 0,
        timestamp: new Date(),
      };
    }

    console.log(`${vendasVencidas.length} vendas vencidas identificadas`);

    // 2. Marca vendas como vencidas
    await marcarVendasComoVencidas(vendasVencidas);

    return {
      vendasIdentificadas: vendasVencidas.length,
      vendasProcessadas: vendasVencidas.length,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Erro durante monitoramento de vendas:", error);
    throw error;
  }
};

// Função para obter estatísticas de vendas vencidas
export const obterEstatisticasVendasVencidas = async (): Promise<{
  totalVencidas: number;
  valorTotalVencido: number;
  ultimaVerificacao?: Date;
}> => {
  try {
    const sql = `
      SELECT 
        COUNT(*) as total_vencidas,
        COALESCE(SUM(total_com_desconto), 0) as valor_total_vencido
      FROM vendas 
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
    console.error("Erro ao obter estatísticas de vendas vencidas:", error);
    throw error;
  }
};

// Função para limpar vendas vencidas antigas (opcional - para manutenção)
export const limparVendasVencidasAntigas = async (
  diasAntigos: number = 365
): Promise<number> => {
  try {
    const sql = `
      UPDATE vendas 
      SET status = 'arquivado' 
      WHERE status = 'vencido' 
        AND data_venda < DATE_SUB(CURDATE(), INTERVAL ? DAY)
    `;

    const [result]: any = await db.query(sql, [diasAntigos]);
    const vendasArquivadas = result.affectedRows || 0;

    console.log(`${vendasArquivadas} vendas vencidas arquivadas`);
    return vendasArquivadas;
  } catch (error) {
    console.error("Erro ao limpar vendas vencidas antigas:", error);
    throw error;
  }
};
