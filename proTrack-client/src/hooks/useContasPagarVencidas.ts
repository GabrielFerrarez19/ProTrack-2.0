// hooks/useContasPagarVencidas.ts
import { useState, useEffect, useCallback } from "react";
import type { ContaPagar } from "../@types/types.contasPagar";
import {
  executarMonitoramentoContasPagar,
  obterEstatisticasContasVencidas,
} from "../services/api";

export const useContasPagarVencidas = () => {
  const [contasVencidas, setContasVencidas] = useState<ContaPagar[]>([]);
  const [totalVencidas, setTotalVencidas] = useState<number>(0);
  const [loadingVencidas, setLoadingVencidas] = useState<boolean>(true);
  const [errorVencidas, setErrorVencidas] = useState<string | null>(null);
  const [monitoramentoExecutado, setMonitoramentoExecutado] =
    useState<boolean>(false);

  const executarMonitoramento = useCallback(async () => {
    try {
      // Executa o monitoramento no backend usando a função da API
      const resultado = await executarMonitoramentoContasPagar();

      if (resultado.success) {
        console.log("✅ Monitoramento de contas executado:", resultado);
        setMonitoramentoExecutado(true);
        return resultado;
      } else {
        console.warn(
          "⚠️ Monitoramento de contas não executado automaticamente"
        );
        return null;
      }
    } catch (error) {
      console.warn("⚠️ Erro ao executar monitoramento de contas:", error);
      // Não falha a aplicação se o monitoramento não executar
      return null;
    }
  }, []);

  const loadContasVencidas = useCallback(async () => {
    setLoadingVencidas(true);
    setErrorVencidas(null);

    try {
      // Primeiro executa o monitoramento
      await executarMonitoramento();

      // Depois busca as estatísticas de contas vencidas
      const estatisticas = await obterEstatisticasContasVencidas();

      if (estatisticas.success) {
        setTotalVencidas(estatisticas.estatisticas.totalVencidas || 0);
        // Aqui você pode buscar as contas vencidas específicas se necessário
        // Por enquanto, apenas o total é suficiente para o dashboard
      } else {
        setTotalVencidas(0);
      }
    } catch (err) {
      console.error("Erro ao buscar contas vencidas:", err);
      setErrorVencidas("Erro ao buscar contas vencidas");
      setContasVencidas([]);
      setTotalVencidas(0);
    } finally {
      setLoadingVencidas(false);
    }
  }, [executarMonitoramento]);

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
