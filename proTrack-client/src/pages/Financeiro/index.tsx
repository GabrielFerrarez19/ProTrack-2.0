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

const DashboardFinanceiro = () => {
  const saldoAtual = {
    caixa: 15400.5,
    banco: 45200.3,
    contasReceber: 28500.0,
    contasPagar: 12800.75,
  };

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
    { name: "À Vista", value: 45, color: "#3B82F6" }, // azul
    { name: "Cartão", value: 35, color: "#10B981" }, // verde
    { name: "Parcelado", value: 20, color: "#F59E0B" }, // amarelo
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

  const saldoTotal =
    saldoAtual.caixa +
    saldoAtual.banco +
    saldoAtual.contasReceber -
    saldoAtual.contasPagar;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Financeiro
        </h1>
        <p className="text-gray-500">
          Visão geral da situação financeira da empresa
        </p>
      </div>

      {/* Cards de Saldo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Saldo Total */}
        <Card className="bg-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
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
            </div>
          </CardContent>
        </Card>

        {/* Caixa */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Caixa</p>
                <h3 className="text-xl font-bold text-gray-900">
                  R${" "}
                  {saldoAtual.caixa.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </h3>
              </div>
              <CreditCard className="h-6 w-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        {/* Bancos */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Bancos</p>
                <h3 className="text-xl font-bold text-gray-900">
                  R${" "}
                  {saldoAtual.banco.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </h3>
              </div>
              <CreditCard className="h-6 w-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        {/* A Receber */}
        <Card className="bg-green-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">A Receber</p>
                <h3 className="text-2xl font-bold">
                  R${" "}
                  {saldoAtual.contasReceber.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </h3>
              </div>
              <TrendingUp className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo de Vendas e Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Resumo de Vendas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Vendas do Mês</p>
                <p className="text-2xl font-bold text-gray-900">
                  R${" "}
                  {vendas.mesAtual.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    +{vendas.crescimento}%
                  </Badge>
                  <span className="text-sm text-gray-500">vs mês anterior</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mês Anterior</p>
                <p className="text-xl font-semibold text-gray-600">
                  R${" "}
                  {vendas.mesAnterior.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Alertas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alertas.map((alerta, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-2 rounded-lg ${
                  alerta.urgencia === "alta" ? "bg-red-100" : "bg-yellow-100"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    alerta.urgencia === "alta" ? "bg-red-600" : "bg-yellow-500"
                  }`}
                />
                <span className="text-sm text-gray-900">{alerta.mensagem}</span>
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
        <Card>
          <CardHeader>
            <CardTitle>Fluxo de Caixa (7 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={fluxoCaixaDados}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="data" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="entrada"
                  stroke="#3B82F6" // azul
                  strokeWidth={2}
                  name="Entradas"
                />
                <Line
                  type="monotone"
                  dataKey="saida"
                  stroke="#EF4444" // vermelho
                  strokeWidth={2}
                  name="Saídas"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProdutos}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="nome" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Bar dataKey="vendas" fill="#3B82F6" name="Vendas" />
                <Bar dataKey="lucro" fill="#10B981" name="Lucro" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição de Vendas e KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
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
                  <span className="text-sm text-gray-600">
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-gray-700" />
              Valor em Estoque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-2xl font-bold text-gray-900">R$ 85.400</p>
                <p className="text-sm text-gray-500">Total investido</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Giro de estoque</span>
                  <span className="font-medium text-gray-900">68%</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Ver Detalhes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-700" />
              Contas a Pagar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-2xl font-bold text-red-600">
                  R${" "}
                  {saldoAtual.contasPagar.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm text-gray-500">Total pendente</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Vencidas</span>
                  <span className="font-medium text-red-600">R$ 2.400</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Vencem hoje</span>
                  <span className="font-medium text-yellow-500">R$ 1.800</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Próximos 7 dias</span>
                  <span className="font-medium text-gray-900">R$ 4.200</span>
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
};

export default DashboardFinanceiro;
