import { useState, useEffect } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { fetchTotalEstoque } from "../../../services/api";

export function CardsStatus() {
  const [totalEstoque, setTotalEstoque] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const fetchEstoque = async () => {
      try {
        const data = await fetchTotalEstoque();
        setTotalEstoque(data.totalEstoque);
      } catch (err) {
        console.error("Erro ao buscar estoque:", err);
        setErro("Erro ao buscar estoque");
      } finally {
        setLoading(false);
      }
    };

    fetchEstoque();
  }, []);

  const statsData = [
    {
      title: "Vendas",
      value: "0", // valor fixo por enquanto
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      title: "Clientes",
      value: "0", // valor fixo por enquanto
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Estoque",
      value: loading ? "..." : erro ? "Erro" : totalEstoque.toString(),
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
                    0,00%
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
