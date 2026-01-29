import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import type { FormaPagamento } from "../../../@types/types.api";
import { formatarFormaPagamento } from "../../../utils/functions";

interface FormaPagamentoComCor extends FormaPagamento {
  color: string;
}

export function DistribuicaoVendasChart() {
  const [distribuicaoVendas] = useState<FormaPagamentoComCor[]>([]);

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
              dataKey="total"
            >
              {distribuicaoVendas.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value} vendas`} />
          </PieChart>
        </ResponsiveContainer>

        {/* Legenda personalizada */}
        <div className="flex justify-center gap-4 mt-4 flex-wrap">
          {distribuicaoVendas.map((item) => (
            <div key={item.forma_pagamento} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">
                {formatarFormaPagamento(item.forma_pagamento)}:{" "}
                <strong>{item.total}</strong>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
