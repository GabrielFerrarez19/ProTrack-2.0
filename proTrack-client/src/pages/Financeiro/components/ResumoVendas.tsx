import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { TrendingUp } from "lucide-react";

interface ResumoVendasProps {
  vendas: {
    mesAtual?: number;
    mesAnterior?: number;
    crescimento?: number;
  } | null; // <- adicionamos null aqui
}

export function ResumoVendas({ vendas }: ResumoVendasProps) {
  return (
    <Card className="lg:col-span-2 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <TrendingUp className="h-5 w-5 text-blue-300" />
          Resumo de Vendas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Vendas do Mês</p>
            <p className="text-2xl font-bold text-gray-800">
              R${vendas?.mesAtual?.toLocaleString("pt-BR") ?? "0,00"}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700"
              >
                +{vendas?.crescimento ?? 0}%
              </Badge>
              <span className="text-sm text-gray-400">vs mês anterior</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400">Mês Anterior</p>
            <p className="text-xl font-semibold text-gray-500">
              R${vendas?.mesAnterior?.toLocaleString("pt-BR") ?? "0,00"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
