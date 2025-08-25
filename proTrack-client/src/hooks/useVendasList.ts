// hooks/useVendasList.ts
import { useState, useEffect, useCallback } from "react";
import type { VendaResponse } from "../@types/types.components";
import { fetchAllVendas } from "../services/api";

export const useVendasList = () => {
  const [vendas, setVendas] = useState<VendaResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadVendas = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data: VendaResponse[] = await fetchAllVendas();
      setVendas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao buscar vendas:", err);
      setError("Erro ao buscar vendas");
      setVendas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVendas();
  }, [loadVendas]);

  return { vendas, loading, error, reload: loadVendas };
};
