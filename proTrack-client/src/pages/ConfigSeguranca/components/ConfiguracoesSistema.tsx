import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Settings } from "lucide-react";

interface ConfigSistema {
  loginAutomatico: boolean;
  notificacoesSeguranca: boolean;
  logAtividades: boolean;
  bloqueioTentativas: boolean;
}

interface Props {
  config: ConfigSistema;
  setConfig: React.Dispatch<React.SetStateAction<ConfigSistema>>;
}

export function ConfiguracoesSistema({ config, setConfig }: Props) {
  const descricoes: Record<string, string> = {
    loginAutomatico: "Permitir login automático neste dispositivo",
    notificacoesSeguranca: "Receber alertas sobre atividades suspeitas",
    logAtividades: "Manter registro de todas as atividades",
    bloqueioTentativas: "Bloquear após tentativas de login falhadas",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configurações de Sistema
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(config).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div>
                <h4 className="font-medium capitalize">
                  {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {descricoes[key] || "Configuração de sistema"}
                </p>
              </div>
              <Switch
                checked={value}
                onCheckedChange={(c) =>
                  setConfig((prev) => ({ ...prev, [key]: c }))
                }
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
