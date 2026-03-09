import type { DashboardDados } from "@/@types/types.api";
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
} from "recharts";

interface TopProdutosChartProps {
  dados: DashboardDados;
}

export function TopProdutosChart({ dados }: TopProdutosChartProps) {
  // 1. Extraímos os dados da lista de produtos
  // O Recharts precisa de um array de objetos para funcionar
  const chartData = dados.Top5Products || [];

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Top 5 Produtos Mais Vendidos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E0E0E0"
              />

              <XAxis
                dataKey="name"
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                cursor={{ fill: "#f3f4f6" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />

              <Bar
                dataKey="total_quantity_sold"
                fill="#3b82f6"
                name="Qtd. Vendida"
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
