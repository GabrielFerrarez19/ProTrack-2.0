import { useCallback, useEffect, useState } from "react";
import type { DashboardDados } from "../@types/types.api";
import {
  GetTotalAmountIsPending,
  GetTotalAmountSummary,
  PercentageSales,
} from "@/services/sales";
import { GetCostTotalStock } from "@/services/product";

const emptyDados: DashboardDados = {
  vendasEsseMes: 0,
  vendasMesPassado: 0,
  aReceber: 0,
  crescimento: 0,
  custoTotalEstoque: 0,
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

      setDados((prev) => ({
        ...prev,
        aReceber: vendasEmAberto,
        vendasEsseMes: vendasMesses.current_month_st,
        vendasMesPassado: vendasMesses.last_month_st,
        porcentagemCrecimento: porcentagemCrecimento,
        custoTotalEstoque: custoTotalEstoque,
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
