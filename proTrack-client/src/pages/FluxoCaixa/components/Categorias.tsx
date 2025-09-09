import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

interface Categoria {
  categoria: string;
  valor: number;
  percentual: number;
}

interface Props {
  entradas: Categoria[];
  saidas: Categoria[];
}

export function Categorias({ entradas, saidas }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Entradas */}
      <Card>
        <CardHeader>
          <CardTitle>Entradas por Categoria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {entradas.map((c, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{c.categoria}</span>
                <span className="text-sm text-slate-500">
                  R$
                  {c.valor.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-300 h-2 rounded-full transition-all"
                  style={{ width: `${c.percentual}%` }}
                />
              </div>
              <span className="text-xs text-slate-500">
                {Number(c.percentual).toFixed(2)}%
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Saídas */}
      <Card>
        <CardHeader>
          <CardTitle>Saídas por Categoria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {saidas.map((c, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{c.categoria}</span>
                <span className="text-sm text-slate-500">
                  R$
                  {c.valor.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-red-300 h-2 rounded-full transition-all"
                  style={{ width: `${c.percentual}%` }}
                />
              </div>
              <span className="text-xs text-slate-500">
                {Number(c.percentual).toFixed(2)}%
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
