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
  CreditCard,
  Check,
  Calendar,
  DollarSign,
  AlertTriangle,
  Clock,
} from "lucide-react";

interface ContaPagar {
  id: string;
  fornecedor: string;
  valor: number;
  dataVencimento: string;
  diasAtraso: number;
  status: "pendente" | "pago" | "vencido" | "agendado";
  categoria: string;
  descricao: string;
  dataAgendamento?: string;
}

const ContasPagar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [categoriaFilter, setCategoriaFilter] = useState("todas");

  const contas: ContaPagar[] = [
    {
      id: "1",
      fornecedor: "Fornecedor ABC Ltda",
      valor: 3500.0,
      dataVencimento: "2024-12-15",
      diasAtraso: 5,
      status: "vencido",
      categoria: "Mercadoria",
      descricao: "Compra de estoque",
    },
    {
      id: "2",
      fornecedor: "Energia Elétrica SA",
      valor: 850.75,
      dataVencimento: "2024-12-20",
      diasAtraso: 0,
      status: "pendente",
      categoria: "Utilidades",
      descricao: "Conta de luz",
    },
    {
      id: "3",
      fornecedor: "Internet Provider",
      valor: 199.9,
      dataVencimento: "2024-12-25",
      diasAtraso: 0,
      status: "agendado",
      categoria: "Tecnologia",
      descricao: "Internet empresarial",
      dataAgendamento: "2024-12-24",
    },
    {
      id: "4",
      fornecedor: "Distribuidora XYZ",
      valor: 2800.5,
      dataVencimento: "2024-12-10",
      diasAtraso: 0,
      status: "pago",
      categoria: "Mercadoria",
      descricao: "Produtos para revenda",
    },
    {
      id: "5",
      fornecedor: "Banco Central",
      valor: 1250.0,
      dataVencimento: "2024-12-30",
      diasAtraso: 0,
      status: "pendente",
      categoria: "Financeiro",
      descricao: "Financiamento",
    },
  ];

  const categorias = [
    "Mercadoria",
    "Utilidades",
    "Tecnologia",
    "Financeiro",
    "Outros",
  ];

  const filteredContas = contas.filter((conta) => {
    const matchesSearch =
      conta.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conta.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "todos" || conta.status === statusFilter;
    const matchesCategoria =
      categoriaFilter === "todas" || conta.categoria === categoriaFilter;
    return matchesSearch && matchesStatus && matchesCategoria;
  });

  const getStatusBadge = (status: ContaPagar["status"]) => {
    switch (status) {
      case "pago":
        return <Badge variant="secondary">Pago</Badge>;
      case "agendado":
        return <Badge variant="outline">Agendado</Badge>;
      case "vencido":
        return <Badge variant="destructive">Vencido</Badge>;
      default:
        return <Badge variant="outline">Pendente</Badge>;
    }
  };

  const totalPendente = filteredContas
    .filter((c) => c.status !== "pago")
    .reduce((total, c) => total + c.valor, 0);
  const totalVencido = filteredContas
    .filter((c) => c.status === "vencido")
    .reduce((total, c) => total + c.valor, 0);
  const totalAgendado = filteredContas
    .filter((c) => c.status === "agendado")
    .reduce((total, c) => total + c.valor, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Contas a Pagar
        </h1>
        <p className="text-muted-foreground">
          Gerencie as contas e pagamentos a fornecedores
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total a Pagar</p>
              <h3 className="text-2xl font-bold text-foreground">
                R${" "}
                {totalPendente.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </div>
            <DollarSign className="h-8 w-8 text-destructive" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Contas Vencidas</p>
              <h3 className="text-2xl font-bold text-destructive">
                R${" "}
                {totalVencido.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </div>
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Pagamentos Agendados
              </p>
              <h3 className="text-2xl font-bold text-primary">
                R${" "}
                {totalAgendado.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </div>
            <Clock className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total de Contas</p>
              <h3 className="text-2xl font-bold text-foreground">
                {filteredContas.length}
              </h3>
            </div>
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros e Pesquisa</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por fornecedor ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="agendado">Agendado</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
              <SelectItem value="vencido">Vencido</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              {categorias.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros Avançados
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </CardContent>
      </Card>

      {/* Tabela de Contas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Contas a Pagar</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dias em Atraso</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContas.map((conta) => (
                <TableRow key={conta.id}>
                  <TableCell className="font-medium">
                    {conta.fornecedor}
                  </TableCell>
                  <TableCell>{conta.descricao}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{conta.categoria}</Badge>
                  </TableCell>
                  <TableCell>
                    R${" "}
                    {conta.valor.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>
                    {new Date(conta.dataVencimento).toLocaleDateString("pt-BR")}
                    {conta.dataAgendamento && (
                      <div className="text-xs text-muted-foreground">
                        Agendado:{" "}
                        {new Date(conta.dataAgendamento).toLocaleDateString(
                          "pt-BR"
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(conta.status)}</TableCell>
                  <TableCell>
                    {conta.diasAtraso > 0 ? (
                      <span className="text-destructive font-medium">
                        {conta.diasAtraso} dias
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 flex-wrap">
                      {conta.status !== "pago" && (
                        <>
                          <Button size="sm" variant="outline">
                            <Check className="h-4 w-4 mr-1" /> Pagar
                          </Button>
                          {conta.status !== "agendado" && (
                            <Button size="sm" variant="outline">
                              <Clock className="h-4 w-4 mr-1" /> Agendar
                            </Button>
                          )}
                        </>
                      )}
                      <Button size="sm" variant="outline">
                        <CreditCard className="h-4 w-4 mr-1" /> Comprovante
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContasPagar;
