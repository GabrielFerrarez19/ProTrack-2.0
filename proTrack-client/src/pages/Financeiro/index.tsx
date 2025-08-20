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
  // Dados mockados
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
    { name: "À Vista", value: 45, color: "hsl(var(--primary))" },
    { name: "Cartão", value: 35, color: "hsl(var(--secondary))" },
    { name: "Parcelado", value: 20, color: "hsl(var(--accent))" },
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
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Dashboard Financeiro
        </h1>
        <p className="text-muted-foreground">
          Visão geral da situação financeira da empresa
        </p>
      </div>

      {/* Cards de Saldo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-primary text-primary-foreground">
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

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Caixa</p>
                <h3 className="text-xl font-bold text-foreground">
                  R${" "}
                  {saldoAtual.caixa.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </h3>
              </div>
              <CreditCard className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bancos</p>
                <h3 className="text-xl font-bold text-foreground">
                  R${" "}
                  {saldoAtual.banco.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </h3>
              </div>
              <CreditCard className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">A Receber</p>
                <h3 className="text-xl font-bold text-secondary">
                  R${" "}
                  {saldoAtual.contasReceber.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </h3>
              </div>
              <TrendingUp className="h-6 w-6 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo de Vendas e Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Resumo de Vendas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Vendas do Mês</p>
                <p className="text-2xl font-bold text-foreground">
                  R${" "}
                  {vendas.mesAtual.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-secondary">
                    +{vendas.crescimento}%
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    vs mês anterior
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mês Anterior</p>
                <p className="text-xl font-semibold text-muted-foreground">
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
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Alertas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alertas.map((alerta, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    alerta.urgencia === "alta"
                      ? "bg-destructive"
                      : "bg-secondary"
                  }`}
                />
                <span className="text-sm text-foreground">
                  {alerta.mensagem}
                </span>
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
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="entrada"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  name="Entradas"
                />
                <Line
                  type="monotone"
                  dataKey="saida"
                  stroke="hsl(var(--destructive))"
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
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="vendas"
                  fill="hsl(var(--primary))"
                  name="Vendas"
                />
                <Bar
                  dataKey="lucro"
                  fill="hsl(var(--secondary))"
                  name="Lucro"
                />
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
                  <span className="text-sm text-muted-foreground">
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
              <Package className="h-5 w-5" />
              Valor em Estoque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-2xl font-bold text-foreground">R$ 85.400</p>
                <p className="text-sm text-muted-foreground">Total investido</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Giro de estoque</span>
                  <span className="font-medium">68%</span>
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
              <Calendar className="h-5 w-5" />
              Contas a Pagar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-2xl font-bold text-destructive">
                  R${" "}
                  {saldoAtual.contasPagar.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm text-muted-foreground">Total pendente</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Vencidas</span>
                  <span className="font-medium text-destructive">R$ 2.400</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Vencem hoje</span>
                  <span className="font-medium text-secondary">R$ 1.800</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Próximos 7 dias</span>
                  <span className="font-medium">R$ 4.200</span>
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
