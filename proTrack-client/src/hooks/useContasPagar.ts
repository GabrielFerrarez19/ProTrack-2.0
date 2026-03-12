import { useState, useCallback, useEffect } from "react";
import type {
  ContaPagar,
  ContaPagarCreate,
  ContaPagarUpdate,
  ContaPagarFiltros,
  ContaPagarResumo,
  Categoria,
  Fornecedor,
  FornecedorCreate,
  FornecedorUpdate,
  RelatorioContasPagar,
  EstatisticasContasPagar,
  ProjecaoPagamentos,
  AlertaContasPagar,
  ConfiguracoesContasPagar,
  ExportacaoFiltros,
} from "../@types/types.contasPagar";
import {
  getBillsSummary,
  listBillsPayable,
  payBill,
  createBillPayable,
} from "../services/billsPayable";
import { listBillCategories } from "../services/billCategories";

export const useContasPagar = () => {
  const [contas, setContas] = useState<ContaPagar[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [resumo, setResumo] = useState<ContaPagarResumo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aplicarFiltrosLocais = (
    items: ContaPagar[],
    filtros: ContaPagarFiltros,
  ) => {
    return items.filter((conta) => {
      const { search, status, categoria_id } = filtros;

      if (search) {
        const lower = search.toLowerCase();
        const matchSearch =
          conta.fornecedor_nome.toLowerCase().includes(lower) ||
          (conta.descricao ?? "").toLowerCase().includes(lower) ||
          (conta.observacoes ?? "").toLowerCase().includes(lower);

        if (!matchSearch) return false;
      }

      if (status && status !== "todos") {
        if (conta.status !== status) return false;
      }

      if (categoria_id && categoria_id !== "todas") {
        if (conta.categoria_id !== categoria_id) return false;
      }

      return true;
    });
  };

  const mapStatusFromApi = (status: string): ContaPagar["status"] => {
    switch (status) {
      case "pending":
        return "pendente";
      case "paid":
        return "pago";
      case "overdue":
        return "vencido";
      case "scheduled":
        return "agendado";
      default:
        return "pendente";
    }
  };

  const calcularDiasAtrasoInterno = useCallback((dataVencimento: string) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffTime = hoje.getTime() - vencimento.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }, []);

  const listarContas = useCallback(
    async (filtros: ContaPagarFiltros = {}) => {
      try {
        setLoading(true);
        setError(null);

        const [bills, summary] = await Promise.all([
          listBillsPayable(),
          getBillsSummary().catch(() => null),
        ]);

        const contasMapeadas: ContaPagar[] = bills.map((bill) => ({
          id: bill.id,
          fornecedor_id: bill.vendor_id ?? undefined,
          fornecedor_nome: bill.vendor_name ?? "Fornecedor não informado",
          valor: bill.amount,
          data_vencimento: bill.due_date,
          status: mapStatusFromApi(
            typeof bill.status === "string" ? bill.status : String(bill.status),
          ),
          categoria_id: bill.category_id,
          categoria_nome: bill.category_name ?? "Sem categoria",
          descricao: bill.description,
          data_agendamento: bill.scheduled_date ?? undefined,
          data_pagamento: bill.payment_date ?? undefined,
          valor_pago: bill.amount_paid ?? undefined,
          forma_pagamento: bill.payment_method_name ?? undefined,
          observacoes: bill.notes ?? undefined,
          dias_atraso: calcularDiasAtrasoInterno(bill.due_date),
          criado_em: bill.created_at,
          atualizado_em: bill.updated_at,
        }));

        const contasFiltradas = aplicarFiltrosLocais(contasMapeadas, filtros);
        setContas(contasFiltradas);

        if (summary) {
          setResumo({
            total_pendente: summary.total_to_pay,
            total_vencido: summary.total_overdue,
            total_agendado: summary.total_scheduled,
            total_pago: 0,
            total_contas: summary.total_quantity,
            contas_vencidas_count:
              summary.total_overdue > 0 ? summary.total_quantity : 0,
            total_vence_hoje: 0,
            total_proximos_7_dias: 0,
          });
        } else {
          setResumo(null);
        }
      } catch (e) {
        console.error(e);
        setError("Erro ao carregar contas a pagar.");
      } finally {
        setLoading(false);
      }
    },
    [calcularDiasAtrasoInterno],
  );

  const criarConta = useCallback(
    async (contaData: ContaPagarCreate): Promise<ContaPagar | null> => {
      try {
        setLoading(true);
        setError(null);

        if (
          !contaData.fornecedor_id ||
          !contaData.categoria_id ||
          !contaData.forma_pagamento
        ) {
          throw new Error(
            "Fornecedor, categoria e forma de pagamento são obrigatórios.",
          );
        }

        await createBillPayable({
          vendor_id: contaData.fornecedor_id,
          category_id: contaData.categoria_id,
          payment_method_id: contaData.forma_pagamento,
          amount: contaData.valor,
          due_date: contaData.data_vencimento,
          status: "pending",
          description: contaData.descricao,
          notes: contaData.observacoes ?? "",
        });

        await listarContas();
        return null;
      } catch (e) {
        console.error(e);
        setError(
          e instanceof Error
            ? e.message
            : "Erro ao criar conta a pagar no back-end.",
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [listarContas],
  );

  const atualizarConta = useCallback(
    async (
      _id: string,
      _contaData: ContaPagarUpdate,
    ): Promise<ContaPagar | null> => {
      setError(
        "Atualização de contas a pagar ainda não está integrada ao back-end.",
      );
      return null;
    },
    [],
  );

  const excluirConta = useCallback(async (_id: string): Promise<boolean> => {
    setError(
      "Exclusão de contas a pagar ainda não está disponível no back-end.",
    );
    return false;
  }, []);

  const marcarComoPaga = useCallback(
    async (
      _id: string,
      _valorPago: number,
      _formaPagamento: string,
    ): Promise<ContaPagar | null> => {
      try {
        setLoading(true);
        setError(null);
        await payBill(_id, _valorPago, _formaPagamento);
        await listarContas();

        const contaAtualizada = contas.find((c) => c.id === _id) ?? null;
        return contaAtualizada;
      } catch (e) {
        console.error(e);
        setError("Erro ao marcar conta como paga.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [contas, listarContas],
  );

  const obterResumo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const summary = await getBillsSummary();
      setResumo({
        total_pendente: summary.total_to_pay,
        total_vencido: summary.total_overdue,
        total_agendado: summary.total_scheduled,
        total_pago: 0,
        total_contas: summary.total_quantity,
        contas_vencidas_count:
          summary.total_overdue > 0 ? summary.total_quantity : 0,
        total_vence_hoje: 0,
        total_proximos_7_dias: 0,
      });
    } catch (e) {
      console.error(e);
      setError("Erro ao carregar resumo de contas a pagar.");
    } finally {
      setLoading(false);
    }
  }, []);

  const obterContasPorVencimento = useCallback(async (): Promise<{
    contasVencemHoje: ContaPagar[];
    contasProximos7Dias: ContaPagar[];
  } | null> => {
    return { contasVencemHoje: [], contasProximos7Dias: [] };
  }, []);

  const listarFornecedoresHook = useCallback(async () => {
    setFornecedores([]);
  }, []);

  const criarFornecedorHook = useCallback(
    async (_fornecedorData: FornecedorCreate): Promise<Fornecedor | null> => {
      setLoading(true);
      setLoading(false);
      return null;
    },
    [],
  );

  const atualizarFornecedorHook = useCallback(
    async (
      _id: string,
      _fornecedorData: FornecedorUpdate,
    ): Promise<Fornecedor | null> => {
      setLoading(true);
      setLoading(false);
      return null;
    },
    [],
  );

  const excluirFornecedorHook = useCallback(
    async (_id: string): Promise<boolean> => {
      setLoading(true);
      setLoading(false);
      return false;
    },
    [],
  );

  const listarCategorias = useCallback(async () => {
    try {
      const categoriasApi = await listBillCategories();
      const mapped: Categoria[] = categoriasApi.map((c) => ({
        id: c.id,
        nome: c.name,
        tipo: "despesa",
        cor: "#6366f1",
        criado_em: c.created_at,
        atualizado_em: c.updated_at,
      }));
      setCategorias(mapped);
    } catch (e) {
      console.error(e);
      setCategorias([]);
    }
  }, []);

  const criarCategoriaHook = useCallback(
    async (_categoriaData: {
      nome: string;
      cor: string;
    }): Promise<Categoria | null> => {
      setLoading(true);
      setLoading(false);
      return null;
    },
    [],
  );

  const atualizarCategoriaHook = useCallback(
    async (
      _id: string,
      _categoriaData: { nome?: string; cor?: string },
    ): Promise<Categoria | null> => {
      setLoading(true);
      setLoading(false);
      return null;
    },
    [],
  );

  const excluirCategoriaHook = useCallback(
    async (_id: string): Promise<boolean> => {
      setLoading(true);
      setLoading(false);
      return false;
    },
    [],
  );

  const gerarRelatorio = useCallback(
    async (_filtros?: {
      status?: string;
      categoria_id?: string;
      data_inicio?: string;
      data_fim?: string;
      formato?: "pdf" | "excel";
    }): Promise<RelatorioContasPagar | null> => null,
    [],
  );

  const exportarDados = useCallback(
    async (_filtros: ExportacaoFiltros): Promise<boolean> => false,
    [],
  );

  const obterEstatisticas = useCallback(
    async (_periodo?: {
      data_inicio: string;
      data_fim: string;
    }): Promise<EstatisticasContasPagar | null> => null,
    [],
  );

  const obterProjecao = useCallback(
    async (_dias?: number): Promise<ProjecaoPagamentos | null> => null,
    [],
  );

  const obterAlertas = useCallback(
    async (): Promise<AlertaContasPagar[]> => [],
    [],
  );

  const marcarAlertaLido = useCallback(
    async (_alertaId: string): Promise<boolean> => false,
    [],
  );

  const obterConfiguracoes = useCallback(
    async (): Promise<ConfiguracoesContasPagar | null> => null,
    [],
  );

  const atualizarConfiguracoes = useCallback(
    async (
      _configuracoes: Partial<ConfiguracoesContasPagar>,
    ): Promise<boolean> => false,
    [],
  );

  const limparErro = useCallback(() => setError(null), []);

  const calcularDiasAtraso = useCallback((dataVencimento: string): number => {
    return calcularDiasAtrasoInterno(dataVencimento);
  }, [calcularDiasAtrasoInterno]);

  const formatarMoeda = useCallback((valor: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  }, []);

  const formatarData = useCallback((data: string): string => {
    return new Date(data).toLocaleDateString("pt-BR");
  }, []);

  useEffect(() => {
    listarContas();
  }, [listarContas]);

  return {
    contas,
    categorias,
    fornecedores,
    resumo,
    loading,
    error,
    listarContas,
    criarConta,
    atualizarConta,
    excluirConta,
    marcarComoPaga,
    obterResumo,
    obterContasPorVencimento,
    listarFornecedores: listarFornecedoresHook,
    criarFornecedor: criarFornecedorHook,
    atualizarFornecedor: atualizarFornecedorHook,
    excluirFornecedor: excluirFornecedorHook,
    listarCategorias,
    criarCategoria: criarCategoriaHook,
    atualizarCategoria: atualizarCategoriaHook,
    excluirCategoria: excluirCategoriaHook,
    gerarRelatorio,
    exportarDados,
    obterEstatisticas,
    obterProjecao,
    obterAlertas,
    marcarAlertaLido,
    obterConfiguracoes,
    atualizarConfiguracoes,
    limparErro,
    calcularDiasAtraso,
    formatarMoeda,
    formatarData,
  };
};
