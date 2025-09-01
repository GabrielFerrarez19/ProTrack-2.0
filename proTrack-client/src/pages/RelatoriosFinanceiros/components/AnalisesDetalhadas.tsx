import type { DashboardDados } from "../../../@types/types.api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { formatBRL } from "../../../utils/functions";

// Tipagem
export interface AnalisesDetalhadasProps {
  dados: DashboardDados;
}

export function AnalisesDetalhadas({ dados }: AnalisesDetalhadasProps) {
  const cores = ["#ffd6d6", "#fff3b0", "#caffbf", "#9bf6ff", "#ffc6ff"];

  // Usar dados da API
  const margemLucroDistribuicao =
    dados.distribuicaoMargemLucro?.distribuicao || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-pastel-yellow">
        <CardHeader>
          <CardTitle>Distribuição de Margem de Lucro</CardTitle>
          {dados.distribuicaoMargemLucro && (
            <p className="text-sm text-muted-foreground">
              Total: {dados.distribuicaoMargemLucro.total_produtos} produtos |
              Margem Média:{" "}
              {dados.distribuicaoMargemLucro.margem_media_geral.toFixed(1)}%
            </p>
          )}
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={margemLucroDistribuicao}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="qtd"
              >
                {margemLucroDistribuicao.map((_, index) => (
                  <Cell key={index} fill={cores[index % cores.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [
                  `${value} produtos (${margemLucroDistribuicao
                    .find((item) => item.qtd === value)
                    ?.percentual.toFixed(1)}%)`,
                  "Quantidade",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 gap-2 mt-4">
            {margemLucroDistribuicao.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cores[index % cores.length] }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.faixa}: {item.qtd} produtos (
                  {item.percentual.toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-pastel-blue">
        <CardHeader>
          <CardTitle>Investimento em Estoque por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dados.valorInvestidoPorCategoria?.categorias.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-white/30"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {item.categoria}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.quantidade_produtos} produtos |{" "}
                    {item.percentual_total.toFixed(1)}% do total
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    R$ {formatBRL(item.valor_investido)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Média: R$ {formatBRL(item.preco_medio_custo)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
