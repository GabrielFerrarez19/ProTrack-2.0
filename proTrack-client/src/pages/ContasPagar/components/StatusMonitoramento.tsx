import { Button } from "../../../components/ui/button";

interface StatusMonitoramentoProps {
  monitoramentoExecutado: boolean;
  executarMonitoramento: () => void;
  recarregarDados: () => void;
}

export function StatusMonitoramento({
  monitoramentoExecutado,
  executarMonitoramento,
  recarregarDados,
}: StatusMonitoramentoProps) {
  return (
    <div className="flex flex-col items-end space-y-2">
      <div className="flex items-center space-x-2">
        <div
          className={`w-3 h-3 rounded-full ${
            monitoramentoExecutado ? "bg-green-500" : "bg-yellow-500"
          }`}
        ></div>
        <span className="text-sm text-muted-foreground">
          {monitoramentoExecutado
            ? "Monitoramento Ativo"
            : "Monitoramento Pendente"}
        </span>
      </div>

      <div className="flex space-x-2">
        <Button
          onClick={executarMonitoramento}
          variant="outline"
          size="sm"
          className="text-xs cursor-pointer"
        >
          🔄 Executar Monitoramento
        </Button>
        <Button
          onClick={recarregarDados}
          variant="outline"
          size="sm"
          className="text-xs cursor-pointer"
        >
          📊 Atualizar Dados
        </Button>
      </div>
    </div>
  );
}
