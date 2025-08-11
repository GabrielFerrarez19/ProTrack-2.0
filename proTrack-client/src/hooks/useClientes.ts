import { useEffect, useState } from "react";
import { fetchAllClientes } from "../services/api";

export type Cliente = {
  id: string;
  nome: string;
  email: string; // importante ter todos os campos usados
  cpf?: string; // opcional se usar
};

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadClientes() {
      try {
        const data = await fetchAllClientes();
        setClientes(
          data.clientes.map((c) => ({
            ...c,
            id: String(c.id),
          }))
        );
      } catch {
        setError("Erro ao carregar clientes");
      } finally {
        setLoading(false);
      }
    }
    loadClientes();
  }, []);

  return { clientes, loading, error };
}
