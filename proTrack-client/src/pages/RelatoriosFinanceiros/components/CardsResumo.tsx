import { Card, CardContent } from "../../../components/ui/card";
import { TrendingUp, Package, DollarSign, Calendar } from "lucide-react";

// Tipagem das props
export interface CardsResumoProps {
  contasDetalhadas: {
    id?: number;
    data?: string;
    descricao?: string;
    categoria?: string;
    valor: number;
  }[];
  estoqueInvestimento: { categoria: string; valor: number }[];
  lucroPorProduto: { produto: string; lucro: number }[];
}

export function CardsResumo({
  contasDetalhadas,
  estoqueInvestimento,
  lucroPorProduto,
}: CardsResumoProps) {
  const getMargemLucroTotal = () => {
    const totalVendas = lucroPorProduto.reduce((sum, p) => sum + p.lucro, 0);
    return totalVendas > 0 ? totalVendas / lucroPorProduto.length : 0;
  };

  const getTotalInvestimentoEstoque = () => {
    return estoqueInvestimento.reduce((sum, item) => sum + item.valor, 0);
  };

  const totalReceber = contasDetalhadas
    .filter((c) => c.valor > 0)
    .reduce((sum, c) => sum + c.valor, 0);

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
                {getMargemLucroTotal().toFixed(1)}%
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
                R$ {getTotalInvestimentoEstoque().toLocaleString("pt-BR")}
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
                R$ {totalReceber.toLocaleString("pt-BR")}
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
