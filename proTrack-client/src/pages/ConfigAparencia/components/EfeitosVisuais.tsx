import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface EfeitosVisuaisProps {
  animacoes: boolean;
  setAnimacoes: (valor: boolean) => void;
}

export function EfeitosVisuais({
  animacoes,
  setAnimacoes,
}: EfeitosVisuaisProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Efeitos Visuais
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div>
            <h4 className="font-medium">Animações</h4>
            <p className="text-sm text-muted-foreground">
              Habilita transições e animações suaves
            </p>
          </div>
          <Switch checked={animacoes} onCheckedChange={setAnimacoes} />
        </div>
      </CardContent>
    </Card>
  );
}
