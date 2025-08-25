import { Header } from "../../components/header";

// Hooks
import { useVendasList } from "../../hooks/useVendasList";

// Componentes
import { VendasTable } from "./components/VendasTable";

export function TotalVendas() {
  const { vendas, loading, error, reload } = useVendasList();

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Bem-vindo à página Total Vendas!"
        text="Aqui você pode verificar todas as suas vendas"
      />

      {loading ? (
        <p>Carregando vendas...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : vendas.length === 0 ? (
        <p>Nenhuma venda encontrada.</p>
      ) : (
        <VendasTable vendas={vendas} onVendaUpdated={reload} />
      )}
    </div>
  );
}
