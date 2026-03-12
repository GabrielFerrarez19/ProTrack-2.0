import { useState, useCallback, useEffect } from "react";
import type { ContaPagar } from "../@types/types.contasPagar";
import { listOverdueBills } from "../services/billsPayable";

export const useContasPagarVencidas = () => {
  const [contasVencidas, setContasVencidas] = useState<ContaPagar[]>([]);
  const [totalVencidas, setTotalVencidas] = useState<number>(0);
  const [loadingVencidas, setLoadingVencidas] = useState(false);
  const [errorVencidas, setErrorVencidas] = useState<string | null>(null);
  const [monitoramentoExecutado, setMonitoramentoExecutado] = useState(false);

  const executarMonitoramento = useCallback(async () => {
    setMonitoramentoExecutado(true);
    await loadContasVencidas();
    return null;
  }, []);

  const loadContasVencidas = useCallback(async () => {
    try {
      setLoadingVencidas(true);
      setErrorVencidas(null);

      const bills = await listOverdueBills();

      const mapped: ContaPagar[] = bills.map((bill) => ({
        id: bill.id,
        fornecedor_id: bill.vendor_id ?? undefined,
        fornecedor_nome: bill.vendor_name ?? "Fornecedor não informado",
        valor: bill.amount,
        data_vencimento: bill.due_date,
        status: "vencido",
        categoria_id: bill.category_id,
        categoria_nome: bill.category_name ?? "Sem categoria",
        descricao: bill.description,
        data_agendamento: bill.scheduled_date ?? undefined,
        data_pagamento: bill.payment_date ?? undefined,
        valor_pago: bill.amount_paid ?? undefined,
        forma_pagamento: bill.payment_method_name ?? undefined,
        observacoes: bill.notes ?? undefined,
        dias_atraso: 0,
        criado_em: bill.created_at,
        atualizado_em: bill.updated_at,
      }));

      setContasVencidas(mapped);
      setTotalVencidas(mapped.length);
    } catch (e) {
      console.error(e);
      setErrorVencidas("Erro ao carregar contas vencidas.");
      setContasVencidas([]);
      setTotalVencidas(0);
    } finally {
      setLoadingVencidas(false);
    }
  }, []);

  useEffect(() => {
    loadContasVencidas();
  }, [loadContasVencidas]);

  return {
    contasVencidas,
    totalVencidas,
    loadingVencidas,
    errorVencidas,
    monitoramentoExecutado,
    reload: loadContasVencidas,
    executarMonitoramento,
  };
};
