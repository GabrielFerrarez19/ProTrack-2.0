// hooks/useVendasVencidas.ts
import { useState, useEffect, useCallback } from "react";
import type { VendaResponse } from "../@types/types.components";
import {
  fetchVendasVencidas,
  fetchTotalVendasVencidas,
  executarMonitoramentoVendas,
} from "../services/api";

export const useVendasVencidas = () => {
  const [vendas, setVendas] = useState<VendaResponse[]>([]);
  const [totalVencidas, setTotalVencidas] = useState<number>(0);
  const [loadingVencidas, setLoadingVencidas] = useState<boolean>(true);
  const [errorVencidas, setErrorVencidas] = useState<string | null>(null);
  const [monitoramentoExecutado, setMonitoramentoExecutado] =
    useState<boolean>(false);

  const executarMonitoramento = useCallback(async () => {
    try {
      // Executa o monitoramento no backend usando a função da API
      const resultado = await executarMonitoramentoVendas();

      if (resultado.success) {
        console.log("✅ Monitoramento executado:", resultado);
        setMonitoramentoExecutado(true);
        return resultado;
      } else {
        console.warn("⚠️ Monitoramento não executado automaticamente");
        return null;
      }
    } catch (error) {
      console.warn("⚠️ Erro ao executar monitoramento automático:", error);
      // Não falha a aplicação se o monitoramento não executar
      return null;
    }
  }, []);

  const loadVendasVencidas = useCallback(async () => {
    setLoadingVencidas(true);
    setErrorVencidas(null);

    try {
      // Primeiro executa o monitoramento
      await executarMonitoramento();

      // Depois busca as vendas vencidas e estatísticas
      const [vendasData, totalData] = await Promise.all([
        fetchVendasVencidas(),
        fetchTotalVendasVencidas(),
      ]);

      setVendas(Array.isArray(vendasData) ? vendasData : []);
      setTotalVencidas(totalData.totalVendasVencidas || 0);
    } catch (err) {
      console.error("Erro ao buscar vendas vencidas:", err);
      setErrorVencidas("Erro ao buscar vendas vencidas");
      setVendas([]);
      setTotalVencidas(0);
    } finally {
      setLoadingVencidas(false);
    }
  }, [executarMonitoramento]);

  useEffect(() => {
    loadVendasVencidas();
  }, [loadVendasVencidas]);

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
