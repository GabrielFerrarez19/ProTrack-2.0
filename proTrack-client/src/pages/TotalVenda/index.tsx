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

  console.log("PaginaVendas", vendas);

  // Filtrar vendas baseado no termo de busca
  const filteredVendas = (vendas ?? []).filter((venda) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      venda.sale_id.toString().includes(searchLower) ||
      venda.customer_name?.toLowerCase().includes(searchLower) ||
      new Date(venda.sale_date).toLocaleDateString().includes(searchLower) ||
      venda.total_amount?.toString().includes(searchLower) ||
      venda.status?.toLowerCase().includes(searchLower)
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
