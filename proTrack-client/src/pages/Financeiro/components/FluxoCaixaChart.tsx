import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const fluxoCaixaDados = [
  { data: "01/12", entrada: 4500, saida: 2300 },
  { data: "02/12", entrada: 3200, saida: 1800 },
  { data: "03/12", entrada: 5400, saida: 3100 },
  { data: "04/12", entrada: 6200, saida: 2900 },
  { data: "05/12", entrada: 4800, saida: 3500 },
  { data: "06/12", entrada: 7100, saida: 4200 },
  { data: "07/12", entrada: 5900, saida: 3800 },
];

export function FluxoCaixaChart() {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Fluxo de Caixa (7 dias)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={fluxoCaixaDados}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis dataKey="data" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="entrada"
              stroke="#A5D8FF"
              strokeWidth={2}
              name="Entradas"
            />
            <Line
              type="monotone"
              dataKey="saida"
              stroke="#FFB3B3"
              strokeWidth={2}
              name="Saídas"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
