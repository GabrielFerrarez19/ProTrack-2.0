import { useCallback, useEffect, useState } from "react";
import type { DashboardDados } from "../@types/types.api";
import {
  GetMarginDistribution,
  GetPerformanceMonth,
  GetRealProfit,
  GetTop5RealProfitItem,
  GetTotalInvestmentCategory,
  GetTotalAmountIsPending,
  GetTotalAmountSummary,
  PercentageSales,
} from "@/services/sales";
import { GetCostTotalStock, GetTopProducts } from "@/services/product";

const emptyDados: DashboardDados = {
  vendasEsseMes: 0,
  vendasMesPassado: 0,
  aReceber: 0,
  percentage: 0,
  custoTotalEstoque: 0,
  Top5Products: [],
};

export const useDashboard = () => {
  const [dados, setDados] = useState<DashboardDados>(emptyDados);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDados = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const vendasEmAberto = await GetTotalAmountIsPending();
      const vendasMesses = await GetTotalAmountSummary();
      const porcentagemCrecimento = await PercentageSales();
      const custoTotalEstoque = await GetCostTotalStock();
      const top5Products = await GetTopProducts();
      const realProfit = await GetRealProfit();
      const top5RealProfit = await GetTop5RealProfitItem();
      const performanceMonth = await GetPerformanceMonth();
      const investmentCategory = await GetTotalInvestmentCategory();
      const marginDistribution = await GetMarginDistribution();

      const totalInvestment = investmentCategory.reduce(
        (acc, item) => acc + (item.total_investment ?? 0),
        0,
      );
      const totalMarginItems = marginDistribution.reduce(
        (acc, item) => acc + (item.count ?? 0),
        0,
      );

      setDados((prev) => ({
        ...prev,
        aReceber: vendasEmAberto,
        financeiro: {
          total_geral: vendasEmAberto,
        },
        vendasEsseMes: vendasMesses.current_month_st,
        vendasMesPassado: vendasMesses.last_month_st,
        percentage: porcentagemCrecimento,
        custoTotalEstoque: custoTotalEstoque,
        estoque: {
          totalEstoque: custoTotalEstoque,
        },
        Top5Products: top5Products,
        margemTotal: {
          receita_total: 0,
          custo_total: 0,
          lucro_total: 0,
          margem_lucro_total: realProfit,
        },
        melhorMargem: {
          produtos: top5RealProfit.map((item) => ({
            nome: item.product_name,
            lucro_unitario: item.product_real_profit,
            margem_lucro: item.product_real_profit,
          })),
        },
        evolucaoLucroMensal: performanceMonth.map((item) => ({
          mes: item.mount,
          lucro_mensal: item.real_profit,
        })),
        valorInvestidoPorCategoria: {
          categorias: investmentCategory.map((item) => ({
            categoria: item.category_name,
            valor_investido: item.total_investment,
            quantidade_produtos: item.amount,
            percentual_total:
              totalInvestment > 0
                ? (item.total_investment / totalInvestment) * 100
                : 0,
            preco_medio_custo:
              item.amount > 0 ? item.total_investment / item.amount : 0,
          })),
        },
        distribuicaoMargemLucro: {
          distribuicao: marginDistribution.map((item) => ({
            faixa: item.label,
            qtd: item.count,
            percentual:
              totalMarginItems > 0 ? (item.count / totalMarginItems) * 100 : 0,
            margem_media: 0,
          })),
          total_produtos: totalMarginItems,
          margem_media_geral: realProfit,
        },
      }));
    } catch {
      setError("Erro ao buscar dados");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDados();
  }, [loadDados]);

  console.log(dados);
  return { dados, loading, error };
};
