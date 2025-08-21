import { useState } from "react";
import { AnalisesDetalhadas } from "./components/AnalisesDetalhadas";
import { CardsResumo } from "./components/CardsResumo";
import { ExportarRelatorios } from "./components/ExportarRelatorios";
import { GraficosPrincipais } from "./components/GraficosPrincipais";
import { RelatorioConfig } from "./components/RelatorioConfig";

export function RelatoriosFinanceiros() {
  const [periodoInicio, setPeriodoInicio] = useState("2024-12-01");
  const [periodoFim, setPeriodoFim] = useState("2024-12-31");
  const [tipoRelatorio, setTipoRelatorio] = useState("lucro-produto");

  // ---------- DADOS MOCKADOS ----------
  const lucroPorProduto = [
    { produto: "Produto A", lucro: 1200 },
    { produto: "Produto B", lucro: 850 },
    { produto: "Produto C", lucro: 640 },
    { produto: "Produto D", lucro: 869 },
    { produto: "Produto E", lucro: 753 },
  ];

  const lucroPorPeriodo = [
    { mes: "Jan", valor: 3200 },
    { mes: "Fev", valor: 2800 },
    { mes: "Mar", valor: 4000 },
  ];

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

  const estoqueInvestimento = [
    { categoria: "Eletrônicos", valor: 15000 },
    { categoria: "Móveis", valor: 8000 },
    { categoria: "Roupas", valor: 5000 },
  ];

  const margemLucroDistribuicao = [
    { faixa: "0-10%", qtd: 12 },
    { faixa: "11-20%", qtd: 8 },
    { faixa: "21-30%", qtd: 5 },
  ];

  // ---------- RENDER ----------
  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Relatórios Financeiros</h1>
        <p className="text-muted-foreground">
          Análises detalhadas de performance financeira e lucratividade
        </p>
      </header>

      <RelatorioConfig
        tipoRelatorio={tipoRelatorio}
        setTipoRelatorio={setTipoRelatorio}
        periodoInicio={periodoInicio}
        setPeriodoInicio={setPeriodoInicio}
        periodoFim={periodoFim}
        setPeriodoFim={setPeriodoFim}
      />

      <CardsResumo
        contasDetalhadas={contasDetalhadas}
        estoqueInvestimento={estoqueInvestimento}
        lucroPorProduto={lucroPorProduto}
      />

      <GraficosPrincipais
        lucroPorProduto={lucroPorProduto}
        lucroPorPeriodo={lucroPorPeriodo}
      />

      <AnalisesDetalhadas
        margemLucroDistribuicao={margemLucroDistribuicao}
        estoqueInvestimento={estoqueInvestimento}
      />

      <ExportarRelatorios />
    </div>
  );
}
