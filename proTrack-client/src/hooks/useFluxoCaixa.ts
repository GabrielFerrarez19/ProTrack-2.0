import { useState } from "react";

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

const emptyFluxo: FluxoCaixaData = {
  historico: [],
  projecao: [],
  categorias: { entradas: [], saidas: [] },
  comparativo: [],
  resumo: {
    saldo_atual: 0,
    total_entradas: 0,
    total_saidas: 0,
    projecao_30_dias: 0,
    crescimento_percentual: 0,
  },
};

export const useFluxoCaixa = (
  _periodo: "7dias" | "30dias" | "90dias" | "1ano" = "30dias",
  _tipoVisualizacao: "diario" | "semanal" | "mensal" = "diario",
) => {
  const [dados, setDados] = useState<FluxoCaixaData | null>(emptyFluxo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = () => {
    setDados(emptyFluxo);
  };

  return {
    dados,
    loading,
    error,
    refetch,
  };
};
