import { useState, useCallback, useEffect } from "react";
import type { CustomerResponse } from "@/@types/customers";
import { ListCustomers } from "@/services/customers";

export const useClientes = () => {
  const [clientes, setClientes] = useState<CustomerResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadClientes = useCallback(async () => {
    try {
      setLoading(true);
      const customers = await ListCustomers();
      setClientes(customers);
    } catch {
      setClientes([]);
      setError("Erro ao buscar clientes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClientes();
  }, [loadClientes]);

  return { clientes, loading, error, reload: loadClientes };
};
