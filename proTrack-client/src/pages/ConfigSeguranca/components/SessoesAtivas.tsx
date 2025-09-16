import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertTriangle } from "lucide-react";

interface Sessao {
  id: string;
  dispositivo: string;
  localizacao: string;
  ultimoAcesso: string;
  atual: boolean;
}

interface Props {
  sessoes: Sessao[];
}

export function SessoesAtivas({ sessoes }: Props) {
  const encerrar = (id: string) => {
    console.log("Sessão encerrada:", id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Sessões Ativas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sessoes.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                {s.atual ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-muted" />
                )}
                <div>
                  <h4 className="font-medium text-sm">{s.dispositivo}</h4>
                  <p className="text-xs text-muted-foreground">
                    {s.localizacao} • {s.ultimoAcesso}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {s.atual ? (
                  <Badge variant="secondary" className="text-xs">
                    Atual
                  </Badge>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => encerrar(s.id)}
                  >
                    Encerrar
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800 text-sm">Atenção</h4>
              <p className="text-xs text-yellow-700">
                Sessões não reconhecidas? Altere sua senha imediatamente.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
