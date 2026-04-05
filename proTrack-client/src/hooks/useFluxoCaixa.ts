import {
  fetchAllCashFlowData,
  getSummaryPeriodRange,
  type PeriodoResumoFluxo,
} from "@/services/flowcash";
import type { CashFlowHistoryProjection } from "@/@types/flowcash";
import { useCallback, useEffect, useState } from "react";

export interface FluxoCaixaCategoriaItem {
  categoria: string;
  valor: number;
  percentual: number;
}

export interface FluxoCaixaChartPoint {
  data: string;
  saldo: number;
  entradas: number;
  saidas: number;
}

export interface FluxoCaixaComparativoItem {
  periodo: string;
  entradas: number;
  saidas: number;
  saldo: number;
}

export interface FluxoCaixaDados {
  resumo: {
    saldo_atual: number;
    total_entradas: number;
    total_saidas: number;
    projecao_30_dias: number;
    crescimento_percentual: number;
  };
  /** Série histórica para o gráfico (mesma ordem da API). */
  historico: FluxoCaixaChartPoint[];
  projecao: FluxoCaixaChartPoint[];
  categorias: {
    entradas: FluxoCaixaCategoriaItem[];
    saidas: FluxoCaixaCategoriaItem[];
  };
  comparativo: FluxoCaixaComparativoItem[];
}

function periodLabelPt(mount: string): string {
  const map: Record<string, string> = {
    "current month": "Mês atual",
    "last month": "Mês anterior",
    "last year": "Ano anterior",
  };
  return map[mount] ?? mount;
}

function mapHistoryToChart(
  history: CashFlowHistoryProjection[],
): FluxoCaixaChartPoint[] {
  return history.map((h) => ({
    data: h.date,
    saldo: h.accumulated_balance,
    entradas: h.total_inflow,
    saidas: h.total_outflow,
  }));
}

function crescimentoVsMesAnterior(
  history: CashFlowHistoryProjection[],
): number {
  if (history.length < 2) return 0;
  const atual = history[0].total_inflow - history[0].total_outflow;
  const anterior = history[1].total_inflow - history[1].total_outflow;
  if (anterior === 0) return atual > 0 ? 100 : 0;
  return ((atual - anterior) / Math.abs(anterior)) * 100;
}

export const useFluxoCaixa = (periodoResumo: PeriodoResumoFluxo) => {
  const [dados, setDados] = useState<FluxoCaixaDados | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const range = getSummaryPeriodRange(periodoResumo);
    try {
      const {
        summary,
        history,
        inflowCategories,
        outflowCategories,
        monthPeriods,
      } = await fetchAllCashFlowData(range);

      const historicoChart = mapHistoryToChart(history);
      const netMesAtual =
        history.length > 0
          ? history[0].total_inflow - history[0].total_outflow
          : 0;

      const dadosMapeados: FluxoCaixaDados = {
        resumo: {
          saldo_atual: summary.net_balance,
          total_entradas: summary.total_inflow,
          total_saidas: summary.total_outflow,
          projecao_30_dias: netMesAtual,
          crescimento_percentual: crescimentoVsMesAnterior(history),
        },
        historico: historicoChart,
        projecao: [],
        categorias: {
          entradas: inflowCategories.map((c) => ({
            categoria: c.name_category,
            valor: c.total_inflow,
            percentual: c.percentage_in_flow,
          })),
          saidas: outflowCategories.map((c) => ({
            categoria: c.name_category,
            valor: c.total_outflow,
            percentual: c.percentage_in_flow,
          })),
        },
        comparativo: monthPeriods.map((p) => ({
          periodo: periodLabelPt(p.mount),
          entradas: p.total_inflow,
          saidas: p.total_outflow,
          saldo: p.total_inflow - p.total_outflow,
        })),
      };

      setDados(dadosMapeados);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Falha ao carregar fluxo de caixa.";
      setError(message);
      setDados(null);
    } finally {
      setLoading(false);
    }
  }, [periodoResumo]);

  useEffect(() => {
    void load();
  }, [load]);

  return { dados, loading, error, refetch: load };
};
