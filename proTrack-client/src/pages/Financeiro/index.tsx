import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Package,
  Calendar,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { fetchTotalAPagar } from "../../services/api";
import type { TotalAPagarResponse } from "../../@types/types.api";

export function DashboardFinanceiro() {
  const [dados, setDados] = useState<TotalAPagarResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTotalAPagar()
      .then((res) => setDados(res))
      .catch((err) => console.error("Erro ao buscar dados financeiros:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Carregando dados financeiros...</p>;
  if (!dados)
    return <p className="p-6 text-red-600">Erro ao carregar informações</p>;

  const saldoAtual = {
    caixa: 15400.5,
    banco: 45200.3,
    contasReceber: 0,
    contasPagar: dados.total_geral,
  };

  const saldoTotal =
    saldoAtual.caixa +
    saldoAtual.banco +
    saldoAtual.contasReceber -
    saldoAtual.contasPagar;

  const vendas = {
    mesAtual: 125400.5,
    mesAnterior: 98200.3,
    crescimento: 27.7,
  };

  const fluxoCaixaDados = [
    { data: "01/12", entrada: 4500, saida: 2300 },
    { data: "02/12", entrada: 3200, saida: 1800 },
    { data: "03/12", entrada: 5400, saida: 3100 },
    { data: "04/12", entrada: 6200, saida: 2900 },
    { data: "05/12", entrada: 4800, saida: 3500 },
    { data: "06/12", entrada: 7100, saida: 4200 },
    { data: "07/12", entrada: 5900, saida: 3800 },
  ];

  const topProdutos = [
    { nome: "Produto A", vendas: 4500, lucro: 1350 },
    { nome: "Produto B", vendas: 3200, lucro: 960 },
    { nome: "Produto C", vendas: 2800, lucro: 840 },
    { nome: "Produto D", vendas: 2100, lucro: 630 },
  ];

  const distribuicaoVendas = [
    { name: "À Vista", value: 45, color: "#A5D8FF" }, // azul pastel
    { name: "Cartão", value: 35, color: "#B9FBC0" }, // verde pastel
    { name: "Parcelado", value: 20, color: "#FFE3B3" }, // laranja pastel
  ];

  const alertas = [
    { tipo: "vencimento", mensagem: "5 contas vencem hoje", urgencia: "alta" },
    {
      tipo: "estoque",
      mensagem: "3 produtos com estoque crítico",
      urgencia: "media",
    },
    { tipo: "receber", mensagem: "R$ 8.500 em atraso", urgencia: "alta" },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Dashboard Financeiro
        </h1>
        <p className="text-gray-500">
          Visão geral da situação financeira da empresa
        </p>
      </div>

      {/* Cards de Saldo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-blue-100 text-blue-800">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">Saldo Total</p>
              <h3 className="text-2xl font-bold">
                R${" "}
                {saldoTotal.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
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

        {/* Contas a Receber */}
        <Card className="bg-green-100 text-green-700">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">A Receber</p>
              <h3 className="text-2xl font-bold">
                R${" "}
                {saldoAtual.contasPagar.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </div>
            <TrendingUp className="h-8 w-8 opacity-80" />
          </CardContent>
        </Card>
      </div>

      {/* Resumo de Vendas e Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <TrendingUp className="h-5 w-5 text-blue-300" />
              Resumo de Vendas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Vendas do Mês</p>
                <p className="text-2xl font-bold text-gray-800">
                  R${" "}
                  {vendas.mesAtual.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700"
                  >
                    +{vendas.crescimento}%
                  </Badge>
                  <span className="text-sm text-gray-400">vs mês anterior</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400">Mês Anterior</p>
                <p className="text-xl font-semibold text-gray-500">
                  R${" "}
                  {vendas.mesAnterior.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-5 w-5 text-red-300" />
              Alertas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alertas.map((alerta, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-2 rounded-lg ${
                  alerta.urgencia === "alta" ? "bg-red-50" : "bg-yellow-50"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    alerta.urgencia === "alta" ? "bg-red-300" : "bg-yellow-300"
                  }`}
                />
                <span className="text-sm text-gray-700">{alerta.mensagem}</span>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full mt-4">
              Ver Todos os Alertas
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Fluxo de Caixa (7 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={fluxoCaixaDados}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="data" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="entrada"
                  stroke="#A5D8FF"
                  strokeWidth={2}
                  name="Entradas"
                />
                <Line
                  type="monotone"
                  dataKey="saida"
                  stroke="#FFB3B3"
                  strokeWidth={2}
                  name="Saídas"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Top Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProdutos}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="nome" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Bar dataKey="vendas" fill="#A5D8FF" name="Vendas" />
                <Bar dataKey="lucro" fill="#B9FBC0" name="Lucro" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição de Vendas e KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  dataKey="value"
                >
                  {distribuicaoVendas.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {distribuicaoVendas.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-500">
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-gray-400" />
              Valor em Estoque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-2xl font-bold text-gray-800">R$ 85.400</p>
                <p className="text-sm text-gray-400">Total investido</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Giro de estoque</span>
                  <span className="font-medium text-gray-800">68%</span>
                </div>
                <Progress value={68} className="h-2 bg-blue-100" />
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Ver Detalhes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              Contas a Pagar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-2xl font-bold text-red-400">
                  R${" "}
                  {saldoAtual.contasPagar.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm text-gray-400">Total pendente</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Vencidas</span>
                  <span className="font-medium text-red-300">R$ 2.400</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Vencem hoje</span>
                  <span className="font-medium text-yellow-300">R$ 1.800</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Próximos 7 dias</span>
                  <span className="font-medium text-gray-800">R$ 4.200</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Gerenciar Contas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
