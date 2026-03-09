import { useCallback, useEffect, useState } from "react";
import type { ContasReceber, DashboardDados } from "../@types/types.api";
import {
  GetTotalAmountIsPending,
  GetTotalAmountSummary,
  PercentageSales,
} from "@/services/sales";
import { GetCostTotalStock, GetTopProducts } from "@/services/product";

const emptyDados: ContasReceber = {
  totalContas: 0,
  totalReceber: 0,
  contasVencidas: 0,
};

export const useContasReceber = () => {
  const [dados, setDados] = useState<ContasReceber>(emptyDados);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDados = useCallback(async () => {
    try {
      setDados((prev) => ({
        ...prev,
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
