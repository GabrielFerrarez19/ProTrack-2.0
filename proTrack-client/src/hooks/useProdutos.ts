import { useEffect, useState } from "react";
import { fetchAllProdutos } from "../services/api";
import type { Produto } from "../@types/types.api";

export function useProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProdutos() {
      try {
        const data = await fetchAllProdutos();
        setProdutos(data);
      } catch {
        setError("Erro ao carregar produtos");
      } finally {
        setLoading(false);
      }
    }
    loadProdutos();
  }, []);

  return { produtos, loading, error };
}
