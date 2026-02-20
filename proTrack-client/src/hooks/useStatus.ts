import { useCallback, useEffect, useState } from "react";
import { CountSales, PercentageSales } from "@/services/sales";
import type { Status } from "@/@types/types.components";
import { CountCustomers, PercentageCustomers } from "@/services/customers";
import { CountProduct, PercentageProduct } from "@/services/product";
import { data } from "react-router-dom";

const emptyDados = {
  vendas: 0,
  clientes: 0,
  estoque: 0,
  percentageVendas: 0,
  percentageClientes: 0,
  percentageEstoque: 0,
};

export const useStatus = () => {
  const [dados, setDados] = useState<Status>(emptyDados);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDados = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const countSales = await CountSales();
      const countCustomers = await CountCustomers();
      const countProducts = await CountProduct();
      const percentageSales = await PercentageSales();
      const percentageCustomers = await PercentageCustomers();
      const percentageProducts = await PercentageProduct();

      setDados((prev) => ({
        ...prev,
        vendas: countSales,
        clientes: countCustomers,
        estoque: countProducts,
        percentageVendas: percentageSales,
        percentageClientes: percentageCustomers,
        percentageEstoque: percentageProducts,
      }));
    } catch {
      setError("Erro ao buscar dados");
    } finally {
      setLoading(false);
    }
  }, []);

  console.log(data.length);

  useEffect(() => {
    loadDados();
  }, [loadDados]);

  return { dados, loading, error };
};
