// hooks/useProdutos.ts
import { useState, useEffect } from "react";
import type { Product } from "../@types/types.components";
import { fetchAllProdutos } from "../services/api";

export const useProdutos = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchAllProdutos();
      setProducts(data as Product[]);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      setError("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return { products, loading, error, reload: loadProducts };
};
