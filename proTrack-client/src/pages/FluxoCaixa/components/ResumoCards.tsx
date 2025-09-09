import { Card, CardContent } from "../../../components/ui/card";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from "lucide-react";

interface Props {
  fluxoCaixaHistorico: { entradas: number; saidas: number }[];
  projecaoFutura: { entradas: number; saidas: number }[];
  resumo?: {
    saldo_atual: number;
    total_entradas: number;
    total_saidas: number;
    projecao_30_dias: number;
    crescimento_percentual: number;
  };
}

export function ResumoCards({
  fluxoCaixaHistorico,
  projecaoFutura,
  resumo,
}: Props) {
  // Usar dados do resumo se disponível, senão calcular dos arrays
  const saldoAtual =
    resumo?.saldo_atual ??
    fluxoCaixaHistorico.reduce((sum, item) => sum + item.entradas, 0) -
      fluxoCaixaHistorico.reduce((sum, item) => sum + item.saidas, 0);

  const totalEntradas =
    resumo?.total_entradas ??
    fluxoCaixaHistorico.reduce((sum, item) => sum + item.entradas, 0);

  const totalSaidas =
    resumo?.total_saidas ??
    fluxoCaixaHistorico.reduce((sum, item) => sum + item.saidas, 0);

  const projecao30Dias =
    resumo?.projecao_30_dias ??
    projecaoFutura.reduce(
      (sum, item) => sum + (item.entradas - item.saidas),
      0
    );

  const crescimento =
    resumo?.crescimento_percentual ?? ((saldoAtual - 12400) / 12400) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Saldo Atual */}
      <Card className="bg-green-100 text-green-900">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Saldo Atual</p>
              <h3 className="text-2xl font-bold">
                R$
                {saldoAtual.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </h3>
              <div className="flex items-center gap-1 mt-2">
                {crescimento >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-700" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm opacity-80">
                  {Math.abs(crescimento).toFixed(1)}% vs mês anterior
                </span>
              </div>
            </div>
            <DollarSign className="h-8 w-8 opacity-80" />
          </div>
        </CardContent>
      </Card>

      {/* Entradas */}
      <Card className="bg-blue-100 text-blue-900">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Total Entradas</p>
              <h3 className="text-2xl font-bold">
                R$
                {totalEntradas.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-700" />
          </div>
        </CardContent>
      </Card>

      {/* Saídas */}
      <Card className="bg-red-100 text-red-900">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Total Saídas</p>
              <h3 className="text-2xl font-bold">
                R$
                {totalSaidas.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </div>
            <TrendingDown className="h-8 w-8 text-red-700" />
          </div>
        </CardContent>
      </Card>

      {/* Projeção */}
      <Card className="bg-purple-100 text-purple-900">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Projeção 30 dias</p>
              <h3 className="text-2xl font-bold">
                R$
                {projecao30Dias.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </div>
            <Calendar className="h-8 w-8 text-purple-700" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
