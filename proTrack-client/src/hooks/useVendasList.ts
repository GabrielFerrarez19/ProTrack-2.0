import { useState, useCallback } from "react";
import type { VendaResponse } from "../@types/types.components";

export const useVendasList = () => {
  const [vendas, setVendas] = useState<VendaResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadVendas = useCallback(async () => {
    setLoading(true);
    setVendas([]);
    setLoading(false);
  }, []);

  return { vendas, loading, error, reload: loadVendas };
};
