import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { TrendingUp, Package, Filter, BarChart3 } from "lucide-react";

const RelatoriosFinanceiros = () => {
  const [periodoInicio, setPeriodoInicio] = useState("2024-12-01");
  const [periodoFim, setPeriodoFim] = useState("2024-12-31");
  const [tipoRelatorio, setTipoRelatorio] = useState("lucro-produto");

  const lucroPorProduto = [
    { produto: "Produto A", vendas: 15400, custo: 9240, lucro: 6160 },
    { produto: "Produto B", vendas: 12800, custo: 8960, lucro: 3840 },
    { produto: "Produto C", vendas: 9600, custo: 6720, lucro: 2880 },
    { produto: "Produto D", vendas: 7200, custo: 5400, lucro: 1800 },
    { produto: "Produto E", vendas: 5800, custo: 4640, lucro: 1160 },
  ];

  const estoqueInvestimento = [
    {
      produto: "Produto A",
      quantidade: 150,
      valorUnitario: 45.5,
      valorTotal: 6825,
    },
    {
      produto: "Produto B",
      quantidade: 89,
      valorUnitario: 78.9,
      valorTotal: 7022,
    },
    {
      produto: "Produto C",
      quantidade: 245,
      valorUnitario: 25.3,
      valorTotal: 6199,
    },
    {
      produto: "Produto D",
      quantidade: 67,
      valorUnitario: 125.0,
      valorTotal: 8375,
    },
    {
      produto: "Produto E",
      quantidade: 189,
      valorUnitario: 18.75,
      valorTotal: 3544,
    },
  ];

  const getTotalInvestimentoEstoque = () =>
    estoqueInvestimento.reduce((total, item) => total + item.valorTotal, 0);

  const getMargemLucroTotal = () => {
    const totalVendas = lucroPorProduto.reduce((sum, p) => sum + p.vendas, 0);
    const totalLucro = lucroPorProduto.reduce((sum, p) => sum + p.lucro, 0);
    return totalVendas > 0 ? (totalLucro / totalVendas) * 100 : 0;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Relatórios Financeiros
        </h1>
        <p className="text-muted-foreground">
          Análises detalhadas de performance financeira e lucratividade
        </p>
      </div>

      {/* Configurações do Relatório */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Configurações do Relatório
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Relatório</Label>
              <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lucro-produto">
                    Lucro por Produto
                  </SelectItem>
                  <SelectItem value="lucro-categoria">
                    Lucro por Categoria
                  </SelectItem>
                  <SelectItem value="lucro-periodo">
                    Lucro por Período
                  </SelectItem>
                  <SelectItem value="contas-detalhadas">
                    Contas Detalhadas
                  </SelectItem>
                  <SelectItem value="estoque-investimento">
                    Estoque x Investimento
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Data Início</Label>
              <Input
                type="date"
                value={periodoInicio}
                onChange={(e) => setPeriodoInicio(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Data Fim</Label>
              <Input
                type="date"
                value={periodoFim}
                onChange={(e) => setPeriodoFim(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                Gerar Relatório
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Margem de Lucro Total
                </p>
                <h3 className="text-2xl font-bold text-foreground">
                  {getMargemLucroTotal().toFixed(1)}%
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
                <p className="text-sm text-muted-foreground">
                  Valor em Estoque
                </p>
                <h3 className="text-2xl font-bold text-foreground">
                  R$ {getTotalInvestimentoEstoque().toLocaleString("pt-BR")}
                </h3>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RelatoriosFinanceiros;
