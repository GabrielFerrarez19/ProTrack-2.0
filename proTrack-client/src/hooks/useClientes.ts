// hooks/useClientes.ts
import { useState, useEffect } from "react";
import type { Cliente } from "../@types/types.components";
import { fetchAllClientes } from "../services/api";
import { normalizeCliente } from "../utils/functions";

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadClientes = async () => {
    try {
      setLoading(true);
      const data = await fetchAllClientes();

      // Normaliza os clientes e força strings
      const clientesNormalizados = (data.clientes ?? []).map(normalizeCliente);

      setClientes(clientesNormalizados);
    } catch (err) {
      console.error("Erro ao carregar clientes:", err);
      setError("Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

  return { clientes, loading, error, reload: loadClientes };
};
