import { useState } from "react";
import {
  getRelatorioPorTipo,
  getRelatorioCompleto,
  getRelatorioLucroProduto,
  getRelatorioLucroCategoria,
  getRelatorioLucroPeriodo,
  getRelatorioEstoqueInvestimento,
} from "../services/api";
import type {
  RelatorioCompleto,
  RelatorioLucroProduto,
  RelatorioLucroCategoria,
  RelatorioLucroPeriodo,
  RelatorioEstoqueInvestimento,
} from "../@types/types.api";

export const useRelatorios = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gerarRelatorioPorTipo = async (
    tipo: string,
    dataInicio?: string,
    dataFim?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getRelatorioPorTipo(tipo, dataInicio, dataFim);
      return response.relatorio;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const gerarRelatorioCompleto = async (
    dataInicio: string,
    dataFim: string
  ): Promise<RelatorioCompleto> => {
    setLoading(true);
    setError(null);

    try {
      const relatorio = await getRelatorioCompleto(dataInicio, dataFim);
      return relatorio;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const gerarRelatorioLucroProduto = async (): Promise<
    RelatorioLucroProduto[]
  > => {
    setLoading(true);
    setError(null);

    try {
      const response = await getRelatorioLucroProduto();
      return response.relatorio;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const gerarRelatorioLucroCategoria = async (): Promise<
    RelatorioLucroCategoria[]
  > => {
    setLoading(true);
    setError(null);

    try {
      const response = await getRelatorioLucroCategoria();
      return response.relatorio;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const gerarRelatorioLucroPeriodo = async (
    dataInicio: string,
    dataFim: string
  ): Promise<RelatorioLucroPeriodo[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await getRelatorioLucroPeriodo(dataInicio, dataFim);
      return response.relatorio;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const gerarRelatorioEstoqueInvestimento = async (): Promise<
    RelatorioEstoqueInvestimento[]
  > => {
    setLoading(true);
    setError(null);

    try {
      const response = await getRelatorioEstoqueInvestimento();
      return response.relatorio;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const exportarRelatorio = async (
    relatorio: any,
    nomeArquivo: string,
    formato: "json" | "csv" = "json"
  ) => {
    try {
      let dataStr: string;
      let mimeType: string;
      let extension: string;

      if (formato === "json") {
        dataStr = JSON.stringify(relatorio, null, 2);
        mimeType = "application/json";
        extension = "json";
      } else {
        // Implementar conversão para CSV se necessário
        dataStr = JSON.stringify(relatorio, null, 2);
        mimeType = "text/csv";
        extension = "csv";
      }

      const dataBlob = new Blob([dataStr], { type: mimeType });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${nomeArquivo}.${extension}`;
      link.click();
      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error("Erro ao exportar relatório:", error);
      throw error;
    }
  };

  return {
    loading,
    error,
    gerarRelatorioPorTipo,
    gerarRelatorioCompleto,
    gerarRelatorioLucroProduto,
    gerarRelatorioLucroCategoria,
    gerarRelatorioLucroPeriodo,
    gerarRelatorioEstoqueInvestimento,
    exportarRelatorio,
  };
};

