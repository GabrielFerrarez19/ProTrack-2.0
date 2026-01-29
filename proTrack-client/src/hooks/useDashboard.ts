import { useState } from "react";
import type { DashboardDados } from "../@types/types.api";

const emptyDados: DashboardDados = {
  estoque: null,
  financeiro: null,
  giro: null,
  vendas: null,
  melhorMargem: null,
  margemTotal: null,
  evolucaoLucroMensal: [],
  valorInvestidoPorCategoria: null,
  distribuicaoMargemLucro: null,
  vendasEmAberto: null,
};

export const useDashboard = () => {
  const [dados, setDados] = useState<DashboardDados>(emptyDados);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return { dados, loading, error };
};
