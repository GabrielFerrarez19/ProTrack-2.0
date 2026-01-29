import { useState } from "react";
import type {
  RelatorioCompleto,
  RelatorioLucroProduto,
  RelatorioLucroCategoria,
  RelatorioLucroPeriodo,
  RelatorioEstoqueInvestimento,
} from "../@types/types.api";

const emptyRelatorioCompleto: RelatorioCompleto = {
  periodo: { inicio: "", fim: "" },
  resumo: {
    receita_total: 0,
    custo_total: 0,
    lucro_total: 0,
    margem_lucro_geral: 0,
    quantidade_vendas: 0,
    quantidade_produtos: 0,
  },
  produtos_melhor_margem: [],
  categorias_lucro: [],
  evolucao_mensal: [],
  distribuicao_margem: [],
  estoque_investimento: [],
  contas_detalhadas: [],
};

export const useRelatorios = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gerarRelatorioPorTipo = async (
    _tipo: string,
    _dataInicio?: string,
    _dataFim?: string,
  ) => {
    setLoading(true);
    setLoading(false);
    return [];
  };

  const gerarRelatorioCompleto = async (
    _dataInicio: string,
    _dataFim: string,
  ): Promise<RelatorioCompleto> => {
    setLoading(true);
    setLoading(false);
    return emptyRelatorioCompleto;
  };

  const gerarRelatorioLucroProduto = async (): Promise<
    RelatorioLucroProduto[]
  > => {
    setLoading(true);
    setLoading(false);
    return [];
  };

  const gerarRelatorioLucroCategoria = async (): Promise<
    RelatorioLucroCategoria[]
  > => {
    setLoading(true);
    setLoading(false);
    return [];
  };

  const gerarRelatorioLucroPeriodo = async (
    _dataInicio: string,
    _dataFim: string,
  ): Promise<RelatorioLucroPeriodo[]> => {
    setLoading(true);
    setLoading(false);
    return [];
  };

  const gerarRelatorioEstoqueInvestimento = async (): Promise<
    RelatorioEstoqueInvestimento[]
  > => {
    setLoading(true);
    setLoading(false);
    return [];
  };

  const exportarRelatorio = async (
    _relatorio: unknown,
    _nomeArquivo: string,
    _formato: "json" | "csv" = "json",
  ) => {
    return true;
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
