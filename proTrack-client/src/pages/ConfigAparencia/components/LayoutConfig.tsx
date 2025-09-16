import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Layout } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface LayoutConfigProps {
  layoutCompacto: boolean;
  setLayoutCompacto: (valor: boolean) => void;
  bordaArredondada: boolean;
  setBordaArredondada: (valor: boolean) => void;
}

export function LayoutConfig({
  layoutCompacto,
  setLayoutCompacto,
  bordaArredondada,
  setBordaArredondada,
}: LayoutConfigProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layout className="h-5 w-5" />
          Layout e Espaçamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div>
            <h4 className="font-medium">Layout Compacto</h4>
            <p className="text-sm text-muted-foreground">
              Reduz o espaçamento para mostrar mais conteúdo
            </p>
          </div>
          <Switch
            checked={layoutCompacto}
            onCheckedChange={setLayoutCompacto}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div>
            <h4 className="font-medium">Bordas Arredondadas</h4>
            <p className="text-sm text-muted-foreground">
              Usa bordas arredondadas nos componentes
            </p>
          </div>
          <Switch
            checked={bordaArredondada}
            onCheckedChange={setBordaArredondada}
          />
        </div>
      </CardContent>
    </Card>
  );
}
