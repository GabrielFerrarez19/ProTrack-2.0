import { useState } from "react";
import { AnalisesDetalhadas } from "./components/AnalisesDetalhadas";
import { CardsResumo } from "./components/CardsResumo";
import { ExportarRelatorios } from "./components/ExportarRelatorios";
import { GraficosPrincipais } from "./components/GraficosPrincipais";
import { RelatorioConfig } from "./components/RelatorioConfig";
import { useDashboard } from "../../hooks/useDashboard";
import { Header } from "../../components/header";

export function RelatoriosFinanceiros() {
  const [tipoRelatorio, setTipoRelatorio] = useState("lucro-produto");

  // Data atual
  const hoje = new Date();
  const dataFim = hoje.toISOString().split("T")[0]; // YYYY-MM-DD

  // Criar data 1 mês atrás
  const umMesAtras = new Date(hoje);
  umMesAtras.setMonth(hoje.getMonth() - 1);
  const dataInicio = umMesAtras.toISOString().split("T")[0];

  // Estados com valores padrão
  const [periodoInicio, setPeriodoInicio] = useState(dataInicio);
  const [periodoFim, setPeriodoFim] = useState(dataFim);

  const { dados, loading, error } = useDashboard();

  if (loading) return <p className="p-6">Carregando dados financeiros...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  // ---------- DADOS MOCKADOS ----------
  const contasDetalhadas = [
    {
      id: 1,
      data: "2025-08-01",
      descricao: "Conta de luz",
      categoria: "Despesas",
      valor: -450,
    },
    {
      id: 2,
      data: "2025-08-03",
      descricao: "Venda serviço X",
      categoria: "Receitas",
      valor: 2000,
    },
  ];

  // ---------- RENDER ----------
  return (
    <div className="p-6 space-y-6">
      <Header
        title="Relatórios Financeiros"
        text="Análises detalhadas de performance financeira e lucratividade"
      />

      <CardsResumo dados={dados} contasDetalhadas={contasDetalhadas} />

      <GraficosPrincipais dados={dados} />

      <AnalisesDetalhadas dados={dados} />

      <RelatorioConfig
        tipoRelatorio={tipoRelatorio}
        setTipoRelatorio={setTipoRelatorio}
        periodoInicio={periodoInicio}
        setPeriodoInicio={setPeriodoInicio}
        periodoFim={periodoFim}
        setPeriodoFim={setPeriodoFim}
      />

      <ExportarRelatorios />
    </div>
  );
}
