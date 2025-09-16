import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Smartphone, Settings } from "lucide-react";

interface Config2FA {
  ativo: boolean;
  emailBackup: boolean;
  codigoRecuperacao: boolean;
}

interface Props {
  config: Config2FA;
  setConfig: React.Dispatch<React.SetStateAction<Config2FA>>;
}

export function Autenticacao2FA({ config, setConfig }: Props) {
  const toggle = () => setConfig((prev) => ({ ...prev, ativo: !prev.ativo }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Autenticação de Dois Fatores (2FA)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div>
            <h4 className="font-medium">Ativar 2FA</h4>
            <p className="text-sm text-muted-foreground">
              Proteja sua conta com verificação em duas etapas
            </p>
          </div>
          <Switch checked={config.ativo} onCheckedChange={toggle} />
        </div>

        {config.ativo && (
          <div className="space-y-3 p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <span className="text-sm">Email de backup</span>
              <Switch
                checked={config.emailBackup}
                onCheckedChange={(c) =>
                  setConfig((prev) => ({ ...prev, emailBackup: c }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Códigos de recuperação</span>
              <Switch
                checked={config.codigoRecuperacao}
                onCheckedChange={(c) =>
                  setConfig((prev) => ({ ...prev, codigoRecuperacao: c }))
                }
              />
            </div>

            <Separator />

            <Button variant="outline" size="sm" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Configurar Aplicativo Autenticador
            </Button>

            <Button variant="outline" size="sm" className="w-full">
              Gerar Códigos de Recuperação
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
