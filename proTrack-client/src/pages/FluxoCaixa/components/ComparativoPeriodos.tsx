import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

interface Props {
  dados: { periodo: string; entradas: number; saidas: number; saldo: number }[];
}

export function ComparativoPeriodos({ dados }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparativo entre Períodos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dados.map((item, index) => (
            <div key={index} className="space-y-3 p-4 rounded-lg bg-slate-100">
              <h4 className="font-semibold text-slate-700">{item.periodo}</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Entradas:</span>
                  <span className="text-sm font-medium text-blue-700">
                    R$ {item.entradas.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Saídas:</span>
                  <span className="text-sm font-medium text-red-700">
                    R$ {item.saidas.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Saldo:</span>
                  <span className="font-bold text-slate-700">
                    R$ {item.saldo.toLocaleString("pt-BR")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
