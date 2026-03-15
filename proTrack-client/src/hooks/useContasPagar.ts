import { useState, useCallback, useEffect } from "react";
import type {
  ContaPagar,
  ContaPagarCreate,
  ContaPagarUpdate,
  ContaPagarFiltros,
  ContaPagarResumo,
  Categoria,
} from "../@types/types.contasPagar";
import {
  getBillsSummary,
  listBillsPayable,
  payBill,
  createBillPayable,
} from "../services/billsPayable";
import { listBillCategories } from "../services/billCategories";

function mapStatusFromApi(status: string): ContaPagar["status"] {
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
}

function aplicarFiltrosLocais(
  items: ContaPagar[],
  filtros: ContaPagarFiltros,
): ContaPagar[] {
  return items.filter((conta) => {
    const { search, status, categoria_id } = filtros;
    if (search) {
      const lower = search.toLowerCase();
      if (
        !conta.fornecedor_nome.toLowerCase().includes(lower) &&
        !(conta.descricao ?? "").toLowerCase().includes(lower) &&
        !(conta.observacoes ?? "").toLowerCase().includes(lower)
      )
        return false;
    }
    if (status && status !== "todos" && conta.status !== status) return false;
    if (categoria_id && categoria_id !== "todas" && conta.categoria_id !== categoria_id)
      return false;
    return true;
  });
}

export const useContasPagar = () => {
  const [contas, setContas] = useState<ContaPagar[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [resumo, setResumo] = useState<ContaPagarResumo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listarContas = useCallback(
    async (filtros: ContaPagarFiltros = {}) => {
      try {
        setLoading(true);
        setError(null);
        const [bills, summary] = await Promise.all([
          listBillsPayable(),
          getBillsSummary().catch(() => null),
        ]);

        const hoje = new Date();
        const contasMapeadas: ContaPagar[] = bills.map((bill) => {
          const vencimento = new Date(bill.due_date);
          const diffDays = Math.ceil(
            (hoje.getTime() - vencimento.getTime()) / (1000 * 60 * 60 * 24),
          );
          return {
            id: bill.id,
            fornecedor_id: bill.vendor_id ?? undefined,
            fornecedor_nome: bill.vendor_name ?? "Fornecedor não informado",
            valor: bill.amount,
            data_vencimento: bill.due_date,
            status: mapStatusFromApi(String(bill.status)),
            categoria_id: bill.category_id,
            categoria_nome: bill.category_name ?? "Sem categoria",
            descricao: bill.description,
            data_agendamento: bill.scheduled_date ?? undefined,
            data_pagamento: bill.payment_date ?? undefined,
            valor_pago: bill.amount_paid ?? undefined,
            forma_pagamento: bill.payment_method_name ?? undefined,
            observacoes: bill.notes ?? undefined,
            dias_atraso: Math.max(0, diffDays),
            criado_em: bill.created_at,
            atualizado_em: bill.updated_at,
          };
        });

        setContas(aplicarFiltrosLocais(contasMapeadas, filtros));

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
    [],
  );

  const listarCategorias = useCallback(async () => {
    try {
      const categoriasApi = await listBillCategories();
      setCategorias(
        categoriasApi.map((c) => ({
          id: c.id,
          nome: c.name,
          tipo: "despesa" as const,
          cor: "#6366f1",
          criado_em: c.created_at,
          atualizado_em: c.updated_at,
        })),
      );
    } catch (e) {
      console.error(e);
      setCategorias([]);
    }
  }, []);

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
          e instanceof Error ? e.message : "Erro ao criar conta a pagar.",
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [listarContas],
  );

  const atualizarConta = useCallback(
    async (_id: string, _data: ContaPagarUpdate): Promise<ContaPagar | null> => {
      setError("Atualização ainda não integrada ao back-end.");
      return null;
    },
    [],
  );

  const excluirConta = useCallback(async (_id: string): Promise<boolean> => {
    setError("Exclusão ainda não disponível no back-end.");
    return false;
  }, []);

  const marcarComoPaga = useCallback(
    async (
      id: string,
      valorPago: number,
      formaPagamento: string,
    ): Promise<ContaPagar | null> => {
      try {
        setLoading(true);
        setError(null);
        await payBill(id, valorPago, formaPagamento);
        await listarContas();
        return contas.find((c) => c.id === id) ?? null;
      } catch (e) {
        console.error(e);
        setError("Erro ao marcar conta como paga.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [listarContas, contas],
  );

  const limparErro = useCallback(() => setError(null), []);

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
    listarCategorias();
  }, [listarContas, listarCategorias]);

  return {
    contas,
    categorias,
    resumo,
    loading,
    error,
    listarContas,
    listarCategorias,
    criarConta,
    atualizarConta,
    excluirConta,
    marcarComoPaga,
    limparErro,
    formatarMoeda,
    formatarData,
  };
};
