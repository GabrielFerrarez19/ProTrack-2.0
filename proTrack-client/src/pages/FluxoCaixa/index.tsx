import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  ComposedChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from "lucide-react";

export function FluxoCaixa() {
  const [periodo, setPeriodo] = useState("30dias");
  const [tipoVisualizacao, setTipoVisualizacao] = useState("diario");

  // Dados mockados
  const fluxoCaixaHistorico = [
    { data: "01/12", entradas: 4500, saidas: 2300, saldo: 2200 },
    { data: "02/12", entradas: 3200, saidas: 1800, saldo: 3600 },
    { data: "03/12", entradas: 5400, saidas: 3100, saldo: 5900 },
    { data: "04/12", entradas: 6200, saidas: 2900, saldo: 9200 },
    { data: "05/12", entradas: 4800, saidas: 3500, saldo: 10500 },
    { data: "06/12", entradas: 7100, saidas: 4200, saldo: 13400 },
    { data: "07/12", entradas: 5900, saidas: 3800, saldo: 15500 },
    { data: "08/12", entradas: 4300, saidas: 2900, saldo: 16900 },
    { data: "09/12", entradas: 6800, saidas: 4100, saldo: 19600 },
    { data: "10/12", entradas: 5200, saidas: 3600, saldo: 21200 },
  ];

  const projecaoFutura = [
    {
      data: "11/12",
      entradas: 5500,
      saidas: 3200,
      saldo: 23500,
      tipo: "projecao",
    },
    {
      data: "12/12",
      entradas: 4800,
      saidas: 2800,
      saldo: 25500,
      tipo: "projecao",
    },
    {
      data: "13/12",
      entradas: 6200,
      saidas: 3900,
      saldo: 27800,
      tipo: "projecao",
    },
    {
      data: "14/12",
      entradas: 5900,
      saidas: 3400,
      saldo: 30300,
      tipo: "projecao",
    },
    {
      data: "15/12",
      entradas: 7100,
      saidas: 4500,
      saldo: 32900,
      tipo: "projecao",
    },
  ];

  const dadosCompletos = [...fluxoCaixaHistorico, ...projecaoFutura];

  const categoriasEntrada = [
    { categoria: "Vendas à Vista", valor: 45200, percentual: 65 },
    { categoria: "Recebimentos", valor: 18400, percentual: 26.5 },
    { categoria: "Outros", valor: 5900, percentual: 8.5 },
  ];

  const categoriasSaida = [
    { categoria: "Fornecedores", valor: 28500, percentual: 55 },
    { categoria: "Salários", valor: 12800, percentual: 25 },
    { categoria: "Despesas Operacionais", valor: 8200, percentual: 16 },
    { categoria: "Impostos", valor: 2100, percentual: 4 },
  ];

  const comparativoPeriodos = [
    { periodo: "Este Mês", entradas: 69500, saidas: 51600, saldo: 17900 },
    { periodo: "Mês Anterior", entradas: 58200, saidas: 45800, saldo: 12400 },
    {
      periodo: "Mesmo Mês Ano Anterior",
      entradas: 52100,
      saidas: 41200,
      saldo: 10900,
    },
  ];

  const totalEntradas = fluxoCaixaHistorico.reduce(
    (sum, item) => sum + item.entradas,
    0
  );
  const totalSaidas = fluxoCaixaHistorico.reduce(
    (sum, item) => sum + item.saidas,
    0
  );
  const saldoAtual = totalEntradas - totalSaidas;
  const crescimento = ((saldoAtual - 12400) / 12400) * 100; // Comparado ao mês anterior

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Fluxo de Caixa
          </h1>
          <p className="text-muted-foreground">
            Visualize entradas, saídas e projeções financeiras
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7dias">7 dias</SelectItem>
              <SelectItem value="30dias">30 dias</SelectItem>
              <SelectItem value="90dias">90 dias</SelectItem>
              <SelectItem value="1ano">1 ano</SelectItem>
            </SelectContent>
          </Select>
          <Select value={tipoVisualizacao} onValueChange={setTipoVisualizacao}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diario">Diário</SelectItem>
              <SelectItem value="semanal">Semanal</SelectItem>
              <SelectItem value="mensal">Mensal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Saldo Atual</p>
                <h3 className="text-2xl font-bold">
                  R${" "}
                  {saldoAtual.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </h3>
                <div className="flex items-center gap-1 mt-2">
                  {crescimento >= 0 ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  <span className="text-sm opacity-90">
                    {Math.abs(crescimento).toFixed(1)}% vs mês anterior
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Entradas</p>
                <h3 className="text-2xl font-bold text-secondary">
                  R${" "}
                  {totalEntradas.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </h3>
              </div>
              <TrendingUp className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Saídas</p>
                <h3 className="text-2xl font-bold text-destructive">
                  R${" "}
                  {totalSaidas.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </h3>
              </div>
              <TrendingDown className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Previsão 5 dias</p>
                <h3 className="text-2xl font-bold text-foreground">
                  R${" "}
                  {projecaoFutura
                    .reduce(
                      (sum, item) => sum + (item.entradas - item.saidas),
                      0
                    )
                    .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </h3>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico principal */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Fluxo de Caixa Histórico e Projeções</CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary">Histórico</Badge>
              <Badge variant="outline">Projeção</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={dadosCompletos}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="saldo"
                fill="hsl(var(--primary) / 0.1)"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Saldo Acumulado"
              />
              <Bar
                dataKey="entradas"
                fill="hsl(var(--secondary))"
                name="Entradas"
              />
              <Bar
                dataKey="saidas"
                fill="hsl(var(--destructive))"
                name="Saídas"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Análise detalhada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Entradas por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoriasEntrada.map((categoria, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {categoria.categoria}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    R${" "}
                    {categoria.valor.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-secondary h-2 rounded-full transition-all"
                    style={{ width: `${categoria.percentual}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {categoria.percentual}%
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saídas por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoriasSaida.map((categoria, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {categoria.categoria}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    R${" "}
                    {categoria.valor.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-destructive h-2 rounded-full transition-all"
                    style={{ width: `${categoria.percentual}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {categoria.percentual}%
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Comparativo de períodos */}
      <Card>
        <CardHeader>
          <CardTitle>Comparativo entre Períodos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {comparativoPeriodos.map((item, index) => (
              <div key={index} className="space-y-3 p-4 rounded-lg bg-muted/30">
                <h4 className="font-semibold text-foreground">
                  {item.periodo}
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Entradas:
                    </span>
                    <span className="text-sm font-medium text-secondary">
                      R$ {item.entradas.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Saídas:
                    </span>
                    <span className="text-sm font-medium text-destructive">
                      R$ {item.saidas.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Saldo:</span>
                    <span className="font-bold text-foreground">
                      R$ {item.saldo.toLocaleString("pt-BR")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
