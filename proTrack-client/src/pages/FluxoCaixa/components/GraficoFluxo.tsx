import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  ComposedChart,
  Area,
} from "recharts";

interface FluxoCaixaItem {
  data: string; // Ex: "2025-09-03"
  saldo: number; // Saldo acumulado
  entradas: number; // Entradas de caixa
  saidas: number; // Saídas de caixa
}

interface Props {
  fluxoCaixaHistorico: FluxoCaixaItem[];
  projecaoFutura: FluxoCaixaItem[];
}

export function GraficoFluxo({ fluxoCaixaHistorico, projecaoFutura }: Props) {
  const dadosCompletos = [...fluxoCaixaHistorico, ...projecaoFutura];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Fluxo de Caixa Histórico e Projeções</CardTitle>
          <div className="flex gap-2">
            <Badge className="bg-blue-100 text-blue-900">Histórico</Badge>
            <Badge className="bg-purple-100 text-purple-900">Projeção</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={dadosCompletos}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="saldo"
              fill="rgba(79, 70, 229, 0.1)"
              stroke="rgb(79, 70, 229)"
              strokeWidth={2}
              name="Saldo Acumulado"
            />
            <Bar dataKey="entradas" fill="rgb(56, 189, 248)" name="Entradas" />
            <Bar dataKey="saidas" fill="rgb(248, 113, 113)" name="Saídas" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
