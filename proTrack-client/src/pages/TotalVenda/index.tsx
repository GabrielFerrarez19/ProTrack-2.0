import { useEffect, useState } from "react";
import { Header } from "../../components/header";
import { fetchAllVendas } from "../../services/api";
import type { VendaResponse } from "../../@types/types.components";
import { VendasTable } from "./components/VendasTable";

export function TotalVendas() {
  const [vendas, setVendas] = useState<VendaResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadVendas = async () => {
    setLoading(true);
    setError(null);

    try {
      // Tipamos fetchAllVendas para sempre retornar VendaResponse[]
      const data: VendaResponse[] = await fetchAllVendas();
      setVendas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao buscar vendas:", err);
      setError("Erro ao buscar vendas");
      setVendas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendas();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Bem vindo à página Total Vendas!"
        text="Aqui você pode verificar todas as suas vendas"
      />

      {loading ? (
        <p>Carregando vendas...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : vendas.length === 0 ? (
        <p>Nenhuma venda encontrada.</p>
      ) : (
        <VendasTable vendas={vendas} onVendaUpdated={loadVendas} />
      )}
    </div>
  );
}
