import { useState, useEffect } from "react";
import {
  listarContasPagar,
  criarContaPagar,
  atualizarContaPagar,
  excluirContaPagar,
  marcarContaComoPaga,
  obterResumoContasPagar,
  listarFornecedores,
  criarFornecedor,
  atualizarFornecedor,
  excluirFornecedor,
  listarCategoriasDespesas,
  criarCategoriaDespesa,
  atualizarCategoriaDespesa,
  excluirCategoriaDespesa,
  gerarRelatorioContasPagar,
  exportarContasPagar,
  obterEstatisticasContasPagar,
  obterProjecaoPagamentos,
  obterAlertasContasPagar,
  marcarAlertaComoLido,
  obterConfiguracoesContasPagar,
  atualizarConfiguracoesContasPagar,
  buscarContasPorVencimento,
} from "../services/api";
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

  // ===== CONTAS A PAGAR =====

  const listarContas = async (filtros: ContaPagarFiltros = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await listarContasPagar(filtros);

      if (response.success) {
        setContas(response.data);
      } else {
        setError(response.message || "Erro ao listar contas");
      }
    } catch (error: any) {
      console.error("Erro ao listar contas:", error);
      setError(error.message || "Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  const criarConta = async (
    contaData: ContaPagarCreate
  ): Promise<ContaPagar | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await criarContaPagar(contaData);

      if (response.success) {
        await listarContas(); // Recarregar lista
        return response.data;
      } else {
        setError(response.message || "Erro ao criar conta");
        return null;
      }
    } catch (error: any) {
      console.error("Erro ao criar conta:", error);
      setError(error.message || "Erro ao conectar com o servidor");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const atualizarConta = async (
    id: string,
    contaData: ContaPagarUpdate
  ): Promise<ContaPagar | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await atualizarContaPagar(id, contaData);

      if (response.success) {
        await listarContas(); // Recarregar lista
        return response.data;
      } else {
        setError(response.message || "Erro ao atualizar conta");
        return null;
      }
    } catch (error: any) {
      console.error("Erro ao atualizar conta:", error);
      setError(error.message || "Erro ao conectar com o servidor");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const excluirConta = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await excluirContaPagar(id);

      if (response.success) {
        await listarContas(); // Recarregar lista
        return true;
      } else {
        setError(response.message || "Erro ao excluir conta");
        return false;
      }
    } catch (error: any) {
      console.error("Erro ao excluir conta:", error);
      setError(error.message || "Erro ao conectar com o servidor");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const marcarComoPaga = async (
    id: string,
    valorPago: number,
    formaPagamento: string
  ): Promise<ContaPagar | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await marcarContaComoPaga(id, {
        valor_pago: valorPago,
        forma_pagamento: formaPagamento,
      });

      if (response.success) {
        await listarContas(); // Recarregar lista
        await obterResumo(); // Atualizar resumo
        return response.data;
      } else {
        setError(response.message || "Erro ao marcar conta como paga");
        return null;
      }
    } catch (error: any) {
      console.error("Erro ao marcar conta como paga:", error);
      setError(error.message || "Erro ao conectar com o servidor");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const obterResumo = async () => {
    try {
      console.log("🔄 Buscando resumo...");
      const response = await obterResumoContasPagar();
      console.log("📊 Resposta da API:", response);

      if (response.success) {
        console.log("✅ Resumo obtido com sucesso:", response.data);
        setResumo(response.data);
      } else {
        console.error("❌ Erro ao obter resumo:", response.message);
        setError(response.message || "Erro ao obter resumo");
      }
    } catch (error: any) {
      console.error("❌ Erro ao obter resumo:", error);
      setError(error.message || "Erro ao conectar com o servidor");
    }
  };

  const obterContasPorVencimento = async (): Promise<{
    contasVencemHoje: ContaPagar[];
    contasProximos7Dias: ContaPagar[];
  } | null> => {
    try {
      const response = await buscarContasPorVencimento();
      return response;
    } catch (error: any) {
      console.error("Erro ao buscar contas por vencimento:", error);
      setError(error.message || "Erro ao conectar com o servidor");
      return null;
    }
  };

  // ===== FORNECEDORES =====

  const listarFornecedoresHook = async () => {
    try {
      const response = await listarFornecedores();

      if (response.success) {
        setFornecedores(response.data);
      } else {
        setError(response.message || "Erro ao listar fornecedores");
      }
    } catch (error: any) {
      console.error("Erro ao listar fornecedores:", error);
      setError(error.message || "Erro ao conectar com o servidor");
    }
  };

  const criarFornecedorHook = async (
    fornecedorData: FornecedorCreate
  ): Promise<Fornecedor | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await criarFornecedor(fornecedorData);

      if (response.success) {
        await listarFornecedoresHook(); // Recarregar lista
        return response.data;
      } else {
        setError(response.message || "Erro ao criar fornecedor");
        return null;
      }
    } catch (error: any) {
      console.error("Erro ao criar fornecedor:", error);
      setError(error.message || "Erro ao conectar com o servidor");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const atualizarFornecedorHook = async (
    id: string,
    fornecedorData: FornecedorUpdate
  ): Promise<Fornecedor | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await atualizarFornecedor(id, fornecedorData);

      if (response.success) {
        await listarFornecedoresHook(); // Recarregar lista
        return response.data;
      } else {
        setError(response.message || "Erro ao atualizar fornecedor");
        return null;
      }
    } catch (error: any) {
      console.error("Erro ao atualizar fornecedor:", error);
      setError(error.message || "Erro ao conectar com o servidor");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const excluirFornecedorHook = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await excluirFornecedor(id);

      if (response.success) {
        await listarFornecedoresHook(); // Recarregar lista
        return true;
      } else {
        setError(response.message || "Erro ao excluir fornecedor");
        return false;
      }
    } catch (error: any) {
      console.error("Erro ao excluir fornecedor:", error);
      setError(error.message || "Erro ao conectar com o servidor");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ===== CATEGORIAS =====

  const listarCategorias = async () => {
    try {
      const response = await listarCategoriasDespesas();

      if (response.success) {
        // Converter o tipo da API para o tipo do hook
        const categoriasConvertidas: Categoria[] = response.data.map(
          (cat: any) => ({
            id: cat.id,
            nome: cat.nome,
            tipo: cat.tipo,
            cor: cat.cor,
            criado_em: cat.criado_em || new Date().toISOString(),
            atualizado_em: cat.atualizado_em || new Date().toISOString(),
          })
        );
        setCategorias(categoriasConvertidas);
      } else {
        setError("Erro ao listar categorias");
      }
    } catch (error: any) {
      console.error("Erro ao listar categorias:", error);
      setError(error.message || "Erro ao conectar com o servidor");
    }
  };

  const criarCategoriaHook = async (categoriaData: {
    nome: string;
    cor: string;
  }): Promise<Categoria | null> => {
    setLoading(true);
    setError(null);

    try {
      await criarCategoriaDespesa({
        ...categoriaData,
        tipo: "despesa",
      });

      // Recarregar lista após criar
      await listarCategorias();

      // Retornar uma categoria mock para compatibilidade
      const novaCategoria: Categoria = {
        id: Date.now().toString(), // ID temporário
        nome: categoriaData.nome,
        tipo: "despesa",
        cor: categoriaData.cor,
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString(),
      };

      return novaCategoria;
    } catch (error: any) {
      console.error("Erro ao criar categoria:", error);
      setError(error.message || "Erro ao conectar com o servidor");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const atualizarCategoriaHook = async (
    id: string,
    categoriaData: { nome?: string; cor?: string }
  ): Promise<Categoria | null> => {
    setLoading(true);
    setError(null);

    try {
      await atualizarCategoriaDespesa(id, categoriaData);

      // Recarregar lista após atualizar
      await listarCategorias();

      // Retornar uma categoria mock para compatibilidade
      const categoriaAtualizada: Categoria = {
        id,
        nome: categoriaData.nome || "Categoria Atualizada",
        tipo: "despesa",
        cor: categoriaData.cor || "#000000",
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString(),
      };

      return categoriaAtualizada;
    } catch (error: any) {
      console.error("Erro ao atualizar categoria:", error);
      setError(error.message || "Erro ao conectar com o servidor");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const excluirCategoriaHook = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await excluirCategoriaDespesa(id);

      // Recarregar lista após excluir
      await listarCategorias();

      return true;
    } catch (error: any) {
      console.error("Erro ao excluir categoria:", error);
      setError(error.message || "Erro ao conectar com o servidor");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ===== RELATÓRIOS E EXPORTAÇÃO =====

  const gerarRelatorio = async (filtros?: {
    status?: string;
    categoria_id?: string;
    data_inicio?: string;
    data_fim?: string;
    formato?: "pdf" | "excel";
  }): Promise<RelatorioContasPagar | null> => {
    try {
      const response = await gerarRelatorioContasPagar(filtros);
      if (response.success) {
        return response.data;
      }
      return null;
    } catch (error: any) {
      console.error("Erro ao gerar relatório:", error);
      throw error;
    }
  };

  const exportarDados = async (
    filtros: ExportacaoFiltros
  ): Promise<boolean> => {
    try {
      const blob = await exportarContasPagar(filtros);

      // Criar link para download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `contas-pagar-${new Date().toISOString().split("T")[0]}.${
        filtros.formato
      }`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error: any) {
      console.error("Erro ao exportar dados:", error);
      throw error;
    }
  };

  // ===== ESTATÍSTICAS E PROJEÇÕES =====

  const obterEstatisticas = async (periodo?: {
    data_inicio: string;
    data_fim: string;
  }): Promise<EstatisticasContasPagar | null> => {
    try {
      const response = await obterEstatisticasContasPagar(periodo);
      if (response.success) {
        return response.data;
      }
      return null;
    } catch (error: any) {
      console.error("Erro ao obter estatísticas:", error);
      throw error;
    }
  };

  const obterProjecao = async (
    dias: number = 30
  ): Promise<ProjecaoPagamentos | null> => {
    try {
      const response = await obterProjecaoPagamentos(dias);
      if (response.success) {
        return response.data;
      }
      return null;
    } catch (error: any) {
      console.error("Erro ao obter projeção:", error);
      throw error;
    }
  };

  // ===== ALERTAS E CONFIGURAÇÕES =====

  const obterAlertas = async (): Promise<AlertaContasPagar[]> => {
    try {
      const response = await obterAlertasContasPagar();
      if (response.success) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      console.error("Erro ao obter alertas:", error);
      return [];
    }
  };

  const marcarAlertaLido = async (alertaId: string): Promise<boolean> => {
    try {
      const response = await marcarAlertaComoLido(alertaId);
      return response.success;
    } catch (error: any) {
      console.error("Erro ao marcar alerta como lido:", error);
      return false;
    }
  };

  const obterConfiguracoes =
    async (): Promise<ConfiguracoesContasPagar | null> => {
      try {
        const response = await obterConfiguracoesContasPagar();
        if (response.success) {
          return response.data;
        }
        return null;
      } catch (error: any) {
        console.error("Erro ao obter configurações:", error);
        return null;
      }
    };

  const atualizarConfiguracoes = async (
    configuracoes: Partial<ConfiguracoesContasPagar>
  ): Promise<boolean> => {
    try {
      const response = await atualizarConfiguracoesContasPagar(configuracoes);
      return response.success;
    } catch (error: any) {
      console.error("Erro ao atualizar configurações:", error);
      return false;
    }
  };

  // ===== UTILITÁRIOS =====

  const limparErro = () => {
    setError(null);
  };

  const calcularDiasAtraso = (dataVencimento: string): number => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffTime = hoje.getTime() - vencimento.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const formatarData = (data: string): string => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  // ===== EFEITOS =====

  useEffect(() => {
    listarContas();
    obterResumo();
    listarCategorias();
    listarFornecedoresHook();
  }, []);

  return {
    // Estados
    contas,
    categorias,
    fornecedores,
    resumo,
    loading,
    error,

    // Métodos de contas
    listarContas,
    criarConta,
    atualizarConta,
    excluirConta,
    marcarComoPaga,
    obterResumo,
    obterContasPorVencimento,

    // Métodos de fornecedores
    listarFornecedores: listarFornecedoresHook,
    criarFornecedor: criarFornecedorHook,
    atualizarFornecedor: atualizarFornecedorHook,
    excluirFornecedor: excluirFornecedorHook,

    // Métodos de categorias
    listarCategorias,
    criarCategoria: criarCategoriaHook,
    atualizarCategoria: atualizarCategoriaHook,
    excluirCategoria: excluirCategoriaHook,

    // Métodos de relatórios
    gerarRelatorio,
    exportarDados,

    // Métodos de estatísticas
    obterEstatisticas,
    obterProjecao,

    // Métodos de alertas e configurações
    obterAlertas,
    marcarAlertaLido,
    obterConfiguracoes,
    atualizarConfiguracoes,

    // Utilitários
    limparErro,
    calcularDiasAtraso,
    formatarMoeda,
    formatarData,
  };
};
