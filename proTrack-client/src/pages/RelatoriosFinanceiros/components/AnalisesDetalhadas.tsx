import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

// Tipagem
export interface AnalisesDetalhadasProps {
  margemLucroDistribuicao: { faixa: string; qtd: number }[];
  estoqueInvestimento: { categoria: string; valor: number }[];
}

export function AnalisesDetalhadas({
  margemLucroDistribuicao,
  estoqueInvestimento,
}: AnalisesDetalhadasProps) {
  const cores = ["#ffd6d6", "#fff3b0", "#caffbf", "#9bf6ff", "#ffc6ff"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-pastel-yellow">
        <CardHeader>
          <CardTitle>Distribuição de Margem de Lucro</CardTitle>
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
              <Tooltip />
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
                  {item.faixa}: {item.qtd} produtos
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
            {estoqueInvestimento.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-white/30"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {item.categoria}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Valor: R$ {item.valor.toLocaleString("pt-BR")}
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
