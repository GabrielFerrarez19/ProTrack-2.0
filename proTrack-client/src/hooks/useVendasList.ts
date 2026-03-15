import { useState, useCallback, useEffect } from "react";
import { ListSalesWithDetails } from "@/services/sales";
import type { SaleWithDetails } from "@/@types/sales";

export const useVendasList = () => {
  const [vendas, setVendas] = useState<SaleWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadVendas = useCallback(async () => {
    try {
      setLoading(true);
      const sales = await ListSalesWithDetails();
      setVendas(sales);
    } catch {
      setVendas([]);
      setError("Erro ao buscar vendas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVendas();
  }, [loadVendas]);

  return { vendas, loading, error, reload: loadVendas };
};
