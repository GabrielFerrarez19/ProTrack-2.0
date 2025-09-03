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
  formatarMoeda: (valor: number) => string;
}

export function SummaryCards({
  totalPendente,
  totalVencido,
  totalAgendado,
  totalCount,
  contasVencidasCount,
  formatarMoeda,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      {/* Total a Pagar */}
      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total a Pagar</p>
            <h3 className="text-2xl font-bold text-foreground">
              {formatarMoeda(totalPendente)}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Contas pendentes
            </p>
          </div>
          <DollarSign className="h-8 w-8 text-destructive" />
        </CardContent>
      </Card>

      {/* Contas Vencidas */}
      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Contas Vencidas</p>
            <h3 className="text-2xl font-bold text-destructive">
              {formatarMoeda(totalVencido)}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {contasVencidasCount} conta{contasVencidasCount !== 1 ? "s" : ""}
            </p>
          </div>
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </CardContent>
      </Card>

      {/* Pagamentos Agendados */}
      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Pagamentos Agendados
            </p>
            <h3 className="text-2xl font-bold text-primary">
              {formatarMoeda(totalAgendado)}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Contas agendadas
            </p>
          </div>
          <Clock className="h-8 w-8 text-primary" />
        </CardContent>
      </Card>

      {/* Total de Contas */}
      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total de Contas</p>
            <h3 className="text-2xl font-bold text-foreground">{totalCount}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Contas cadastradas
            </p>
          </div>
          <Calendar className="h-8 w-8 text-muted-foreground" />
        </CardContent>
      </Card>

      {/* Status Geral */}
      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Status Geral</p>
            <h3 className="text-lg font-bold text-foreground">
              {totalVencido > 0 ? "⚠️ Atenção" : "✅ Em dia"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {totalVencido > 0
                ? `${contasVencidasCount} conta${
                    contasVencidasCount !== 1 ? "s" : ""
                  } vencida${contasVencidasCount !== 1 ? "s" : ""}`
                : "Todas as contas em dia"}
            </p>
          </div>
          <TrendingUp
            className={`h-8 w-8 ${
              totalVencido > 0 ? "text-destructive" : "text-green-600"
            }`}
          />
        </CardContent>
      </Card>
    </div>
  );
}
