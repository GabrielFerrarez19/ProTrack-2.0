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

export function FluxoCaixa() {
  const [periodo, setPeriodo] = useState("30dias");
  const [tipoVisualizacao, setTipoVisualizacao] = useState("diario");

  // Dados mockados
  const fluxoCaixaHistorico = [
    { data: "01/12", entradas: 4500, saidas: 2300, saldo: 2200 },
    { data: "02/12", entradas: 3200, saidas: 1800, saldo: 3600 },
    { data: "03/12", entradas: 5400, saidas: 3100, saldo: 5900 },
    { data: "04/12", entradas: 6200, saidas: 2900, saldo: 9200 },
    { data: "05/12", entradas: 4800, saidas: 3500, saldo: 10500 },
    { data: "06/12", entradas: 7100, saidas: 4200, saldo: 13400 },
    { data: "07/12", entradas: 5900, saidas: 3800, saldo: 15500 },
    { data: "08/12", entradas: 4300, saidas: 2900, saldo: 16900 },
    { data: "09/12", entradas: 6800, saidas: 4100, saldo: 19600 },
    { data: "10/12", entradas: 5200, saidas: 3600, saldo: 21200 },
  ];

  const projecaoFutura = [
    {
      data: "11/12",
      entradas: 5500,
      saidas: 3200,
      saldo: 23500,
      tipo: "projecao",
    },
    {
      data: "12/12",
      entradas: 4800,
      saidas: 2800,
      saldo: 25500,
      tipo: "projecao",
    },
    {
      data: "13/12",
      entradas: 6200,
      saidas: 3900,
      saldo: 27800,
      tipo: "projecao",
    },
    {
      data: "14/12",
      entradas: 5900,
      saidas: 3400,
      saldo: 30300,
      tipo: "projecao",
    },
    {
      data: "15/12",
      entradas: 7100,
      saidas: 4500,
      saldo: 32900,
      tipo: "projecao",
    },
  ];

  const categoriasEntrada = [
    { categoria: "Vendas à Vista", valor: 45200, percentual: 65 },
    { categoria: "Recebimentos", valor: 18400, percentual: 26.5 },
    { categoria: "Outros", valor: 5900, percentual: 8.5 },
  ];

  const categoriasSaida = [
    { categoria: "Fornecedores", valor: 28500, percentual: 55 },
    { categoria: "Salários", valor: 12800, percentual: 25 },
    { categoria: "Despesas Operacionais", valor: 8200, percentual: 16 },
    { categoria: "Impostos", valor: 2100, percentual: 4 },
  ];

  const comparativoPeriodos = [
    { periodo: "Este Mês", entradas: 69500, saidas: 51600, saldo: 17900 },
    { periodo: "Mês Anterior", entradas: 58200, saidas: 45800, saldo: 12400 },
    {
      periodo: "Mesmo Mês Ano Anterior",
      entradas: 52100,
      saidas: 41200,
      saldo: 10900,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-700 mb-2">
            Fluxo de Caixa
          </h1>
          <p className="text-slate-500">
            Visualize entradas, saídas e projeções financeiras
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={periodo} onValueChange={setPeriodo}>
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
          <Select value={tipoVisualizacao} onValueChange={setTipoVisualizacao}>
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

      <ResumoCards
        fluxoCaixaHistorico={fluxoCaixaHistorico}
        projecaoFutura={projecaoFutura}
      />
      <GraficoFluxo
        fluxoCaixaHistorico={fluxoCaixaHistorico}
        projecaoFutura={projecaoFutura}
      />
      <Categorias entradas={categoriasEntrada} saidas={categoriasSaida} />
      <ComparativoPeriodos dados={comparativoPeriodos} />
    </div>
  );
}
