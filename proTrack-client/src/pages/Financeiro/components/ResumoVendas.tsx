import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { TrendingUp } from "lucide-react";
import { formatBRL, getBadgeClass } from "../../../utils/functions";
import type { DashboardDados } from "@/@types/types.api";

interface SaldoCardsProps {
  dados: DashboardDados;
}

export function ResumoVendas({ dados }: SaldoCardsProps) {
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
              R${formatBRL(dados.vendasEsseMes ?? "0,00")}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant="secondary"
                className={getBadgeClass(dados?.crescimento ?? 0)}
              >
                {formatBRL(dados?.crescimento ?? 0)}%
              </Badge>
              <span className="text-sm text-gray-400">vs mês anterior</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400">Mês Anterior</p>
            <p className="text-xl font-semibold text-gray-500">
              R${formatBRL(dados.vendasMesPassado ?? "0,00")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
