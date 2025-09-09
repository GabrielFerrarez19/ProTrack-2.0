import {
  FluxoCaixaItem,
  CategoriaFluxo,
  ComparativoPeriodo,
  ResumoFluxoCaixa,
} from "../@types/types.service";
import { db } from "../config/database";

const calcularDiasPeriodo = (periodo: string): number => {
  switch (periodo) {
    case "7dias":
      return 7;
    case "30dias":
      return 30;
    case "90dias":
      return 90;
    case "1ano":
      return 365;
    default:
      return 30;
  }
};

const formatarDataParaVisualizacao = (
  data: Date,
  tipoVisualizacao: string
): string => {
  switch (tipoVisualizacao) {
    case "diario":
      return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
    case "semanal":
      const semana = Math.ceil(data.getDate() / 7);
      return `Sem ${semana}/${data.getMonth() + 1}`;
    case "mensal":
      return data.toLocaleDateString("pt-BR", {
        month: "2-digit",
        year: "2-digit",
      });
    default:
      return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
  }
};

// ===== SERVIÇOS =====

export const getFluxoCaixaHistoricoDb = async (
  periodo: string,
  tipoVisualizacao: string
): Promise<FluxoCaixaItem[]> => {
  try {
    const dias = calcularDiasPeriodo(periodo);
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - dias);

    // Buscar entradas (vendas pagas e recebimentos)
    const [entradasResult] = await db.execute(
      `
      SELECT 
        DATE(data_venda) as data,
        SUM(total_com_desconto) as total
      FROM vendas 
      WHERE data_venda >= ? 
        AND status = 'pago'
        AND forma_pagamento IN ('dinheiro', 'cartao', 'pix', 'transferencia')
      GROUP BY DATE(data_venda)
      ORDER BY data ASC
    `,
      [dataInicio.toISOString().split("T")[0]]
    );

    // Buscar saídas (contas pagas)
    const [saidasResult] = await db.execute(
      `
      SELECT 
        DATE(data_pagamento) as data,
        SUM(valor_pago) as total
      FROM contas_pagar 
      WHERE data_pagamento >= ? 
        AND status = 'pago'
      GROUP BY DATE(data_pagamento)
      ORDER BY data ASC
    `,
      [dataInicio.toISOString().split("T")[0]]
    );

    const entradas = (entradasResult as any[]).reduce((acc, item) => {
      acc[item.data] = Number(item.total);
      return acc;
    }, {});

    const saidas = (saidasResult as any[]).reduce((acc, item) => {
      acc[item.data] = Number(item.total);
      return acc;
    }, {});

    // Gerar array com todos os dias do período
    const resultado: FluxoCaixaItem[] = [];
    let saldoAcumulado = 0;

    for (let i = 0; i < dias; i++) {
      const data = new Date(dataInicio);
      data.setDate(data.getDate() + i);
      const dataStr = data.toISOString().split("T")[0];

      const entradasDia = entradas[dataStr] || 0;
      const saidasDia = saidas[dataStr] || 0;
      saldoAcumulado += entradasDia - saidasDia;

      resultado.push({
        data: formatarDataParaVisualizacao(data, tipoVisualizacao),
        entradas: entradasDia,
        saidas: saidasDia,
        saldo: saldoAcumulado,
        tipo: "historico",
      });
    }

    return resultado;
  } catch (error) {
    console.error("Erro ao buscar histórico de fluxo de caixa:", error);
    throw error;
  }
};

export const getFluxoCaixaProjecaoDb = async (
  dias: number
): Promise<FluxoCaixaItem[]> => {
  try {
    const hoje = new Date();
    const dataFim = new Date();
    dataFim.setDate(hoje.getDate() + dias);

    // Buscar contas a pagar futuras
    const [contasFuturasResult] = await db.execute(
      `
      SELECT 
        DATE(data_vencimento) as data,
        SUM(valor) as total
      FROM contas_pagar 
      WHERE data_vencimento > ? 
        AND data_vencimento <= ?
        AND status IN ('pendente', 'agendado')
      GROUP BY DATE(data_vencimento)
      ORDER BY data ASC
    `,
      [hoje.toISOString().split("T")[0], dataFim.toISOString().split("T")[0]]
    );

    // Buscar vendas a prazo que serão recebidas
    const [vendasPrazoResult] = await db.execute(
      `
      SELECT 
        DATE(DATE_ADD(data_venda, INTERVAL dias_vencimento DAY)) as data,
        SUM(total_com_desconto) as total
      FROM vendas 
      WHERE forma_pagamento = 'aprazo'
        AND status = 'pendente'
        AND DATE(DATE_ADD(data_venda, INTERVAL dias_vencimento DAY)) > ?
        AND DATE(DATE_ADD(data_venda, INTERVAL dias_vencimento DAY)) <= ?
      GROUP BY DATE(DATE_ADD(data_venda, INTERVAL dias_vencimento DAY))
      ORDER BY data ASC
    `,
      [hoje.toISOString().split("T")[0], dataFim.toISOString().split("T")[0]]
    );

    const saidas = (contasFuturasResult as any[]).reduce((acc, item) => {
      acc[item.data] = Number(item.total);
      return acc;
    }, {});

    const entradas = (vendasPrazoResult as any[]).reduce((acc, item) => {
      acc[item.data] = Number(item.total);
      return acc;
    }, {});

    // Buscar média de vendas dos últimos 30 dias para projeção
    const [mediaVendasResult] = await db.execute(
      `
      SELECT 
        AVG(total_com_desconto) as media_diaria,
        COUNT(*) as total_vendas
      FROM vendas 
      WHERE data_venda >= DATE_SUB(?, INTERVAL 30 DAY)
        AND status = 'pago'
        AND forma_pagamento IN ('dinheiro', 'cartao', 'pix', 'transferencia')
    `,
      [hoje.toISOString().split("T")[0]]
    );

    // Buscar média de contas pagas dos últimos 30 dias
    const [mediaContasResult] = await db.execute(
      `
      SELECT 
        AVG(valor_pago) as media_diaria,
        COUNT(*) as total_contas
      FROM contas_pagar 
      WHERE data_pagamento >= DATE_SUB(?, INTERVAL 30 DAY)
        AND status = 'pago'
    `,
      [hoje.toISOString().split("T")[0]]
    );

    const mediaVendas = Number(
      (mediaVendasResult as any[])[0]?.media_diaria || 0
    );
    const mediaContas = Number(
      (mediaContasResult as any[])[0]?.media_diaria || 0
    );

    // Gerar array com todos os dias futuros
    const resultado: FluxoCaixaItem[] = [];
    let saldoAcumulado = 0;

    // Primeiro, calcular o saldo atual
    const [saldoAtualResult] = await db.execute(`
      SELECT 
        (SELECT COALESCE(SUM(total_com_desconto), 0) FROM vendas WHERE status = 'pago' AND forma_pagamento IN ('dinheiro', 'cartao', 'pix', 'transferencia')) -
        (SELECT COALESCE(SUM(valor_pago), 0) FROM contas_pagar WHERE status = 'pago') as saldo_atual
    `);
    saldoAcumulado = Number((saldoAtualResult as any[])[0]?.saldo_atual || 0);

    for (let i = 1; i <= dias; i++) {
      const data = new Date(hoje);
      data.setDate(data.getDate() + i);
      const dataStr = data.toISOString().split("T")[0];

      // Usar dados reais se existirem, senão usar médias históricas
      let entradasDia = entradas[dataStr] || 0;
      let saidasDia = saidas[dataStr] || 0;

      // Se não há dados reais, usar médias históricas com variação
      if (entradasDia === 0 && mediaVendas > 0) {
        // Variação de ±20% na média
        const variacao = (Math.random() - 0.5) * 0.4; // -20% a +20%
        entradasDia = Math.max(0, mediaVendas * (1 + variacao));
      }

      if (saidasDia === 0 && mediaContas > 0) {
        // Variação de ±15% na média
        const variacao = (Math.random() - 0.5) * 0.3; // -15% a +15%
        saidasDia = Math.max(0, mediaContas * (1 + variacao));
      }

      saldoAcumulado += entradasDia - saidasDia;

      resultado.push({
        data: formatarDataParaVisualizacao(data, "diario"),
        entradas: Math.round(entradasDia),
        saidas: Math.round(saidasDia),
        saldo: Math.round(saldoAcumulado),
        tipo: "projecao",
      });
    }

    return resultado;
  } catch (error) {
    console.error("Erro ao buscar projeção de fluxo de caixa:", error);
    throw error;
  }
};

export const getCategoriasFluxoCaixaDb = async (
  periodo: string
): Promise<{
  entradas: CategoriaFluxo[];
  saidas: CategoriaFluxo[];
}> => {
  try {
    const dias = calcularDiasPeriodo(periodo);
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - dias);

    // Buscar categorias de entradas (vendas por forma de pagamento)
    const [entradasResult] = await db.execute(
      `
      SELECT 
        CASE 
          WHEN forma_pagamento IN ('dinheiro', 'cartao', 'pix', 'transferencia') THEN 'Vendas à Vista'
          WHEN forma_pagamento = 'aprazo' THEN 'Recebimentos'
          ELSE 'Outros'
        END as categoria,
        SUM(total_com_desconto) as valor
      FROM vendas 
      WHERE data_venda >= ? 
        AND status = 'pago'
      GROUP BY categoria
      ORDER BY valor DESC
    `,
      [dataInicio.toISOString().split("T")[0]]
    );

    // Buscar categorias de saídas (contas por categoria)
    const [saidasResult] = await db.execute(
      `
      SELECT 
        COALESCE(c.nome, 'Sem categoria') as categoria,
        SUM(cp.valor_pago) as valor
      FROM contas_pagar cp
      LEFT JOIN categorias c ON cp.categoria_id = c.id
      WHERE cp.data_pagamento >= ? 
        AND cp.status = 'pago'
      GROUP BY c.nome
      ORDER BY valor DESC
    `,
      [dataInicio.toISOString().split("T")[0]]
    );

    const entradas = (entradasResult as any[]).map((item) => ({
      categoria: item.categoria,
      valor: Number(item.valor),
      percentual: 0, // Será calculado abaixo
    }));

    const saidas = (saidasResult as any[]).map((item) => ({
      categoria: item.categoria,
      valor: Number(item.valor),
      percentual: 0, // Será calculado abaixo
    }));

    // Calcular percentuais
    const totalEntradas = entradas.reduce((sum, item) => sum + item.valor, 0);
    const totalSaidas = saidas.reduce((sum, item) => sum + item.valor, 0);

    entradas.forEach((item) => {
      item.percentual =
        totalEntradas > 0 ? (item.valor / totalEntradas) * 100 : 0;
    });

    saidas.forEach((item) => {
      item.percentual = totalSaidas > 0 ? (item.valor / totalSaidas) * 100 : 0;
    });

    return { entradas, saidas };
  } catch (error) {
    console.error("Erro ao buscar categorias de fluxo de caixa:", error);
    throw error;
  }
};

export const getComparativoPeriodosDb = async (): Promise<
  ComparativoPeriodo[]
> => {
  try {
    const hoje = new Date();

    // Este mês
    const inicioMesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMesAtual = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    // Mês anterior
    const inicioMesAnterior = new Date(
      hoje.getFullYear(),
      hoje.getMonth() - 1,
      1
    );
    const fimMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0);

    // Mesmo mês ano anterior
    const inicioMesAnoAnterior = new Date(
      hoje.getFullYear() - 1,
      hoje.getMonth(),
      1
    );
    const fimMesAnoAnterior = new Date(
      hoje.getFullYear() - 1,
      hoje.getMonth() + 1,
      0
    );

    const comparativo: ComparativoPeriodo[] = [];

    // Este mês
    const [esteMesResult] = await db.execute(
      `
      SELECT 
        (SELECT COALESCE(SUM(total_com_desconto), 0) FROM vendas 
         WHERE data_venda >= ? AND data_venda <= ? AND status = 'pago') as entradas,
        (SELECT COALESCE(SUM(valor_pago), 0) FROM contas_pagar 
         WHERE data_pagamento >= ? AND data_pagamento <= ? AND status = 'pago') as saidas
    `,
      [
        inicioMesAtual.toISOString().split("T")[0],
        fimMesAtual.toISOString().split("T")[0],
        inicioMesAtual.toISOString().split("T")[0],
        fimMesAtual.toISOString().split("T")[0],
      ]
    );

    const esteMes = (esteMesResult as any[])[0];
    comparativo.push({
      periodo: "Este Mês",
      entradas: Number(esteMes?.entradas || 0),
      saidas: Number(esteMes?.saidas || 0),
      saldo: Number(esteMes?.entradas || 0) - Number(esteMes?.saidas || 0),
    });

    // Mês anterior
    const [mesAnteriorResult] = await db.execute(
      `
      SELECT 
        (SELECT COALESCE(SUM(total_com_desconto), 0) FROM vendas 
         WHERE data_venda >= ? AND data_venda <= ? AND status = 'pago') as entradas,
        (SELECT COALESCE(SUM(valor_pago), 0) FROM contas_pagar 
         WHERE data_pagamento >= ? AND data_pagamento <= ? AND status = 'pago') as saidas
    `,
      [
        inicioMesAnterior.toISOString().split("T")[0],
        fimMesAnterior.toISOString().split("T")[0],
        inicioMesAnterior.toISOString().split("T")[0],
        fimMesAnterior.toISOString().split("T")[0],
      ]
    );

    const mesAnterior = (mesAnteriorResult as any[])[0];
    comparativo.push({
      periodo: "Mês Anterior",
      entradas: Number(mesAnterior?.entradas || 0),
      saidas: Number(mesAnterior?.saidas || 0),
      saldo:
        Number(mesAnterior?.entradas || 0) - Number(mesAnterior?.saidas || 0),
    });

    // Mesmo mês ano anterior
    const [mesAnoAnteriorResult] = await db.execute(
      `
      SELECT 
        (SELECT COALESCE(SUM(total_com_desconto), 0) FROM vendas 
         WHERE data_venda >= ? AND data_venda <= ? AND status = 'pago') as entradas,
        (SELECT COALESCE(SUM(valor_pago), 0) FROM contas_pagar 
         WHERE data_pagamento >= ? AND data_pagamento <= ? AND status = 'pago') as saidas
    `,
      [
        inicioMesAnoAnterior.toISOString().split("T")[0],
        fimMesAnoAnterior.toISOString().split("T")[0],
        inicioMesAnoAnterior.toISOString().split("T")[0],
        fimMesAnoAnterior.toISOString().split("T")[0],
      ]
    );

    const mesAnoAnterior = (mesAnoAnteriorResult as any[])[0];
    comparativo.push({
      periodo: "Mesmo Mês Ano Anterior",
      entradas: Number(mesAnoAnterior?.entradas || 0),
      saidas: Number(mesAnoAnterior?.saidas || 0),
      saldo:
        Number(mesAnoAnterior?.entradas || 0) -
        Number(mesAnoAnterior?.saidas || 0),
    });

    return comparativo;
  } catch (error) {
    console.error("Erro ao buscar comparativo de períodos:", error);
    throw error;
  }
};

export const getResumoFluxoCaixaDb = async (
  periodo: string
): Promise<ResumoFluxoCaixa> => {
  try {
    const dias = calcularDiasPeriodo(periodo);
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - dias);

    // Buscar totais do período
    const [resumoResult] = await db.execute(
      `
      SELECT 
        (SELECT COALESCE(SUM(total_com_desconto), 0) FROM vendas 
         WHERE data_venda >= ? AND status = 'pago') as total_entradas,
        (SELECT COALESCE(SUM(valor_pago), 0) FROM contas_pagar 
         WHERE data_pagamento >= ? AND status = 'pago') as total_saidas,
        (SELECT COALESCE(SUM(total_com_desconto), 0) FROM vendas 
         WHERE status = 'pago' AND forma_pagamento IN ('dinheiro', 'cartao', 'pix', 'transferencia')) -
        (SELECT COALESCE(SUM(valor_pago), 0) FROM contas_pagar 
         WHERE status = 'pago') as saldo_atual
    `,
      [
        dataInicio.toISOString().split("T")[0],
        dataInicio.toISOString().split("T")[0],
      ]
    );

    const resumo = (resumoResult as any[])[0];
    const totalEntradas = Number(resumo?.total_entradas || 0);
    const totalSaidas = Number(resumo?.total_saidas || 0);
    const saldoAtual = Number(resumo?.saldo_atual || 0);

    // Calcular projeção para 30 dias
    const projecao30Dias = await getFluxoCaixaProjecaoDb(30);
    const projecaoTotal = projecao30Dias.reduce(
      (sum, item) => sum + (item.entradas - item.saidas),
      0
    );

    // Calcular crescimento (comparar com mês anterior)
    const inicioMesAnterior = new Date();
    inicioMesAnterior.setMonth(inicioMesAnterior.getMonth() - 1);
    inicioMesAnterior.setDate(1);
    const fimMesAnterior = new Date();
    fimMesAnterior.setMonth(fimMesAnterior.getMonth());
    fimMesAnterior.setDate(0);

    const [mesAnteriorResult] = await db.execute(
      `
      SELECT 
        (SELECT COALESCE(SUM(total_com_desconto), 0) FROM vendas 
         WHERE data_venda >= ? AND data_venda <= ? AND status = 'pago') -
        (SELECT COALESCE(SUM(valor_pago), 0) FROM contas_pagar 
         WHERE data_pagamento >= ? AND data_pagamento <= ? AND status = 'pago') as saldo_mes_anterior
    `,
      [
        inicioMesAnterior.toISOString().split("T")[0],
        fimMesAnterior.toISOString().split("T")[0],
        inicioMesAnterior.toISOString().split("T")[0],
        fimMesAnterior.toISOString().split("T")[0],
      ]
    );

    const saldoMesAnterior = Number(
      (mesAnteriorResult as any[])[0]?.saldo_mes_anterior || 0
    );
    const crescimento =
      saldoMesAnterior > 0
        ? ((saldoAtual - saldoMesAnterior) / saldoMesAnterior) * 100
        : 0;

    return {
      saldo_atual: saldoAtual,
      total_entradas: totalEntradas,
      total_saidas: totalSaidas,
      total_entradas_periodo: totalEntradas,
      total_saidas_periodo: totalSaidas,
      saldo_periodo: saldoAtual,
      projecao_30_dias: projecaoTotal,
      crescimento_percentual: crescimento,
    };
  } catch (error) {
    console.error("Erro ao buscar resumo de fluxo de caixa:", error);
    throw error;
  }
};
