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
  Mail,
  Check,
  Calendar,
  DollarSign,
  AlertCircle,
} from "lucide-react";

interface ContaReceber {
  id: string;
  cliente: string;
  valor: number;
  dataVencimento: string;
  diasAtraso: number;
  status: "pendente" | "parcial" | "pago" | "vencido";
  valorPago: number;
  descricao: string;
}

const ContasReceber = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const contas: ContaReceber[] = [
    {
      id: "1",
      cliente: "João Silva",
      valor: 2500.5,
      dataVencimento: "2024-12-15",
      diasAtraso: 5,
      status: "vencido",
      valorPago: 0,
      descricao: "Venda #001",
    },
    {
      id: "2",
      cliente: "Maria Santos",
      valor: 1800.0,
      dataVencimento: "2024-12-20",
      diasAtraso: 0,
      status: "pendente",
      valorPago: 0,
      descricao: "Venda #002",
    },
    {
      id: "3",
      cliente: "Pedro Costa",
      valor: 3200.75,
      dataVencimento: "2024-12-10",
      diasAtraso: 10,
      status: "parcial",
      valorPago: 1600.0,
      descricao: "Venda #003",
    },
    {
      id: "4",
      cliente: "Ana Oliveira",
      valor: 950.0,
      dataVencimento: "2024-12-18",
      diasAtraso: 0,
      status: "pago",
      valorPago: 950.0,
      descricao: "Venda #004",
    },
    {
      id: "5",
      cliente: "Carlos Ferreira",
      valor: 4500.25,
      dataVencimento: "2024-12-25",
      diasAtraso: 0,
      status: "pendente",
      valorPago: 0,
      descricao: "Venda #005",
    },
  ];

  const filteredContas = contas.filter((conta) => {
    const matchesSearch =
      conta.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conta.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "todos" || conta.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pago":
        return (
          <Badge
            variant="secondary"
            className="bg-secondary text-secondary-foreground"
          >
            Pago
          </Badge>
        );
      case "parcial":
        return (
          <Badge variant="outline" className="border-secondary text-secondary">
            Parcial
          </Badge>
        );
      case "vencido":
        return <Badge variant="destructive">Vencido</Badge>;
      default:
        return <Badge variant="outline">Pendente</Badge>;
    }
  };

  const totalPendente = filteredContas
    .filter((c) => c.status !== "pago")
    .reduce((total, conta) => total + (conta.valor - conta.valorPago), 0);

  const totalVencido = filteredContas
    .filter((c) => c.status === "vencido")
    .reduce((total, conta) => total + conta.valor, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Contas a Receber
        </h1>
        <p className="text-muted-foreground">
          Gerencie os valores a receber de clientes
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total a Receber</p>
                <h3 className="text-2xl font-bold text-foreground">
                  R${" "}
                  {totalPendente.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </h3>
              </div>
              <DollarSign className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Contas Vencidas</p>
                <h3 className="text-2xl font-bold text-destructive">
                  R${" "}
                  {totalVencido.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </h3>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Contas</p>
                <h3 className="text-2xl font-bold text-foreground">
                  {filteredContas.length}
                </h3>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por cliente ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="parcial">Parcial</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
                <SelectItem value="vencido">Vencido</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Mais Filtros
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Contas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Contas a Receber</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Valor Pago</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dias em Atraso</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContas.map((conta) => (
                <TableRow key={conta.id}>
                  <TableCell className="font-medium">{conta.cliente}</TableCell>
                  <TableCell>{conta.descricao}</TableCell>
                  <TableCell>
                    R${" "}
                    {conta.valor.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>
                    R${" "}
                    {conta.valorPago.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>
                    {new Date(conta.dataVencimento).toLocaleDateString("pt-BR")}
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
                    <div className="flex gap-2">
                      {conta.status !== "pago" && (
                        <Button size="sm" variant="outline">
                          <Check className="h-4 w-4 mr-1" />
                          Baixar
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Mail className="h-4 w-4 mr-1" />
                        Lembrete
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

export default ContasReceber;
