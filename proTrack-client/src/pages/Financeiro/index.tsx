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
import { PageLoading } from "@/components/PageLoading";
import { CompanyRegistrationModal } from "@/components/DioalogCompanyRegistration";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";

export function DashboardFinanceiro() {
  const { dados, loading, error } = useDashboard();
  const { hasCompany, setHasCompany } = useAuth();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!hasCompany) {
      setOpenModal(true);
    }
  }, [hasCompany]);

  const handleRegistrationComplete = () => {
    setHasCompany(true);
    localStorage.setItem("has_company", "true");
    setOpenModal(false);
  };

  if (loading) return <PageLoading message="Carregando dados financeiros..." />;
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
        <TopProdutosChart dados={dados} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DistribuicaoVendasChart />
        <ValorEstoqueCard dados={dados} />
        <ContasPagarCard />
      </div>

      <CompanyRegistrationModal
        open={openModal}
        onComplete={handleRegistrationComplete}
      />
    </div>
  );
}
