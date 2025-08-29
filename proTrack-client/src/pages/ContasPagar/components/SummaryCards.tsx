import { Card, CardContent } from "../../../components/ui/card";
import { DollarSign, AlertTriangle, Clock, Calendar } from "lucide-react";

interface SummaryCardsProps {
  totalPendente: number;
  totalVencido: number;
  totalAgendado: number;
  totalCount: number;
}

export function SummaryCards({
  totalPendente,
  totalVencido,
  totalAgendado,
  totalCount,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total a Pagar</p>
            <h3 className="text-2xl font-bold text-foreground">
              R{"$"}{" "}
              {totalPendente.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </h3>
          </div>
          <DollarSign className="h-8 w-8 text-destructive" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Contas Vencidas</p>
            <h3 className="text-2xl font-bold text-destructive">
              R{"$"}{" "}
              {totalVencido.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </h3>
          </div>
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Pagamentos Agendados
            </p>
            <h3 className="text-2xl font-bold text-primary">
              R{"$"}{" "}
              {totalAgendado.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </h3>
          </div>
          <Clock className="h-8 w-8 text-primary" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total de Contas</p>
            <h3 className="text-2xl font-bold text-foreground">{totalCount}</h3>
          </div>
          <Calendar className="h-8 w-8 text-muted-foreground" />
        </CardContent>
      </Card>
    </div>
  );
}
