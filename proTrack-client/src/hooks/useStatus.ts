import { useCallback, useEffect, useState } from "react";
import type {
  DashboardDados,
  VendasDashboardResponse,
} from "../@types/types.api";
import { CountSales } from "@/services/sales";
import type { Status } from "@/@types/types.components";

const emptyDados = {
  vendas: 0,
};

export const useStatus = () => {
  const [dados, setDados] = useState<Status>(emptyDados);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDados = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const count = await CountSales();
      setDados((prev) => ({
        ...prev,
        vendas: count,
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
