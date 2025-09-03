import { useState, useCallback } from "react";
import { api } from "../services/apiClient";

// Interfaces para o monitoramento de contas a pagar
export interface ContaPagarVencida {
  id: number;
  fornecedor_nome: string;
  data_vencimento: string;
  valor: number;
  status: string;
  descricao: string;
  categoria_id: number;
}

export interface EstatisticasContasVencidas {
  totalVencidas: number;
  valorTotalVencido: number;
  ultimaVerificacao?: Date;
}

export interface ResultadoMonitoramento {
  contasIdentificadas: number;
  contasProcessadas: number;
  timestamp: Date;
}

export interface StatusSistema {
  status: string;
  timestamp: Date;
  estatisticas: EstatisticasContasVencidas;
  sistema: {
    nome: string;
    versao: string;
    descricao: string;
  };
}

// Hook para monitoramento de contas a pagar vencidas
export const useContasPagarMonitoramento = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Executar monitoramento manual
  const executarMonitoramento =
    useCallback(async (): Promise<ResultadoMonitoramento | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.post("/monitoramento-contas/executar");

        if (response.data.success) {
          return response.data.resultado;
        } else {
          throw new Error(
            response.data.message || "Erro ao executar monitoramento"
          );
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || err.message || "Erro desconhecido";
        setError(errorMessage);
        console.error("Erro ao executar monitoramento:", err);
        return null;
      } finally {
        setLoading(false);
      }
    }, []);

  // Obter estatísticas de contas vencidas
  const obterEstatisticas =
    useCallback(async (): Promise<EstatisticasContasVencidas | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get("/monitoramento-contas/estatisticas");

        if (response.data.success) {
          return response.data.estatisticas;
        } else {
          throw new Error(
            response.data.message || "Erro ao obter estatísticas"
          );
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || err.message || "Erro desconhecido";
        setError(errorMessage);
        console.error("Erro ao obter estatísticas:", err);
        return null;
      } finally {
        setLoading(false);
      }
    }, []);

  // Verificar status do sistema
  const verificarStatus =
    useCallback(async (): Promise<StatusSistema | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get("/monitoramento-contas/status");

        if (response.data.success) {
          return response.data;
        } else {
          throw new Error(response.data.message || "Erro ao verificar status");
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || err.message || "Erro desconhecido";
        setError(errorMessage);
        console.error("Erro ao verificar status:", err);
        return null;
      } finally {
        setLoading(false);
      }
    }, []);

  // Limpar contas vencidas antigas
  const limparContasAntigas = useCallback(
    async (dias: number = 365): Promise<number | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.delete(
          `/monitoramento-contas/limpar?dias=${dias}`
        );

        if (response.data.success) {
          return response.data.contasArquivadas;
        } else {
          throw new Error(
            response.data.message || "Erro ao limpar contas antigas"
          );
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || err.message || "Erro desconhecido";
        setError(errorMessage);
        console.error("Erro ao limpar contas antigas:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Limpar erro
  const limparErro = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estados
    loading,
    error,

    // Funções
    executarMonitoramento,
    obterEstatisticas,
    verificarStatus,
    limparContasAntigas,
    limparErro,
  };
};
