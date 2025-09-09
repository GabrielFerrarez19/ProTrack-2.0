import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Categorias } from "./components/Categorias";
import { ComparativoPeriodos } from "./components/ComparativoPeriodos";
import { GraficoFluxo } from "./components/GraficoFluxo";
import { ResumoCards } from "./components/ResumoCards";
import { Header } from "@/components/header";
import { useFluxoCaixa } from "../../hooks/useFluxoCaixa";

export function FluxoCaixa() {
  const [periodo, setPeriodo] = useState<
    "7dias" | "30dias" | "90dias" | "1ano"
  >("30dias");
  const [tipoVisualizacao, setTipoVisualizacao] = useState<
    "diario" | "semanal" | "mensal"
  >("diario");

  // Buscar dados da API
  const { dados, loading, error, refetch } = useFluxoCaixa(
    periodo,
    tipoVisualizacao
  );

  // Dados de fallback caso a API não esteja disponível
  const dadosFallback = {
    historico: [
      { data: "01/12", entradas: 4500, saidas: 2300, saldo: 2200 },
      { data: "02/12", entradas: 3200, saidas: 1800, saldo: 3600 },
      { data: "03/12", entradas: 5400, saidas: 3100, saldo: 5900 },
      { data: "04/12", entradas: 6200, saidas: 2900, saldo: 9200 },
      { data: "05/12", entradas: 4800, saidas: 3500, saldo: 10500 },
    ],
    projecao: [
      {
        data: "11/12",
        entradas: 5500,
        saidas: 3200,
        saldo: 23500,
        tipo: "projecao" as const,
      },
      {
        data: "12/12",
        entradas: 4800,
        saidas: 2800,
        saldo: 25500,
        tipo: "projecao" as const,
      },
      {
        data: "13/12",
        entradas: 6200,
        saidas: 3900,
        saldo: 27800,
        tipo: "projecao" as const,
      },
    ],
    categorias: {
      entradas: [
        { categoria: "Vendas à Vista", valor: 45200, percentual: 65 },
        { categoria: "Recebimentos", valor: 18400, percentual: 26.5 },
        { categoria: "Outros", valor: 5900, percentual: 8.5 },
      ],
      saidas: [
        { categoria: "Fornecedores", valor: 28500, percentual: 55 },
        { categoria: "Salários", valor: 12800, percentual: 25 },
        { categoria: "Despesas Operacionais", valor: 8200, percentual: 16 },
        { categoria: "Impostos", valor: 2100, percentual: 4 },
      ],
    },
    comparativo: [
      { periodo: "Este Mês", entradas: 69500, saidas: 51600, saldo: 17900 },
      { periodo: "Mês Anterior", entradas: 58200, saidas: 45800, saldo: 12400 },
      {
        periodo: "Mesmo Mês Ano Anterior",
        entradas: 52100,
        saidas: 41200,
        saldo: 10900,
      },
    ],
    resumo: {
      saldo_atual: 21200,
      total_entradas: 69500,
      total_saidas: 51600,
      projecao_30_dias: 15000,
      crescimento_percentual: 15.2,
    },
  };

  // Usar dados da API ou fallback
  const dadosExibicao = dados || dadosFallback;

  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <Header
          title="Fluxo de Caixa"
          text="Visualize entradas, saídas e projeções financeiras"
        />
        <div className="flex gap-3">
          <Select
            value={periodo}
            onValueChange={(value: "7dias" | "30dias" | "90dias" | "1ano") =>
              setPeriodo(value)
            }
          >
            <SelectTrigger className="w-[140px] bg-slate-100 border-slate-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7dias">7 dias</SelectItem>
              <SelectItem value="30dias">30 dias</SelectItem>
              <SelectItem value="90dias">90 dias</SelectItem>
              <SelectItem value="1ano">1 ano</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={tipoVisualizacao}
            onValueChange={(value: "diario" | "semanal" | "mensal") =>
              setTipoVisualizacao(value)
            }
          >
            <SelectTrigger className="w-[140px] bg-slate-100 border-slate-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diario">Diário</SelectItem>
              <SelectItem value="semanal">Semanal</SelectItem>
              <SelectItem value="mensal">Mensal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center p-8">
          <div className="text-lg">Carregando dados de fluxo de caixa...</div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Erro:</strong> {error}
          <button
            onClick={refetch}
            className="ml-4 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <ResumoCards
            fluxoCaixaHistorico={dadosExibicao.historico}
            projecaoFutura={dadosExibicao.projecao}
            resumo={dadosExibicao.resumo}
          />
          <GraficoFluxo
            fluxoCaixaHistorico={dadosExibicao.historico}
            projecaoFutura={dadosExibicao.projecao}
          />
          <Categorias
            entradas={dadosExibicao.categorias.entradas}
            saidas={dadosExibicao.categorias.saidas}
          />
          <ComparativoPeriodos dados={dadosExibicao.comparativo} />
        </>
      )}
    </div>
  );
}
