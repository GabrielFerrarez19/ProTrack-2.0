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
import { useDashboard } from "../../hooks/useDashboard";
import { useVendasVencidas } from "../../hooks/useVendasVencidas";
import { Header } from "../../components/header";

// IMPORT DOS COMPONENTES SEPARADOS
import { StatusMonitoramento } from "./components/StatusMonitoramento";
/* import { CardMonitoramento } from "./components/CardMonitoramento"; */

export function ContasReceber() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const { dados, loading, error } = useDashboard();
  const {
    vendas,
    totalVencidas,
    loadingVencidas,
    errorVencidas,
    monitoramentoExecutado,
    executarMonitoramento,
    reload,
  } = useVendasVencidas();

  console.log("vendasIndex", vendas);

  if (loading || loadingVencidas)
    return <p className="p-6">Carregando dados financeiros...</p>;

  if (error || errorVencidas)
    return <p className="p-6 text-red-600">{error || errorVencidas}</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <Header
          title="Contas a Receber!"
          text="Gerencie os valores a receber de clientes."
        />

        {/* Status do Monitoramento */}
        <StatusMonitoramento
          monitoramentoExecutado={monitoramentoExecutado}
          executarMonitoramento={executarMonitoramento}
          reload={reload}
        />
      </div>

      {/* Card de Monitoramento */}
      {/* <CardMonitoramento monitoramentoExecutado={monitoramentoExecutado} /> */}

      <ResumoCards totalVencidas={totalVencidas} dados={dados} />

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
          <TabelaContas vendas={vendas} />
        </CardContent>
      </Card>
    </div>
  );
}
