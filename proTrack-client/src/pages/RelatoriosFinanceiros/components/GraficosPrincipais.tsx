import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";

// Tipagem
export interface GraficosPrincipaisProps {
  lucroPorProduto: { produto: string; lucro: number }[];
  lucroPorPeriodo: { mes: string; valor: number }[];
}

export function GraficosPrincipais({
  lucroPorProduto,
  lucroPorPeriodo,
}: GraficosPrincipaisProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-pastel-purple">
        <CardHeader>
          <CardTitle>Lucro por Produto (Top 5)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={lucroPorProduto}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
              <XAxis dataKey="produto" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="lucro" fill="#cdb4db" name="Lucro" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-pastel-orange">
        <CardHeader>
          <CardTitle>Evolução do Lucro (3 meses)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lucroPorPeriodo}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="#ffb347"
                strokeWidth={3}
                name="Lucro"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
