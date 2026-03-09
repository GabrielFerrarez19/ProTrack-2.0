import { useCallback, useEffect, useState } from "react";
import type { ContasReceber } from "../@types/types.api";
import {
  GetTotalAmountIsPending,
  GetTotalOverdue,
} from "@/services/sales";

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
      const totalReceber = await GetTotalAmountIsPending();
      const contasVencidas = await GetTotalOverdue();

      setDados((prev) => ({
        ...prev,
        totalReceber,
        contasVencidas: contasVencidas ?? 0,
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

  return { dados, loading, error };
};
