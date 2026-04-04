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
import { PageLoading } from "@/components/PageLoading";

export function FluxoCaixa() {
  const { dados, loading, error, refetch } = useFluxoCaixa();
  const [tipoVisualizacao, setTipoVisualizacao] = useState<
    "diario" | "semanal" | "mensal"
  >("mensal");

  const dadosExibicao = dados;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Header
          title="Fluxo de Caixa"
          text="Visualize entradas, saídas e projeções financeiras"
        />
        <div className="flex gap-3">
          <Select>
            <SelectTrigger className="w-[140px] bg-slate-100 border-slate-300">
              <SelectValue placeholder="Período" />
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
        <PageLoading
          message="Carregando dados de fluxo de caixa..."
          fullHeight={false}
        />
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Erro:</strong> {error}
          <button
            type="button"
            onClick={() => void refetch()}
            className="ml-4 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !error && dadosExibicao && (
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
