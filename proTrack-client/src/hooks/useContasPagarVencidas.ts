import { useState, useCallback } from "react";
import type { ContaPagar } from "../@types/types.contasPagar";

export const useContasPagarVencidas = () => {
  const [contasVencidas, setContasVencidas] = useState<ContaPagar[]>([]);
  const [totalVencidas, setTotalVencidas] = useState<number>(0);
  const [loadingVencidas, setLoadingVencidas] = useState(false);
  const [errorVencidas, setErrorVencidas] = useState<string | null>(null);
  const [monitoramentoExecutado, setMonitoramentoExecutado] = useState(false);

  const executarMonitoramento = useCallback(async () => {
    setMonitoramentoExecutado(true);
    return null;
  }, []);

  const loadContasVencidas = useCallback(async () => {
    setLoadingVencidas(true);
    setContasVencidas([]);
    setTotalVencidas(0);
    setLoadingVencidas(false);
  }, []);

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
