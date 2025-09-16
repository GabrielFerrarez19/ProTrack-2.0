import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface AcessibilidadeProps {
  contrasteAlto: boolean;
  setContrasteAlto: (valor: boolean) => void;
}

export function Acessibilidade({
  contrasteAlto,
  setContrasteAlto,
}: AcessibilidadeProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Acessibilidade
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div>
            <h4 className="font-medium">Alto Contraste</h4>
            <p className="text-sm text-muted-foreground">
              Aumenta o contraste para melhor legibilidade
            </p>
          </div>
          <Switch checked={contrasteAlto} onCheckedChange={setContrasteAlto} />
        </div>
      </CardContent>
    </Card>
  );
}
