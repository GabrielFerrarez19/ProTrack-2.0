// hooks/useDashboard.ts
import { useEffect, useState } from "react";
import type { DashboardDados } from "../@types/types.api";
import {
  fetchGiroEstoque,
  fetchTotalAPagar,
  fetchTotalValorEstoque,
  fetchVendasDashboard,
  getProdutosMelhorMargemLucro,
  getMargemLucroTotal,
  getEvolucaoLucroMensal,
  getValorInvestidoPorCategoria,
  getDistribuicaoMargemLucro,
} from "../services/api";

export const useDashboard = () => {
  const [dados, setDados] = useState<DashboardDados>({
    estoque: null,
    financeiro: null,
    giro: null,
    vendas: null,
    melhorMargem: null,
    margemTotal: null,
    evolucaoLucroMensal: [], // inicializado como array
    valorInvestidoPorCategoria: null,
    distribuicaoMargemLucro: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          estoqueRes,
          financeiroRes,
          giroRes,
          vendasRes,
          melhorMargemRes,
          margemTotalRes,
          evolucaoLucroMensalRes,
          valorInvestidoPorCategoriaRes,
          distribuicaoMargemLucroRes,
        ] = await Promise.all([
          fetchTotalValorEstoque(),
          fetchTotalAPagar(),
          fetchGiroEstoque(),
          fetchVendasDashboard(),
          getProdutosMelhorMargemLucro(),
          getMargemLucroTotal(),
          getEvolucaoLucroMensal(),
          getValorInvestidoPorCategoria(),
          getDistribuicaoMargemLucro(),
        ]);

        setDados({
          estoque: estoqueRes,
          financeiro: financeiroRes,
          giro: giroRes,
          vendas: vendasRes,
          melhorMargem: melhorMargemRes,
          margemTotal: margemTotalRes,
          evolucaoLucroMensal: Array.isArray(evolucaoLucroMensalRes)
            ? evolucaoLucroMensalRes
            : evolucaoLucroMensalRes
            ? [evolucaoLucroMensalRes]
            : [],
          valorInvestidoPorCategoria: valorInvestidoPorCategoriaRes,
          distribuicaoMargemLucro: distribuicaoMargemLucroRes,
        });
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard:", err);
        setError("Erro ao carregar informações");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { dados, loading, error };
};
