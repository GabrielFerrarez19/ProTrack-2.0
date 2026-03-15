import { useCallback, useEffect, useState } from "react";
import type { ContasReceber } from "../@types/types.api";
import type { SaleWithDetails } from "@/@types/sales";
import {
  CountSalesPendingOverdue,
  GetTotalPendingAndOverdue,
  ListSalesWithDetailsPendingOverdue,
} from "@/services/sales";

const emptyDados: ContasReceber = {
  totalContas: 0,
  totalReceber: 0,
  contasVencidas: 0,
};

export const useContasReceber = () => {
  const [dados, setDados] = useState<ContasReceber>(emptyDados);
  const [vendas, setVendas] = useState<SaleWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDados = useCallback(async () => {
    try {
      setLoading(true);
      const [
        { total_pending, total_overdue },
        sales,
        contSales,
      ] = await Promise.all([
        GetTotalPendingAndOverdue(),
        ListSalesWithDetailsPendingOverdue(),
        CountSalesPendingOverdue().catch(() => 0),
      ]);

      setDados((prev) => ({
        ...prev,
        totalReceber: total_pending ?? 0,
        contasVencidas: total_overdue ?? 0,
        totalContas: contSales,
      }));
      setVendas(sales);
    } catch {
      setError("Erro ao buscar dados");
      setVendas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDados();
  }, [loadDados]);

  return { dados, vendas, loading, error, reload: loadDados };
};
