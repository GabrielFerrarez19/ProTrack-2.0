import { useState } from "react";
import type { VendaData } from "../@types/types.api";

export const useVendas = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitVenda = async (_venda: VendaData) => {
    setLoading(true);
    setLoading(false);
    return {};
  };

  return { submitVenda, loading, error };
};
