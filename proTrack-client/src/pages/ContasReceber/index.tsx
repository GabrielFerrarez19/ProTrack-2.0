import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { FiltrosContas } from "./components/FiltrosContas";
import { ResumoCards } from "./components/ResumoCards";
import { TabelaContas } from "./components/TabelaContas";
import type { ContaReceber } from "../../@types/types.components";

export function ContasReceber() {
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

      <ResumoCards
        totalPendente={totalPendente}
        totalVencido={totalVencido}
        totalContas={filteredContas.length}
      />

      <FiltrosContas
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <Card className="bg-white border-pastel-blue/30">
        <CardHeader>
          <CardTitle>Lista de Contas a Receber</CardTitle>
        </CardHeader>
        <CardContent>
          <TabelaContas contas={filteredContas} />
        </CardContent>
      </Card>
    </div>
  );
}
