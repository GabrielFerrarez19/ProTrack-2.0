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
import { PageLoading } from "@/components/PageLoading";

import { useContasReceber } from "@/hooks/useContasReceber";

export function ContasReceber() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const { dados, vendas, loading, error, reload } = useContasReceber();

  const filteredVendas = vendas.filter((v) => {
    const s = v.sale;
    const matchSearch =
      !searchTerm ||
      String(s.sale_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.products.some((p) =>
        p.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    if (!matchSearch) return false;
    if (statusFilter === "todos") return true;
    const statusLower = String(s.sale_status).toLowerCase();
    if (statusFilter === "vencido")
      return v.installment.some(
        (i) => String(i.installment_status).toLowerCase() === "overdue"
      );
    return statusLower === statusFilter;
  });

  if (loading)
    return <PageLoading message="Carregando dados financeiros..." />;

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
          <TabelaContas vendas={filteredVendas} onVendaUpdated={reload} />
        </CardContent>
      </Card>
    </div>
  );
}
