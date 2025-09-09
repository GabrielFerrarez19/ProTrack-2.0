import { useEffect, useState } from "react";
import {
  getFluxoCaixaHistorico,
  getFluxoCaixaProjecao,
  getCategoriasFluxoCaixa,
  getComparativoPeriodosFluxoCaixa,
  getResumoFluxoCaixa,
} from "../services/api";

// ===== TIPOS =====

export interface FluxoCaixaItem {
  data: string;
  entradas: number;
  saidas: number;
  saldo: number;
  tipo?: "historico" | "projecao";
}

export interface CategoriaFluxo {
  categoria: string;
  valor: number;
  percentual: number;
}

export interface ComparativoPeriodo {
  periodo: string;
  entradas: number;
  saidas: number;
  saldo: number;
}

export interface ResumoFluxoCaixa {
  saldo_atual: number;
  total_entradas: number;
  total_saidas: number;
  projecao_30_dias: number;
  crescimento_percentual: number;
}

export interface FluxoCaixaData {
  historico: FluxoCaixaItem[];
  projecao: FluxoCaixaItem[];
  categorias: {
    entradas: CategoriaFluxo[];
    saidas: CategoriaFluxo[];
  };
  comparativo: ComparativoPeriodo[];
  resumo: ResumoFluxoCaixa;
}

// ===== HOOK =====

export const useFluxoCaixa = (
  periodo: "7dias" | "30dias" | "90dias" | "1ano" = "30dias",
  tipoVisualizacao: "diario" | "semanal" | "mensal" = "diario"
) => {
  const [dados, setDados] = useState<FluxoCaixaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [historico, projecao, categorias, comparativo, resumo] =
        await Promise.all([
          getFluxoCaixaHistorico(periodo, tipoVisualizacao),
          getFluxoCaixaProjecao(30),
          getCategoriasFluxoCaixa(periodo),
          getComparativoPeriodosFluxoCaixa(),
          getResumoFluxoCaixa(periodo),
        ]);

      setDados({
        historico,
        projecao,
        categorias,
        comparativo,
        resumo,
      });
    } catch (err: any) {
      console.error("Erro ao buscar dados de fluxo de caixa:", err);
      setError(
        err.response?.data?.error || "Erro ao carregar dados de fluxo de caixa"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [periodo, tipoVisualizacao]);

  const refetch = () => {
    fetchData();
  };

  return {
    dados,
    loading,
    error,
    refetch,
  };
};
