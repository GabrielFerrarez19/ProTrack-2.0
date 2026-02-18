import { useState } from "react";
import { useAuth } from "./useAuth";
import { CreateSale } from "@/services/sales";
import type { SaleRequest } from "@/@types/sales";

export const useVendas = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { companyID, user } = useAuth();

  const submitVenda = async (saleData: SaleRequest) => {
    setLoading(true);
    setError(null);
    try {
      if (!companyID || !user?.id) {
        throw new Error("Usuário ou empresa não identificados. Faça login novamente.");
      }
      const id = await CreateSale(saleData);
      return id;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao cadastrar venda";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitVenda, loading, error };
};
