import { useDashboard } from "../../hooks/useDashboard";
import { AlertasDashboard } from "./components/AlertasDashboard";
import { FluxoCaixaChart } from "./components/FluxoCaixaChart";
import { ResumoVendas } from "./components/ResumoVendas";
import { SaldoCards } from "./components/SaldoCards";
import { ContasPagarCard } from "./components/ContasPagarCard";
import { DistribuicaoVendasChart } from "./components/DistribuicaoVendasChart";
import { TopProdutosChart } from "./components/TopProdutosChart";
import { ValorEstoqueCard } from "./components/ValorEstoqueCard";
import { Header } from "../../components/header";

export function DashboardFinanceiro() {
  const { dados, loading, error } = useDashboard();

  if (loading) return <p className="p-6">Carregando dados financeiros...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <Header
        title="Dashboard Financeiro"
        text="Visão geral da situação financeira da empresa"
      />

      <SaldoCards dados={dados} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ResumoVendas dados={dados} />
        <AlertasDashboard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FluxoCaixaChart />
        <TopProdutosChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DistribuicaoVendasChart />
        <ValorEstoqueCard dados={dados} />
        <ContasPagarCard />
      </div>
    </div>
  );
}
