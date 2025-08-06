import { useState, useEffect } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { fetchTotalClientes, fetchTotalEstoque } from "../../../services/api";

export function CardsStatus() {
  const [totalEstoque, setTotalEstoque] = useState<number>(0);
  const [loadingEstoque, setLoadingEstoque] = useState(true);
  const [erroEstoque, setErroEstoque] = useState<string | null>(null);

  const [totalClientes, setTotalClientes] = useState<number>(0);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [erroClientes, setErroClientes] = useState<string | null>(null);

  // useEffect para buscar total de estoque
  useEffect(() => {
    const fetchEstoque = async () => {
      try {
        const data = await fetchTotalEstoque();
        setTotalEstoque(data.totalEstoque);
        setErroEstoque(null);
      } catch (err) {
        console.error("Erro ao buscar estoque:", err);
        setErroEstoque("Erro ao buscar estoque");
      } finally {
        setLoadingEstoque(false);
      }
    };

    fetchEstoque();
  }, []);

  // useEffect para buscar total de clientes
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await fetchTotalClientes();
        setTotalClientes(data.totalClientes);
        setErroClientes(null);
      } catch (err) {
        console.error("Erro ao buscar clientes:", err);
        setErroClientes("Erro ao buscar clientes");
      } finally {
        setLoadingClientes(false);
      }
    };

    fetchClientes();
  }, []);

  const statsData = [
    {
      title: "Vendas",
      value: "0",
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
