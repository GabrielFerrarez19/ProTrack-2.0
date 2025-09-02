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
  getQuantidadeVendasEmAberto, // 👈 import da nova API
} from "../services/api";

export const useDashboard = () => {
  const [dados, setDados] = useState<DashboardDados>({
    estoque: null,
    financeiro: null,
    giro: null,
    vendas: null,
    melhorMargem: null,
    margemTotal: null,
    evolucaoLucroMensal: [],
    valorInvestidoPorCategoria: null,
    distribuicaoMargemLucro: null,
    vendasEmAberto: null, // 👈 inicialização correta
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
          vendasEmAbertoRes, // 👈 adicionado aqui
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
          getQuantidadeVendasEmAberto(), // 👈 chamada nova API
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
          vendasEmAberto: vendasEmAbertoRes ?? null, // 👈 ajuste final
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
