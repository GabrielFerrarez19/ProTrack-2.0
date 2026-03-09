import { Card, CardContent } from "../../../components/ui/card";
import { DollarSign, CreditCard, TrendingUp } from "lucide-react";
import type { DashboardDados } from "../../../@types/types.api";

interface SaldoCardsProps {
  dados: DashboardDados;
}

export function SaldoCards({ dados }: SaldoCardsProps) {
  const saldoAtual = {
    caixa: 15400.5,
    banco: 45200.3,
    aReceber: dados.aReceber ?? 0,
  };

  const saldoTotal =
    Number(saldoAtual.caixa) +
    Number(saldoAtual.banco) +
    Number(saldoAtual.aReceber);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-blue-100 text-blue-800">
        <CardContent className="p-6 flex justify-between items-center">
          <div>
            <p className="text-sm opacity-90">Saldo Total</p>
            <h3 className="text-2xl font-bold">
              R${" "}
              {saldoTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <DollarSign className="h-8 w-8 opacity-80" />
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm">
        <CardContent className="p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Caixa</p>
            <h3 className="text-xl font-bold text-gray-800">
              R${" "}
              {saldoAtual.caixa.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </h3>
          </div>
          <CreditCard className="h-6 w-6 text-gray-300" />
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm">
        <CardContent className="p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Bancos</p>
            <h3 className="text-xl font-bold text-gray-800">
              R${" "}
              {saldoAtual.banco.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </h3>
          </div>
          <CreditCard className="h-6 w-6 text-gray-300" />
        </CardContent>
      </Card>

      <Card className="bg-green-100 text-green-700">
        <CardContent className="p-6 flex justify-between items-center">
          <div>
            <p className="text-sm opacity-90">A Receber</p>
            <h3 className="text-2xl font-bold">
              R${" "}
              {(dados.aReceber ?? 0).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </h3>
          </div>
          <TrendingUp className="h-8 w-8 opacity-80" />
        </CardContent>
      </Card>
    </div>
  );
}
