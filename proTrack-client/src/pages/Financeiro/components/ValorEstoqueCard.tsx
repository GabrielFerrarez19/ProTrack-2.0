import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";
import { Button } from "../../../components/ui/button";
import { Package } from "lucide-react";
import type { DashboardDados } from "../../../@types/types.api";
import { formatBRL } from "../../../utils/functions";
import { useNavigate } from "react-router-dom";

interface ValorEstoqueCardProps {
  dados: DashboardDados;
}

export function ValorEstoqueCard({ dados }: ValorEstoqueCardProps) {
  const navigate = useNavigate();
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-gray-400" />
          Valor em Estoque
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-2xl font-bold text-gray-800">
              R$ {formatBRL(dados.custoTotalEstoque ?? 0)}
            </p>
            <p className="text-sm text-gray-400">Total investido</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Giro de estoque</span>
              <span className="font-medium text-gray-800">{0}%</span>
            </div>
            <Progress value={0} className="h-2 bg-blue-100" />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full cursor-pointer"
            onClick={() => navigate("/relatorio")}
          >
            Ver Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
