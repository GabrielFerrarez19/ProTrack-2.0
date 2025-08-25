import { useEffect, useState } from "react";
import type { DashboardDados } from "../../@types/types.api";
import {
  fetchGiroEstoque,
  fetchTotalAPagar,
  fetchTotalValorEstoque,
  fetchVendasDashboard,
} from "../../services/api";
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
  const [dados, setDados] = useState<DashboardDados>({
    estoque: null,
    financeiro: null,
    giro: null,
    vendas: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [estoqueRes, financeiroRes, giroRes, vendasRes] =
          await Promise.all([
            fetchTotalValorEstoque(),
            fetchTotalAPagar(),
            fetchGiroEstoque(),
            fetchVendasDashboard(),
          ]);

        setDados({
          estoque: estoqueRes,
          financeiro: financeiroRes,
          giro: giroRes,
          vendas: vendasRes,
        });
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="p-6">Carregando dados financeiros...</p>;
  if (!dados)
    return <p className="p-6 text-red-600">Erro ao carregar informações</p>;

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <div>
        <Header
          title="Dashboard Financeiro"
          text="Visão geral da situação financeira da empresa"
        />
      </div>

      <SaldoCards dados={dados} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ResumoVendas vendas={dados.vendas} />
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
