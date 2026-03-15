import { useState } from "react";
import { Header } from "../../components/header";

// Hooks
import { useVendasList } from "../../hooks/useVendasList";

// Componentes
import { VendasTable } from "./components/VendasTable";
import { SearchFilter } from "./components/SearchFilter";
import { PageLoading } from "@/components/PageLoading";

export function TotalVendas() {
  const { vendas, loading, error, reload } = useVendasList();
  const [searchTerm, setSearchTerm] = useState("");


  // Filtrar vendas baseado no termo de busca (dados em venda.sale)
  const filteredVendas = (vendas ?? []).filter((venda) => {
    const s = venda.sale;
    const searchLower = searchTerm.toLowerCase();
    return (
      String(s.sale_id).toLowerCase().includes(searchLower) ||
      s.customer_name?.toLowerCase().includes(searchLower) ||
      new Date(s.sale_at).toLocaleDateString().includes(searchLower) ||
      String(s.total_amount).includes(searchLower) ||
      String(s.sale_status).toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Bem-vindo à página Histórico de Vendas!"
        text="Aqui você pode verificar todas as suas vendas"
      />

      {/* Filtro de busca */}
      <SearchFilter searchTerm={searchTerm} onChange={setSearchTerm} />

      {loading ? (
        <PageLoading message="Carregando vendas..." />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredVendas.length === 0 ? (
        <p>Nenhuma venda encontrada.</p>
      ) : (
        <VendasTable vendas={filteredVendas} onVendaUpdated={reload} />
      )}
    </div>
  );
}
