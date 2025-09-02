import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";

interface CardMonitoramentoProps {
  monitoramentoExecutado: boolean;
}

export function CardMonitoramento({
  monitoramentoExecutado,
}: CardMonitoramentoProps) {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <span>🔄</span>
          <span>Sistema de Monitoramento de Vendas Vencidas</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                monitoramentoExecutado ? "bg-green-500" : "bg-yellow-500"
              }`}
            ></div>
            <span className="text-muted-foreground">Status:</span>
            <span className="font-medium">
              {monitoramentoExecutado ? "Ativo" : "Pendente"}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span>⏰</span>
            <span className="text-muted-foreground">Frequência:</span>
            <span className="font-medium">A cada 5 minutos</span>
          </div>
        </div>

        <div className="mt-3 text-xs text-muted-foreground">
          💡 O sistema monitora automaticamente vendas vencidas e atualiza seus
          status.
          {monitoramentoExecutado
            ? " Monitoramento ativo e funcionando normalmente."
            : ' Clique em "Executar Monitoramento" para ativar.'}
        </div>
      </CardContent>
    </Card>
  );
}
