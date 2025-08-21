import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Switch } from "../../../components/ui/switch";
import { Bell } from "lucide-react";

interface Props {
  alertas: {
    contasVencidas: boolean;
    estoqueMinimo: boolean;
    fluxoCaixaNegativo: boolean;
    metaVendas: boolean;
    limiteCredito: boolean;
  };
  setAlertas: React.Dispatch<React.SetStateAction<Props["alertas"]>>;
}

export function Alertas({ alertas, setAlertas }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Configurações de Alertas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {[
            {
              key: "contasVencidas",
              label: "Contas Vencidas",
              desc: "Alertar sobre contas em atraso",
            },
            {
              key: "estoqueMinimo",
              label: "Estoque Mínimo",
              desc: "Alertar sobre produtos com estoque baixo",
            },
            {
              key: "fluxoCaixaNegativo",
              label: "Fluxo de Caixa Negativo",
              desc: "Alertar quando saldo ficar negativo",
            },
            {
              key: "metaVendas",
              label: "Meta de Vendas",
              desc: "Alertar sobre metas não atingidas",
            },
            {
              key: "limiteCredito",
              label: "Limite de Crédito",
              desc: "Alertar sobre limites excedidos",
            },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{label}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
              <Switch
                checked={alertas[key as keyof typeof alertas]}
                onCheckedChange={(checked) =>
                  setAlertas((prev) => ({ ...prev, [key]: checked }))
                }
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
