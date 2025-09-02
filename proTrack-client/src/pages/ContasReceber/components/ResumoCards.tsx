import { Card, CardContent } from "../../../components/ui/card";
import { DollarSign, AlertCircle, Calendar } from "lucide-react";

interface Props {
  totalPendente: number;
  totalVencido: number;
  totalContas: number;
}

export function ResumoCards({
  totalPendente,
  totalVencido,
  totalContas,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total a Receber */}
      <Card className="bg-blue-100 border-blue-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total a Receber</p>
              <h3 className="text-2xl font-bold text-gray-900">
                R${" "}
                {totalPendente.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </div>
            <DollarSign className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      {/* Contas Vencidas */}
      <Card className="bg-red-100 border-red-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Contas Vencidas</p>
              <h3 className="text-2xl font-bold text-red-600">
                R${" "}
                {totalVencido.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </CardContent>
      </Card>

      {/* Total de Contas */}
      <Card className="bg-green-100 border-green-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Contas</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {totalContas}
              </h3>
            </div>
            <Calendar className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
