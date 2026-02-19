import { useCallback, useEffect, useState } from "react";
import { CountSales } from "@/services/sales";
import type { Status } from "@/@types/types.components";
import { CountCustomers } from "@/services/customers";

const emptyDados = {
  vendas: 0,
  clientes: 0,
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
      const countSales = await CountSales();
      const countCustomers = await CountCustomers();

      setDados((prev) => ({
        ...prev,
        vendas: countSales,
        clientes: countCustomers,
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
