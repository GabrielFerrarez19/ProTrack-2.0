import { useState, useCallback } from "react";
import type { Product } from "../@types/types.components";

export const useProdutos = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setProducts([]);
    setLoading(false);
  }, []);

  return { products, loading, error, reload: loadProducts };
};
