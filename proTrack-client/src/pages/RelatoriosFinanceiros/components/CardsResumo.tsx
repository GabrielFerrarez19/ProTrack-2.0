import type { DashboardDados } from "../../../@types/types.api";
import { Card, CardContent } from "../../../components/ui/card";
import { TrendingUp, Package, DollarSign, Calendar } from "lucide-react";
import { formatBRL } from "../../../utils/functions";

// Tipagem das props
export interface CardsResumoProps {
  dados: DashboardDados;
  contasDetalhadas: {
    id?: number;
    data?: string;
    descricao?: string;
    categoria?: string;
    valor: number;
  }[];
}

export function CardsResumo({ dados, contasDetalhadas }: CardsResumoProps) {
  console.log(
    "Margem de lucro total:",
    dados.margemTotal?.margem_lucro_total ?? 0
  );

  const totalReceber = formatBRL(dados.financeiro?.total_geral) ?? 0;

  const totalPagar = contasDetalhadas
    .filter((c) => c.valor < 0)
    .reduce((sum, c) => sum + Math.abs(c.valor), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="bg-pastel-blue">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Margem de Lucro Total
              </p>
              <h3 className="text-2xl font-bold text-foreground">
                {formatBRL(dados.margemTotal?.margem_lucro_total ?? 0)}%
              </h3>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-300" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-pastel-green">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Valor em Estoque</p>
              <h3 className="text-2xl font-bold text-foreground">
                R$ {formatBRL(dados.estoque?.totalEstoque ?? 0)}
              </h3>
            </div>
            <Package className="h-8 w-8 text-green-300" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-pastel-yellow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">A Receber</p>
              <h3 className="text-2xl font-bold text-yellow-600">
                R$ {totalReceber}
              </h3>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-pastel-red">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">A Pagar</p>
              <h3 className="text-2xl font-bold text-red-400">
                R$ {totalPagar.toLocaleString("pt-BR")}
              </h3>
            </div>
            <Calendar className="h-8 w-8 text-red-300" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
