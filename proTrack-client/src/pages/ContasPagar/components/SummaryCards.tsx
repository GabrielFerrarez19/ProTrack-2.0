import { Card, CardContent } from "../../../components/ui/card";
import {
  DollarSign,
  AlertTriangle,
  Clock,
  Calendar,
  TrendingUp,
} from "lucide-react";

interface SummaryCardsProps {
  totalPendente: number;
  totalVencido: number;
  totalAgendado: number;
  totalCount: number;
  contasVencidasCount: number;
  totalVencidasMonitoramento?: number;
  formatarMoeda: (valor: number) => string;
}

export function SummaryCards({
  totalPendente,
  totalVencido,
  totalAgendado,
  totalCount,
  contasVencidasCount,
  totalVencidasMonitoramento,
  formatarMoeda,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      {/* Total a Pagar */}
      <Card className="bg-pink-100 border-pink-200">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-pink-700">Total a Pagar</p>
            <h3 className="text-2xl font-bold text-pink-800">
              {formatarMoeda(totalPendente)}
            </h3>
            <p className="text-xs text-pink-600 mt-1">Contas pendentes</p>
          </div>
          <DollarSign className="h-8 w-8 text-pink-500" />
        </CardContent>
      </Card>

      {/* Contas Vencidas */}
      <Card className="bg-red-100 border-red-200">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-red-700">Contas Vencidas</p>
            <h3 className="text-2xl font-bold text-red-800">
              {formatarMoeda(totalVencido)}
            </h3>
            <p className="text-xs text-red-600 mt-1">
              {totalVencidasMonitoramento !== undefined
                ? `${totalVencidasMonitoramento} conta${
                    totalVencidasMonitoramento !== 1 ? "s" : ""
                  }`
                : `${contasVencidasCount} conta${
                    contasVencidasCount !== 1 ? "s" : ""
                  }`}
            </p>
          </div>
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </CardContent>
      </Card>

      {/* Pagamentos Agendados */}
      <Card className="bg-blue-100 border-blue-200">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-700">Pagamentos Agendados</p>
            <h3 className="text-2xl font-bold text-blue-800">
              {formatarMoeda(totalAgendado)}
            </h3>
            <p className="text-xs text-blue-600 mt-1">Contas agendadas</p>
          </div>
          <Clock className="h-8 w-8 text-blue-500" />
        </CardContent>
      </Card>

      {/* Total de Contas */}
      <Card className="bg-purple-100 border-purple-200">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-700">Total de Contas</p>
            <h3 className="text-2xl font-bold text-purple-800">{totalCount}</h3>
            <p className="text-xs text-purple-600 mt-1">Contas cadastradas</p>
          </div>
          <Calendar className="h-8 w-8 text-purple-500" />
        </CardContent>
      </Card>

      {/* Status Geral */}
      <Card
        className={`${
          totalVencido > 0 ||
          (totalVencidasMonitoramento && totalVencidasMonitoramento > 0)
            ? "bg-red-100 border-red-200"
            : "bg-green-100 border-green-200"
        }`}
      >
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Status Geral</p>
            <h3
              className={`text-lg font-bold ${
                totalVencido > 0 ||
                (totalVencidasMonitoramento && totalVencidasMonitoramento > 0)
                  ? "text-red-800"
                  : "text-green-800"
              }`}
            >
              {totalVencido > 0 ||
              (totalVencidasMonitoramento && totalVencidasMonitoramento > 0)
                ? "⚠️ Atenção"
                : "✅ Em dia"}
            </h3>
            <p
              className={`text-xs mt-1 ${
                totalVencido > 0 ||
                (totalVencidasMonitoramento && totalVencidasMonitoramento > 0)
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {totalVencido > 0 ||
              (totalVencidasMonitoramento && totalVencidasMonitoramento > 0)
                ? `${
                    totalVencidasMonitoramento !== undefined
                      ? totalVencidasMonitoramento
                      : contasVencidasCount
                  } conta${
                    (totalVencidasMonitoramento !== undefined
                      ? totalVencidasMonitoramento
                      : contasVencidasCount) !== 1
                      ? "s"
                      : ""
                  } vencida${
                    (totalVencidasMonitoramento !== undefined
                      ? totalVencidasMonitoramento
                      : contasVencidasCount) !== 1
                      ? "s"
                      : ""
                  }`
                : "Todas as contas em dia"}
            </p>
          </div>
          <TrendingUp
            className={`h-8 w-8 ${
              totalVencido > 0 ||
              (totalVencidasMonitoramento && totalVencidasMonitoramento > 0)
                ? "text-red-500"
                : "text-green-500"
            }`}
          />
        </CardContent>
      </Card>
    </div>
  );
}
