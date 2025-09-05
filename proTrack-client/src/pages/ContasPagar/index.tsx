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
import { useContasPagar } from "../../hooks/useContasPagar";
import { useContasPagarVencidas } from "../../hooks/useContasPagarVencidas";
import type { ContaPagarFiltros } from "../../@types/types.contasPagar";
import { Button } from "../../components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { StatusMonitoramento } from "./components";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/header";

export function ContasPagar() {
  const {
    contas,
    categorias,
    resumo,
    loading,
    error,
    listarContas,
    limparErro,
    formatarMoeda,
  } = useContasPagar();

  const {
    totalVencidas,
    loadingVencidas,
    errorVencidas,
    monitoramentoExecutado,
    executarMonitoramento,
    reload: reloadVencidas,
  } = useContasPagarVencidas();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [categoriaFilter, setCategoriaFilter] = useState("todas");

  // Aplicar filtros
  const aplicarFiltros = () => {
    const filtros: ContaPagarFiltros = {};

    if (searchTerm) filtros.search = searchTerm;
    if (statusFilter !== "todos") filtros.status = statusFilter;
    if (categoriaFilter !== "todas") filtros.categoria_id = categoriaFilter;

    listarContas(filtros);
  };

  // Limpar filtros
  const limparFiltros = () => {
    setSearchTerm("");
    setStatusFilter("todos");
    setCategoriaFilter("todas");
    listarContas();
  };

  // Recarregar dados
  const recarregarDados = () => {
    listarContas();
  };

  // Tratar erros
  if (error) {
    toast.error(error);
    limparErro();
  }

  // Tratar erros do monitoramento
  if (errorVencidas) {
    toast.error(errorVencidas);
  }

  // Preparar dados para os componentes
  const categoriasOptions = [
    { value: "todas", label: "Todas as Categorias" },
    ...categorias.map((cat) => ({
      value: cat.id,
      label: cat.nome,
    })),
  ];

  const statusOptions = [
    { value: "todos", label: "Todos os Status" },
    { value: "pendente", label: "Pendente" },
    { value: "vencido", label: "Vencido" },
    { value: "agendado", label: "Agendado" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <Header
          title="Bem vindo a página Contas a Pagar!"
          text="Aqui você pode gerenciar as contas e pagamentos a fornecedores"
        />

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={recarregarDados}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>

          <Button
            size="sm"
            className="cursor-pointer bg-gradient-to-r from-[#628DFD] to-[#6F31FF] hover:from-[#7A9BFD] hover:to-[#B597F9]"
            onClick={() => navigate("/cadastrocontaspagar")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Conta
          </Button>
        </div>

        {/* Status do Monitoramento */}
        <StatusMonitoramento
          monitoramentoExecutado={monitoramentoExecutado}
          executarMonitoramento={executarMonitoramento}
          reload={reloadVencidas}
        />
      </div>

      {/* Cards de Resumo */}
      {resumo ? (
        <SummaryCards
          totalPendente={resumo.total_pendente || 0}
          totalVencido={resumo.total_vencido || 0}
          totalAgendado={resumo.total_agendado || 0}
          totalCount={resumo.total_contas || 0}
          contasVencidasCount={resumo.contas_vencidas_count || 0}
          totalVencidasMonitoramento={totalVencidas}
          formatarMoeda={formatarMoeda}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="h-32 bg-muted rounded-lg animate-pulse"></div>
          <div className="h-32 bg-muted rounded-lg animate-pulse"></div>
          <div className="h-32 bg-muted rounded-lg animate-pulse"></div>
          <div className="h-32 bg-muted rounded-lg animate-pulse"></div>
          <div className="h-32 bg-muted rounded-lg animate-pulse"></div>
        </div>
      )}

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
            categorias={categoriasOptions}
            statusOptions={statusOptions}
            onAplicarFiltros={aplicarFiltros}
            onLimparFiltros={limparFiltros}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Tabela de Contas */}
      <Card>
        <CardHeader>
          <CardTitle>
            Lista de Contas a Pagar
            {contas.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({contas.length} conta{contas.length !== 1 ? "s" : ""})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AccountsTable
            contas={contas.map((conta) => ({
              ...conta,
              descricao: conta.descricao || "", // garante que seja string
            }))}
            loading={loading}
            onRefresh={recarregarDados}
          />
        </CardContent>
      </Card>

      {/* Estado de carregamento */}
      {(loading || loadingVencidas) && (
        <div className="flex justify-center items-center py-8">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span className="text-muted-foreground">Carregando...</span>
          </div>
        </div>
      )}
    </div>
  );
}
