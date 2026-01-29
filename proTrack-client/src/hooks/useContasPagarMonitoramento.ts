import { useState, useCallback } from "react";

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

export const useContasPagarMonitoramento = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executarMonitoramento =
    useCallback(async (): Promise<ResultadoMonitoramento | null> => {
      setLoading(true);
      setLoading(false);
      return null;
    }, []);

  const obterEstatisticas =
    useCallback(async (): Promise<EstatisticasContasVencidas | null> => {
      setLoading(true);
      setLoading(false);
      return null;
    }, []);

  const verificarStatus =
    useCallback(async (): Promise<StatusSistema | null> => {
      setLoading(true);
      setLoading(false);
      return null;
    }, []);

  const limparContasAntigas = useCallback(
    async (_dias: number = 365): Promise<number | null> => {
      setLoading(true);
      setLoading(false);
      return null;
    },
    [],
  );

  const limparErro = useCallback(() => setError(null), []);

  return {
    loading,
    error,
    executarMonitoramento,
    obterEstatisticas,
    verificarStatus,
    limparContasAntigas,
    limparErro,
  };
};
