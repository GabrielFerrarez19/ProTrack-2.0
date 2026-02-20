import { Card, CardContent } from "../../../components/ui/card";
import type { Status } from "@/@types/types.components";

interface CardsStatusProps {
  dados: Status;
  loading?: boolean;
  error?: string | null;
}

export function CardsStatus({
  dados,
  loading: loadingVendas,
  error: erroVendas,
}: CardsStatusProps) {
  const totalEstoque = dados?.estoque ?? 0;
  const porcentagemEstoque = dados?.percentageEstoque ?? 0;
  const loadingEstoque = false;
  const erroEstoque: string | null = null;

  const totalClientes = dados?.clientes ?? 0;
  const porcentagemClientes = dados?.percentageClientes ?? 0;
  const loadingClientes = false;
  const erroClientes: string | null = null;

  const totalVendas = dados?.vendas ?? 0;
  const porcentagemVendas = dados?.percentageVendas ?? 0;

  const statsData = [
    {
      title: "Vendas",
      value: loadingVendas
        ? "..."
        : erroVendas
          ? "Erro"
          : totalVendas.toString(),
      percentage: porcentagemVendas,
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      title: "Clientes",
      value: loadingClientes
        ? "..."
        : erroClientes
          ? "Erro"
          : totalClientes.toString(),
      percentage: porcentagemClientes,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Estoque",
      value: loadingEstoque
        ? "..."
        : erroEstoque
          ? "Erro"
          : totalEstoque.toString(),
      percentage: porcentagemEstoque,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statsData.map((stat, index) => (
        <Card key={stat.title} className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  {stat.title}
                </h3>
                <p className={`text-4xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-16 h-16 rounded-full ${stat.bgColor} flex items-center justify-center`}
              >
                <div
                  className={`w-12 h-12 rounded-full border-4 ${
                    index === 0
                      ? "border-red-500"
                      : index === 1
                        ? "border-blue-500"
                        : "border-green-500"
                  } border-t-transparent`}
                >
                  <div className="text-xs text-center mt-3 text-muted-foreground">
                    {stat.percentage}%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
