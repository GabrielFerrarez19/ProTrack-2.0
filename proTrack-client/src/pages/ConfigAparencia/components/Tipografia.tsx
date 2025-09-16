import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Type } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface TipografiaProps {
  tamanhoFonte: number[];
  setTamanhoFonte: (valor: number[]) => void;
}

export function Tipografia({ tamanhoFonte, setTamanhoFonte }: TipografiaProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="h-5 w-5" />
          Tipografia
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-4 block">
            Tamanho da Fonte: {tamanhoFonte[0]}px
          </Label>
          <Slider
            value={tamanhoFonte}
            onValueChange={setTamanhoFonte}
            max={24}
            min={12}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Pequeno (12px)</span>
            <span>Grande (24px)</span>
          </div>
        </div>

        <div className="p-4 rounded-lg border">
          <p style={{ fontSize: `${tamanhoFonte[0]}px` }}>
            Exemplo de texto com o tamanho selecionado. Este é um preview de
            como os textos aparecerão na aplicação.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
