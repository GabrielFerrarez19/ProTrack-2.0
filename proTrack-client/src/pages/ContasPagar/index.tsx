import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { FiltersBar } from "./components/FiltersBar";
import { SummaryCards } from "./components/SummaryCards";
import { AccountsTable } from "./components/AccountsTable";
import type { ContaPagar } from "../../@types/types.components";

export function ContasPagar() {
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
      <SummaryCards
        totalPendente={totalPendente}
        totalVencido={totalVencido}
        totalAgendado={totalAgendado}
        totalCount={filteredContas.length}
      />

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros e Pesquisa</CardTitle>
        </CardHeader>
        <CardContent>
          <FiltersBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            categoriaFilter={categoriaFilter}
            setCategoriaFilter={setCategoriaFilter}
            categorias={categorias}
          />
        </CardContent>
      </Card>

      {/* Tabela de Contas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Contas a Pagar</CardTitle>
        </CardHeader>
        <CardContent>
          <AccountsTable contas={filteredContas} />
        </CardContent>
      </Card>
    </div>
  );
}
