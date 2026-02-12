import { useState, useCallback, useEffect } from "react";
import { ListProduct } from "@/services/product";
import type { ProductResponse } from "@/@types/product";

export const useProdutos = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const products = await ListProduct();
      setProducts(products);
    } catch {
      setProducts([]);
      setError("Erro ao carregar produto");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return { products, loading, error, reload: loadProducts };
};
