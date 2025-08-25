// hooks/useVendas.ts
import { useState } from "react";
import type { VendaData } from "../@types/types.api";
import { criarVenda } from "../services/api";

export const useVendas = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitVenda = async (venda: VendaData) => {
    try {
      setLoading(true);
      setError(null);

      const resposta = await criarVenda(venda);
      return resposta;
    } catch (err) {
      console.error("Erro ao cadastrar venda:", err);
      setError("Erro ao cadastrar venda");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitVenda, loading, error };
};
