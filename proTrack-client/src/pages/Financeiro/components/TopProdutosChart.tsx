import { useState } from "react";
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
export function TopProdutosChart() {
  const [topProdutos] = useState<
    { nome: string; vendas: number; lucro?: number }[]
  >([]);
  const loading = false;

  if (loading) return <p className="p-6">Carregando top produtos...</p>;
  if (!topProdutos.length)
    return <p className="p-6">Nenhum produto encontrado.</p>;

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
            {topProdutos.some((p) => p.lucro !== undefined) && (
              <Bar dataKey="lucro" fill="#B9FBC0" name="Lucro" />
            )}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
