import type { DashboardDados } from "../../../@types/types.api";
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
  dados: DashboardDados;
}

export function GraficosPrincipais({ dados }: GraficosPrincipaisProps) {
  console.log("dados.evolucaoLucroMensal", dados.evolucaoLucroMensal);

  // Transformar os dados da melhor margem para o formato do gráfico
  const dadosMelhorMargem =
    dados.melhorMargem?.produtos
      ?.map((produto) => ({
        produto: produto.nome,
        lucro: produto.lucro_unitario,
        margem: produto.margem_lucro,
      }))
      // 🔽 inverter a ordem para que maior venha primeiro (esquerda)
      .sort((a, b) => b.lucro - a.lucro) ?? [];

  // Garantir que sempre seja um array de { mes, valor }
  const evolucaoFormatada: { mes: string; valor: number }[] = (
    dados.evolucaoLucroMensal ?? []
  )
    .map((item) => {
      // item pode ter evolucao ou ser simples
      if ("evolucao" in item && Array.isArray(item.evolucao)) {
        return item.evolucao.map((ev) => ({
          mes: ev.mes,
          valor: ev.lucro_mensal,
        }));
      } else if ("mes" in item && "lucro_mensal" in item) {
        return [{ mes: item.mes, valor: item.lucro_mensal }];
      } else {
        return [];
      }
    })
    .flat() // aqui você "achata" o array, equivalente ao flatMap
    .sort((a, b) => {
      const [m1, y1] = a.mes.split("/").map(Number);
      const [m2, y2] = b.mes.split("/").map(Number);
      return y1 !== y2 ? y1 - y2 : m1 - m2;
    });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-pastel-purple">
        <CardHeader>
          <CardTitle>Lucro por Produto (Top 5)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosMelhorMargem}>
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
          <CardTitle>Evolução do Lucro (Por mes)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolucaoFormatada}>
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
