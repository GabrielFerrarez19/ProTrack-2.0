import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { formatarFormaPagamento } from "../../../utils/functions";
import { GetPaymentMethodsStats } from "../../../services/paymentMethods";

interface PaymentMethodStatsWithColor {
  payment_method: string;
  percentage_method: number;
  color: string;
}

export function DistribuicaoVendasChart() {
  const [distribuicaoVendas, setDistribuicaoVendas] = useState<
    PaymentMethodStatsWithColor[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        setError(null);

        const stats = await GetPaymentMethodsStats();

        if (!stats || stats.length === 0) {
          setDistribuicaoVendas([]);
          return;
        }

        const cores = ["#3b82f6", "#22c55e", "#eab308", "#f97316", "#ef4444"];

        const dadosComCor: PaymentMethodStatsWithColor[] = stats.map(
          (item, index) => ({
            payment_method: item.payment_method,
            percentage_method: item.percentage_method,
            color: cores[index % cores.length],
          })
        );

        setDistribuicaoVendas(dadosComCor);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar as estatísticas de pagamento.");
        setDistribuicaoVendas([]);
      } finally {
        setLoading(false);
      }
    }

    void carregarDados();
  }, []);

  if (loading) {
    return (
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Formas de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center">Carregando formas de pagamento...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Formas de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 text-center text-sm">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (distribuicaoVendas.length === 0) {
    return (
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Formas de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center">
            Nenhuma forma de pagamento disponível
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Formas de Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={distribuicaoVendas}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="percentage_method"
            >
              {distribuicaoVendas.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `${Number(value).toFixed(1)}%`}
              labelFormatter={(label) =>
                formatarFormaPagamento(String(label))
              }
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Legenda personalizada */}
        <div className="flex justify-center gap-4 mt-4 flex-wrap">
          {distribuicaoVendas.map((item) => (
            <div key={item.payment_method} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">
                {formatarFormaPagamento(item.payment_method)}:{" "}
                <strong>{item.percentage_method.toFixed(1)}%</strong>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
