import { useEffect, useState } from "react";
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
import type { ProdutosMaisVendidosResponse } from "../../../@types/types.api";
import { fetchProdutosMaisVendidos } from "../../../services/api";

export function TopProdutosChart() {
  const [topProdutos, setTopProdutos] = useState<
    { nome: string; vendas: number; lucro?: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopProdutos = async () => {
      try {
        setLoading(true);
        const data: ProdutosMaisVendidosResponse =
          await fetchProdutosMaisVendidos(4); // Buscar somente os 4 mais vendidos

        // Transformando os dados para o formato do gráfico
        const chartData = data.produtos.map((p) => ({
          nome: p.nome,
          vendas: p.total_vendido,
          lucro: undefined, // opcional, se você tiver lucro calculado pode adicionar
        }));
        setTopProdutos(chartData);
      } catch (err) {
        console.error("Erro ao buscar top produtos:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTopProdutos();
  }, []);

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
