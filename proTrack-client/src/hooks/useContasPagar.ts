import { useState, useCallback } from "react";
import type {
  ContaPagar,
  ContaPagarCreate,
  ContaPagarUpdate,
  ContaPagarFiltros,
  ContaPagarResumo,
  Categoria,
  Fornecedor,
  FornecedorCreate,
  FornecedorUpdate,
  RelatorioContasPagar,
  EstatisticasContasPagar,
  ProjecaoPagamentos,
  AlertaContasPagar,
  ConfiguracoesContasPagar,
  ExportacaoFiltros,
} from "../@types/types.contasPagar";

export const useContasPagar = () => {
  const [contas, setContas] = useState<ContaPagar[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [resumo, setResumo] = useState<ContaPagarResumo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listarContas = useCallback(async (_filtros: ContaPagarFiltros = {}) => {
    setLoading(true);
    setContas([]);
    setLoading(false);
  }, []);

  const criarConta = useCallback(
    async (_contaData: ContaPagarCreate): Promise<ContaPagar | null> => {
      setLoading(true);
      setLoading(false);
      return null;
    },
    [],
  );

  const atualizarConta = useCallback(
    async (
      _id: string,
      _contaData: ContaPagarUpdate,
    ): Promise<ContaPagar | null> => {
      setLoading(true);
      setLoading(false);
      return null;
    },
    [],
  );

  const excluirConta = useCallback(async (_id: string): Promise<boolean> => {
    setLoading(true);
    setLoading(false);
    return false;
  }, []);

  const marcarComoPaga = useCallback(
    async (
      _id: string,
      _valorPago: number,
      _formaPagamento: string,
    ): Promise<ContaPagar | null> => {
      setLoading(true);
      setLoading(false);
      return null;
    },
    [],
  );

  const obterResumo = useCallback(async () => {
    setResumo(null);
  }, []);

  const obterContasPorVencimento = useCallback(async (): Promise<{
    contasVencemHoje: ContaPagar[];
    contasProximos7Dias: ContaPagar[];
  } | null> => {
    return { contasVencemHoje: [], contasProximos7Dias: [] };
  }, []);

  const listarFornecedoresHook = useCallback(async () => {
    setFornecedores([]);
  }, []);

  const criarFornecedorHook = useCallback(
    async (_fornecedorData: FornecedorCreate): Promise<Fornecedor | null> => {
      setLoading(true);
      setLoading(false);
      return null;
    },
    [],
  );

  const atualizarFornecedorHook = useCallback(
    async (
      _id: string,
      _fornecedorData: FornecedorUpdate,
    ): Promise<Fornecedor | null> => {
      setLoading(true);
      setLoading(false);
      return null;
    },
    [],
  );

  const excluirFornecedorHook = useCallback(
    async (_id: string): Promise<boolean> => {
      setLoading(true);
      setLoading(false);
      return false;
    },
    [],
  );

  const listarCategorias = useCallback(async () => {
    setCategorias([]);
  }, []);

  const criarCategoriaHook = useCallback(
    async (_categoriaData: {
      nome: string;
      cor: string;
    }): Promise<Categoria | null> => {
      setLoading(true);
      setLoading(false);
      return null;
    },
    [],
  );

  const atualizarCategoriaHook = useCallback(
    async (
      _id: string,
      _categoriaData: { nome?: string; cor?: string },
    ): Promise<Categoria | null> => {
      setLoading(true);
      setLoading(false);
      return null;
    },
    [],
  );

  const excluirCategoriaHook = useCallback(
    async (_id: string): Promise<boolean> => {
      setLoading(true);
      setLoading(false);
      return false;
    },
    [],
  );

  const gerarRelatorio = useCallback(
    async (_filtros?: {
      status?: string;
      categoria_id?: string;
      data_inicio?: string;
      data_fim?: string;
      formato?: "pdf" | "excel";
    }): Promise<RelatorioContasPagar | null> => null,
    [],
  );

  const exportarDados = useCallback(
    async (_filtros: ExportacaoFiltros): Promise<boolean> => false,
    [],
  );

  const obterEstatisticas = useCallback(
    async (_periodo?: {
      data_inicio: string;
      data_fim: string;
    }): Promise<EstatisticasContasPagar | null> => null,
    [],
  );

  const obterProjecao = useCallback(
    async (_dias?: number): Promise<ProjecaoPagamentos | null> => null,
    [],
  );

  const obterAlertas = useCallback(
    async (): Promise<AlertaContasPagar[]> => [],
    [],
  );

  const marcarAlertaLido = useCallback(
    async (_alertaId: string): Promise<boolean> => false,
    [],
  );

  const obterConfiguracoes = useCallback(
    async (): Promise<ConfiguracoesContasPagar | null> => null,
    [],
  );

  const atualizarConfiguracoes = useCallback(
    async (
      _configuracoes: Partial<ConfiguracoesContasPagar>,
    ): Promise<boolean> => false,
    [],
  );

  const limparErro = useCallback(() => setError(null), []);

  const calcularDiasAtraso = useCallback((dataVencimento: string): number => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffTime = hoje.getTime() - vencimento.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }, []);

  const formatarMoeda = useCallback((valor: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  }, []);

  const formatarData = useCallback((data: string): string => {
    return new Date(data).toLocaleDateString("pt-BR");
  }, []);

  return {
    contas,
    categorias,
    fornecedores,
    resumo,
    loading,
    error,
    listarContas,
    criarConta,
    atualizarConta,
    excluirConta,
    marcarComoPaga,
    obterResumo,
    obterContasPorVencimento,
    listarFornecedores: listarFornecedoresHook,
    criarFornecedor: criarFornecedorHook,
    atualizarFornecedor: atualizarFornecedorHook,
    excluirFornecedor: excluirFornecedorHook,
    listarCategorias,
    criarCategoria: criarCategoriaHook,
    atualizarCategoria: atualizarCategoriaHook,
    excluirCategoria: excluirCategoriaHook,
    gerarRelatorio,
    exportarDados,
    obterEstatisticas,
    obterProjecao,
    obterAlertas,
    marcarAlertaLido,
    obterConfiguracoes,
    atualizarConfiguracoes,
    limparErro,
    calcularDiasAtraso,
    formatarMoeda,
    formatarData,
  };
};
