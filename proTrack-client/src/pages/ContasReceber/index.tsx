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
import { Header } from "../../components/header";

import { useContasReceber } from "@/hooks/useContasReceber";

export function ContasReceber() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const { dados, loading, error } = useContasReceber();

  if (loading) return <p className="p-6">Carregando dados financeiros...</p>;

  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <Header
          title="Contas a Receber!"
          text="Gerencie os valores a receber de clientes."
        />
      </div>

      {/* Card de Monitoramento */}
      {/* <CardMonitoramento monitoramentoExecutado={monitoramentoExecutado} /> */}

      <ResumoCards dados={dados} />

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
          <TabelaContas vendas={[]} />
        </CardContent>
      </Card>
    </div>
  );
}
