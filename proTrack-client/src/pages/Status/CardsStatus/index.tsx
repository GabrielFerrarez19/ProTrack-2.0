import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "../../../components/ui/card";
import type { Status } from "@/@types/types.components";
import { TrendingUp, Users, Package } from "lucide-react";

interface CardsStatusProps {
  dados: Status;
  loading?: boolean;
  error?: string | null;
}

export function CardsStatus({ dados }: CardsStatusProps) {
  const totalEstoque = dados?.estoque ?? 0;
  const porcentagemEstoque = dados?.percentageEstoque ?? 0;

  const totalClientes = dados?.clientes ?? 0;
  const porcentagemClientes = dados?.percentageClientes ?? 0;

  const totalVendas = dados?.vendas ?? 0;
  const porcentagemVendas = dados?.percentageVendas ?? 0;

  const statsData = [
    {
      title: "Vendas",
      value: totalVendas,
      subtitle: "Este mês",
      change: porcentagemVendas,
      icon: TrendingUp,
      gradient:
        "bg-gradient-to-br from-[#628DFD]/25 via-[#6F31FF]/15 to-transparent",
    },
    {
      title: "Clientes",
      value: totalClientes,
      subtitle: "Ativos",
      change: porcentagemClientes,
      icon: Users,
      gradient:
        "bg-gradient-to-br from-[#628DFD]/20 via-[#6F31FF]/10 to-transparent",
    },
    {
      title: "Estoque",
      value: totalEstoque,
      subtitle: "Produtos",
      change: porcentagemEstoque,
      icon: Package,
      gradient:
        "bg-gradient-to-br from-[#628DFD]/25 via-[#6F31FF]/15 to-transparent",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statsData.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Card
            key={stat.title}
            className="relative overflow-hidden border-0 shadow-elegant hover:shadow-soft transition-all duration-300 hover:scale-105"
          >
            <div className={`absolute inset-0 ${stat.gradient}`} />
            <CardContent className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#628DFD]/15 border border-[#628DFD]/30">
                    <IconComponent className="w-5 h-5 text-[#628DFD]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      {stat.subtitle}
                    </p>
                  </div>
                </div>
                <Badge className="text-xs font-semibold bg-[#628DFD]/20 text-foreground border border-[#628DFD]/30">
                  {stat.change}%
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
                <div className="h-2 bg-[#628DFD]/15 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#628DFD] to-[#6F31FF] rounded-full w-3/4 transition-all duration-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
