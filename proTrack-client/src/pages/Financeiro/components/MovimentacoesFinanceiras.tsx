import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Search,
  Filter,
  Download,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  DollarSign,
  CreditCard,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface Movimentacao {
  id: string;
  data: string;
  tipo: "entrada" | "saida";
  categoria: "venda" | "compra" | "pagamento" | "recebimento" | "transferencia";
  descricao: string;
  valor: number;
  conta: string;
  referencia?: string;
  status: "confirmado" | "pendente" | "cancelado";
}

const MovimentacoesFinanceiras = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [categoriaFilter, setCategoriaFilter] = useState("todas");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [contaFilter, setContaFilter] = useState("todas");

  const movimentacoes: Movimentacao[] = [
    {
      id: "1",
      data: "2024-12-10T10:30:00",
      tipo: "entrada",
      categoria: "venda",
      descricao: "Venda #001 - João Silva",
      valor: 2500.5,
      conta: "Caixa",
      referencia: "VD001",
      status: "confirmado",
    },
    {
      id: "2",
      data: "2024-12-10T14:20:00",
      tipo: "saida",
      categoria: "compra",
      descricao: "Compra de estoque - Fornecedor ABC",
      valor: 3500.0,
      conta: "Banco Itaú",
      referencia: "CP001",
      status: "confirmado",
    },
    {
      id: "3",
      data: "2024-12-11T09:00:00",
      tipo: "entrada",
      categoria: "recebimento",
      descricao: "Recebimento - Maria Santos",
      valor: 1800.0,
      conta: "Banco Bradesco",
      referencia: "RC001",
      status: "confirmado",
    },
    {
      id: "4",
      data: "2024-12-11T16:45:00",
      tipo: "saida",
      categoria: "pagamento",
      descricao: "Pagamento de fornecedor",
      valor: 2800.75,
      conta: "Banco Itaú",
      referencia: "PG001",
      status: "confirmado",
    },
    {
      id: "5",
      data: "2024-12-12T11:30:00",
      tipo: "entrada",
      categoria: "venda",
      descricao: "Venda #002 - Pedro Costa",
      valor: 950.0,
      conta: "Caixa",
      referencia: "VD002",
      status: "pendente",
    },
    {
      id: "6",
      data: "2024-12-12T13:15:00",
      tipo: "saida",
      categoria: "transferencia",
      descricao: "Transferência Caixa → Banco",
      valor: 5000.0,
      conta: "Banco Itaú",
      referencia: "TR001",
      status: "confirmado",
    },
  ];

  const contas = ["Caixa", "Banco Itaú", "Banco Bradesco", "Conta Corrente"];
  const categorias = [
    "venda",
    "compra",
    "pagamento",
    "recebimento",
    "transferencia",
  ];

  const filteredMovimentacoes = movimentacoes.filter((mov) => {
    const matchesSearch =
      mov.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.referencia?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = tipoFilter === "todos" || mov.tipo === tipoFilter;
    const matchesCategoria =
      categoriaFilter === "todas" || mov.categoria === categoriaFilter;
    const matchesStatus =
      statusFilter === "todos" || mov.status === statusFilter;
    const matchesConta = contaFilter === "todas" || mov.conta === contaFilter;

    return (
      matchesSearch &&
      matchesTipo &&
      matchesCategoria &&
      matchesStatus &&
      matchesConta
    );
  });

  const getTipoIcon = (tipo: string) => {
    return tipo === "entrada" ? (
      <ArrowUpRight className="h-4 w-4 text-secondary" />
    ) : (
      <ArrowDownLeft className="h-4 w-4 text-destructive" />
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmado":
        return <Badge variant="secondary">Confirmado</Badge>;
      case "pendente":
        return <Badge variant="outline">Pendente</Badge>;
      case "cancelado":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getCategoriaColor = (categoria: string) => {
    const colors = {
      venda: "bg-secondary/10 text-secondary",
      compra: "bg-primary/10 text-primary",
      pagamento: "bg-destructive/10 text-destructive",
      recebimento: "bg-secondary/10 text-secondary",
      transferencia: "bg-muted text-muted-foreground",
    };
    return (
      colors[categoria as keyof typeof colors] ||
      "bg-muted text-muted-foreground"
    );
  };

  // Cálculos de totais
  const totalEntradas = filteredMovimentacoes
    .filter((m) => m.tipo === "entrada" && m.status === "confirmado")
    .reduce((sum, m) => sum + m.valor, 0);

  const totalSaidas = filteredMovimentacoes
    .filter((m) => m.tipo === "saida" && m.status === "confirmado")
    .reduce((sum, m) => sum + m.valor, 0);

  const saldoLiquido = totalEntradas - totalSaidas;

  const movimentacoesPendentes = filteredMovimentacoes.filter(
    (m) => m.status === "pendente"
  ).length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Movimentações Financeiras
        </h1>
        <p className="text-muted-foreground">
          Histórico completo de todas as transações financeiras
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <p className="text-sm text-muted-foreground">Saldo Líquido</p>
                <h3
                  className={`text-2xl font-bold ${
                    saldoLiquido >= 0 ? "text-secondary" : "text-destructive"
                  }`}
                >
                  R${" "}
                  {saldoLiquido.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </h3>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <h3 className="text-2xl font-bold text-foreground">
                  {movimentacoesPendentes}
                </h3>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros e Pesquisa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por descrição ou referência..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="entrada">Entrada</SelectItem>
                <SelectItem value="saida">Saída</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                {categorias.map((categoria) => (
                  <SelectItem key={categoria} value={categoria}>
                    {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={contaFilter} onValueChange={setContaFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Conta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                {contas.map((conta) => (
                  <SelectItem key={conta} value={conta}>
                    {conta}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 mt-4">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros Avançados
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Excel
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Movimentações */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Movimentações</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Conta</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Referência</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovimentacoes.map((mov) => (
                <TableRow key={mov.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">
                        {new Date(mov.data).toLocaleDateString("pt-BR")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(mov.data).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTipoIcon(mov.tipo)}
                      <span className="capitalize">{mov.tipo}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getCategoriaColor(mov.categoria)}
                    >
                      {mov.categoria.charAt(0).toUpperCase() +
                        mov.categoria.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={mov.descricao}>
                      {mov.descricao}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      {mov.conta}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${
                        mov.tipo === "entrada"
                          ? "text-secondary"
                          : "text-destructive"
                      }`}
                    >
                      {mov.tipo === "entrada" ? "+" : "-"}R${" "}
                      {mov.valor.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(mov.status)}</TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground font-mono">
                      {mov.referencia || "-"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredMovimentacoes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma movimentação encontrada com os filtros selecionados.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MovimentacoesFinanceiras;
