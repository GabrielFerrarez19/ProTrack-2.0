import { useState, useCallback } from "react";
import type { VendaResponse } from "../@types/types.components";

export const useVendasVencidas = () => {
  const [vendas, setVendas] = useState<VendaResponse[]>([]);
  const [totalVencidas, setTotalVencidas] = useState<number>(0);
  const [loadingVencidas, setLoadingVencidas] = useState(false);
  const [errorVencidas, setErrorVencidas] = useState<string | null>(null);
  const [monitoramentoExecutado, setMonitoramentoExecutado] = useState(false);

  const executarMonitoramento = useCallback(async () => {
    setMonitoramentoExecutado(true);
    return null;
  }, []);

  const loadVendasVencidas = useCallback(async () => {
    setLoadingVencidas(true);
    setVendas([]);
    setTotalVencidas(0);
    setLoadingVencidas(false);
  }, []);

  return {
    vendas,
    totalVencidas,
    loadingVencidas,
    errorVencidas,
    monitoramentoExecutado,
    reload: loadVendasVencidas,
    executarMonitoramento,
  };
};
