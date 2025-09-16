import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sun, Moon, Monitor } from "lucide-react";

interface Tema {
  id: string;
  nome: string;
  icone: any;
  descricao: string;
}

interface TemaSelectorProps {
  tema: string;
  setTema: (id: string) => void;
}

const temas: Tema[] = [
  {
    id: "claro",
    nome: "Claro",
    icone: Sun,
    descricao: "Tema claro para uso diurno",
  },
  {
    id: "escuro",
    nome: "Escuro",
    icone: Moon,
    descricao: "Tema escuro para reduzir cansaço visual",
  },
  {
    id: "sistema",
    nome: "Sistema",
    icone: Monitor,
    descricao: "Segue as configurações do sistema",
  },
];

export function TemaSelector({ tema, setTema }: TemaSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="h-5 w-5" />
          Tema
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {temas.map((temaOpcao) => {
            const Icone = temaOpcao.icone;
            return (
              <div
                key={temaOpcao.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  tema === temaOpcao.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setTema(temaOpcao.id)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icone className="h-5 w-5" />
                  <h4 className="font-medium">{temaOpcao.nome}</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  {temaOpcao.descricao}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
