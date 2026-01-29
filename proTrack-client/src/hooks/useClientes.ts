import { useState, useCallback } from "react";
import type { Cliente } from "../@types/types.components";

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadClientes = useCallback(async () => {
    setLoading(true);
    setClientes([]);
    setLoading(false);
  }, []);

  return { clientes, loading, error, reload: loadClientes };
};
