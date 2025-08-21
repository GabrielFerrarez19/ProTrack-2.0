import type { MetodoPagamento } from "../../../@types/types.components";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Switch } from "../../../components/ui/switch";
import { CreditCard } from "lucide-react";

interface Props {
  metodosPagamento: MetodoPagamento[];
  setMetodosPagamento: React.Dispatch<React.SetStateAction<MetodoPagamento[]>>;
}

export function MetodosPagamento({
  metodosPagamento,
  setMetodosPagamento,
}: Props) {
  const handleToggleMetodo = (id: string) => {
    setMetodosPagamento((metodos) =>
      metodos.map((m) => (m.id === id ? { ...m, ativo: !m.ativo } : m))
    );
  };

  const getTipoMetodoIcon = (tipo: string) => {
    switch (tipo) {
      case "dinheiro":
        return "💵";
      case "cartao":
        return "💳";
      case "pix":
        return "📱";
      case "transferencia":
        return "🏦";
      default:
        return "💰";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Métodos de Pagamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metodosPagamento.map((metodo) => (
            <div
              key={metodo.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {getTipoMetodoIcon(metodo.tipo)}
                </span>
                <div>
                  <p className="font-medium text-foreground">{metodo.nome}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {metodo.tipo}
                  </p>
                </div>
              </div>
              <Switch
                checked={metodo.ativo}
                onCheckedChange={() => handleToggleMetodo(metodo.id)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
