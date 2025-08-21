import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import type {
  FormaPagamento,
  FormasPagamentoResponse,
} from "../../../@types/types.api";
import { fetchFormasPagamento } from "../../../services/api";

interface FormaPagamentoComCor extends FormaPagamento {
  color: string;
}

export function DistribuicaoVendasChart() {
  const [distribuicaoVendas, setDistribuicaoVendas] = useState<
    FormaPagamentoComCor[]
  >([]);

  const cores = ["#A5D8FF", "#B9FBC0", "#FFE3B3", "#FFD6E0", "#E0C3FF"];

  useEffect(() => {
    const loadDistribuicao = async () => {
      try {
        const data: FormasPagamentoResponse = await fetchFormasPagamento();
        const formasComCores = data.formas.map((f, i) => ({
          ...f,
          color: cores[i % cores.length],
        }));
        setDistribuicaoVendas(formasComCores);
      } catch (err) {
        console.error("Erro ao carregar formas de pagamento:", err);
      }
    };
    loadDistribuicao();
  }, []);

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
        <div className="flex justify-center gap-4 mt-4 flex-wrap">
          {distribuicaoVendas.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-500">
                {item.forma_pagamento}: {item.total}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
