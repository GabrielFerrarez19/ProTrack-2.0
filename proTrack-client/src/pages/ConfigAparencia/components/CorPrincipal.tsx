import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Palette } from "lucide-react";

interface CorPersonalizada {
  nome: string;
  valor: string;
  ativa: boolean;
}

interface CorPrincipalProps {
  cores: CorPersonalizada[];
  handleSelecionarCor: (index: number) => void;
}

export function CorPrincipal({
  cores,
  handleSelecionarCor,
}: CorPrincipalProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Cor Principal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {cores.map((cor, index) => (
            <div
              key={cor.nome}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                cor.ativa
                  ? "border-primary"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => handleSelecionarCor(index)}
            >
              <div
                className="w-full h-8 rounded mb-2"
                style={{ backgroundColor: cor.valor }}
              />
              <p className="text-sm font-medium text-center">{cor.nome}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
