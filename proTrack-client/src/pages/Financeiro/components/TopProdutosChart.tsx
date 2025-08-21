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

const topProdutos = [
  { nome: "Produto A", vendas: 4500, lucro: 1350 },
  { nome: "Produto B", vendas: 3200, lucro: 960 },
  { nome: "Produto C", vendas: 2800, lucro: 840 },
  { nome: "Produto D", vendas: 2100, lucro: 630 },
];

export function TopProdutosChart() {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Top Produtos</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProdutos}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis dataKey="nome" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip />
            <Bar dataKey="vendas" fill="#A5D8FF" name="Vendas" />
            <Bar dataKey="lucro" fill="#B9FBC0" name="Lucro" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
