import { AxiosError } from "axios";
import type {
  Categoria,
  Cliente,
  ClienteFormData,
  ClientesResponse,
  DistribuicaoMargemLucroResponse,
  EstoqueResponse,
  EvolucaoLucroMensalResponse,
  FormasPagamentoResponse,
  GiroEstoqueResponse,
  MargemLucroTotalResponse,
  MetodoPagamentoConfig,
  Produto,
  ProdutosMaisVendidosResponse,
  ProdutosQuantidadeBaixaResponse,
  RelatorioCompleto,
  RelatorioEstoqueInvestimento,
  RelatorioLucroCategoria,
  RelatorioLucroPeriodo,
  RelatorioLucroProduto,
  TotalAPagarResponse,
  TotalClientesResponse,
  TotalEstoqueResponse,
  TotalVendasResponse,
  ValorInvestidoPorCategoriaResponse,
  VendaAtualizacao,
  VendaData,
  VendaResponse,
  VendasAberto,
  VendasDashboardResponse,
} from "../@types/types.api";
import { api } from "./apiClient";
import type { ProdutoMargemLucroResponse } from "../@types/types.components";

// Interceptor global de erros (opcional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const err = error as AxiosError;
    return Promise.reject(err.response?.data || { error: "Erro desconhecido" });
  }
);

export const loginUser = async (email: string, password: string) => {
  const response = await api.post("/login", { email, password });
  return response.data;
};

export const cadastrarProduto = async (produto: Produto) => {
  const response = await api.post("/product/produtos", produto);
  return response.data;
};

export const atualizarProduto = async (produto: Produto) => {
  if (!produto.id)
    throw { error: "ID do produto é obrigatório para atualização" };
  const response = await api.put(`/product/produtos/${produto.id}`, produto);
  return response.data;
};

export const fetchTotalEstoque = async (): Promise<EstoqueResponse> => {
  const response = await api.get<EstoqueResponse>(
    "/product/produtos/estoque-total"
  );
  return response.data;
};

export const fetchAllProdutos = async (): Promise<Produto[]> => {
  const response = await api.get<Produto[]>("/product/produtos/todos");
  return response.data;
};

export const cadastrarCliente = async (cliente: Cliente) => {
  const response = await api.post("/clients/clientes", cliente);
  return response.data;
};

export const fetchTotalClientes = async (): Promise<TotalClientesResponse> => {
  const response = await api.get<TotalClientesResponse>(
    "/clients/clientes/total"
  );
  return response.data;
};

export const fetchAllClientes = async (): Promise<ClientesResponse> => {
  const response = await api.get<ClientesResponse>("/clients/clientes/todos");
  return response.data;
};

export const atualizarCliente = async (
  id: number,
  cliente: ClienteFormData
) => {
  if (!id) throw { error: "ID do cliente é obrigatório para atualização" };
  const response = await api.put(`/clients/altera/${id}`, cliente);
  return response.data;
};

export async function criarVenda(data: VendaData) {
  const response = await api.post("/vendas/cadvendas", data);
  return response.data;
}

export const fetchTotalVendas = async (): Promise<TotalVendasResponse> => {
  const response = await api.get<TotalVendasResponse>("/vendas/totalvendas");
  return response.data;
};

export const fetchAllVendas = async (): Promise<VendaResponse[]> => {
  const response = await api.get<VendaResponse[]>("/vendas/todas");
  console.log("Vindo da API", response.data);
  return response.data;
};

export const atualizarVenda = async (id: number, venda: VendaAtualizacao) => {
  const response = await api.put(`/vendas/altera/${id}`, venda);
  return response.data;
};

export const fetchAllVendasById = async (
  id: number
): Promise<VendaResponse[]> => {
  const response = await api.get<VendaResponse[]>(`/clients/buscaVendas/${id}`);
  return response.data;
};

// Chamada para buscar totais
export const fetchTotalAPagar = async (): Promise<TotalAPagarResponse> => {
  const response = await api.get<TotalAPagarResponse>("/clients/totalApagar");
  return response.data;
};

// Chamada para buscar o total do estoque
export const fetchTotalValorEstoque =
  async (): Promise<TotalEstoqueResponse> => {
    const response = await api.get<TotalEstoqueResponse>("/product/totalPreco");
    return response.data;
  };

// Chamada para buscar o giro de estoque
export const fetchGiroEstoque = async (): Promise<GiroEstoqueResponse> => {
  const response = await api.get<GiroEstoqueResponse>("/product/giroEstoque");
  return response.data;
};

export const fetchVendasDashboard =
  async (): Promise<VendasDashboardResponse> => {
    const response = await api.get<VendasDashboardResponse>(
      "/vendas/resumoDeVendas"
    );
    return response.data;
  };

export const fetchProdutosMaisVendidos = async (
  limit: number = 5
): Promise<ProdutosMaisVendidosResponse> => {
  const response = await api.get<ProdutosMaisVendidosResponse>(
    `/product/maisVendidos?limit=${limit}`
  );
  return response.data;
};

export const fetchFormasPagamento =
  async (): Promise<FormasPagamentoResponse> => {
    const response = await api.get<FormasPagamentoResponse>(
      "/vendas/formasPagamentos"
    );
    return response.data;
  };

export const fetchProdutosQuantidadeBaixa =
  async (): Promise<ProdutosQuantidadeBaixaResponse> => {
    const response = await api.get<ProdutosQuantidadeBaixaResponse>(
      "/product/faltaEstoque"
    );
    return response.data;
  };

// Buscar todos os métodos
export const fetchMetodosPagamento = async (): Promise<
  MetodoPagamentoConfig[]
> => {
  const response = await api.get<MetodoPagamentoConfig[]>(
    "/config/metodos-pagamento"
  );
  return response.data;
};

export const toggleMetodoPagamentoApi = async (id: string, ativo: boolean) => {
  await api.patch(`/config/metodos-pagamento/${id}/toggle`, { ativo });
};

export const fetchMetodosPagamentoAtivos = async (): Promise<
  { nome: string; tipo: string; id: number }[]
> => {
  const response = await api.get("/config/metodos-pagamento/ativos"); // rota que retorna apenas os ativos
  return response.data;
};

// Buscar todas as categorias
export const fetchCategorias = async (): Promise<Categoria[]> => {
  const response = await api.get("/config/categorias");
  return response.data;
};

// Criar nova categoria
export const createCategoria = async (categoria: Categoria): Promise<void> => {
  await api.post("/config/categorias", categoria);
};

// Atualizar categoria existente
export const updateCategoriaApi = async (
  categoria: Categoria
): Promise<void> => {
  await api.put(`/config/categorias/${categoria.id}`, categoria);
};

// Remover categoria pelo ID
export const deleteCategoriaApi = async (id: string): Promise<void> => {
  await api.delete(`/config/categorias/${id}`);
};

export const getProdutosMelhorMargemLucro =
  async (): Promise<ProdutoMargemLucroResponse> => {
    const response = await api.get<ProdutoMargemLucroResponse>(
      "/product/melhorMargemLucro"
    );
    return response.data;
  };

export const getMargemLucroTotal =
  async (): Promise<MargemLucroTotalResponse> => {
    const response = await api.get<MargemLucroTotalResponse>(
      "/product/margemLucroTotal"
    );
    return response.data;
  };

// 🔹 Chamada para buscar evolução do lucro mensal
export const getEvolucaoLucroMensal = async (): Promise<
  EvolucaoLucroMensalResponse[]
> => {
  const response = await api.get<EvolucaoLucroMensalResponse[]>(
    "/product/evolucaoLucroMensal"
  );
  return response.data;
};

// 🔹 Chamada para buscar valor investido por categoria
export const getValorInvestidoPorCategoria =
  async (): Promise<ValorInvestidoPorCategoriaResponse> => {
    const response = await api.get<ValorInvestidoPorCategoriaResponse>(
      "/product/valorInvestidoPorCategoria"
    );
    return response.data;
  };

// 🔹 Chamada para buscar distribuição de margem de lucro
export const getDistribuicaoMargemLucro =
  async (): Promise<DistribuicaoMargemLucroResponse> => {
    const response = await api.get<DistribuicaoMargemLucroResponse>(
      "/product/distribuicaoMargemLucro"
    );
    return response.data;
  };

// 🔹 APIs para Relatórios
export const getRelatorioLucroProduto = async (): Promise<{
  relatorio: RelatorioLucroProduto[];
}> => {
  const response = await api.get<{ relatorio: RelatorioLucroProduto[] }>(
    "/relatorios/lucro-produto"
  );
  return response.data;
};

export const getRelatorioLucroCategoria = async (): Promise<{
  relatorio: RelatorioLucroCategoria[];
}> => {
  const response = await api.get<{ relatorio: RelatorioLucroCategoria[] }>(
    "/relatorios/lucro-categoria"
  );
  return response.data;
};

export const getRelatorioLucroPeriodo = async (
  dataInicio: string,
  dataFim: string
): Promise<{ relatorio: RelatorioLucroPeriodo[] }> => {
  const response = await api.get<{ relatorio: RelatorioLucroPeriodo[] }>(
    `/relatorios/lucro-periodo?dataInicio=${dataInicio}&dataFim=${dataFim}`
  );
  return response.data;
};

export const getRelatorioEstoqueInvestimento = async (): Promise<{
  relatorio: RelatorioEstoqueInvestimento[];
}> => {
  const response = await api.get<{ relatorio: RelatorioEstoqueInvestimento[] }>(
    "/relatorios/estoque-investimento"
  );
  return response.data;
};

export const getRelatorioCompleto = async (
  dataInicio: string,
  dataFim: string
): Promise<RelatorioCompleto> => {
  const response = await api.get<RelatorioCompleto>(
    `/relatorios/completo?dataInicio=${dataInicio}&dataFim=${dataFim}`
  );
  return response.data;
};

// 🔹 API genérica para relatórios
export const getRelatorioPorTipo = async (
  tipo: string,
  dataInicio?: string,
  dataFim?: string
): Promise<{ relatorio: any }> => {
  let url = `/relatorios/por-tipo?tipo=${tipo}`;

  if (dataInicio && dataFim) {
    url += `&dataInicio=${dataInicio}&dataFim=${dataFim}`;
  }

  const response = await api.get<{ relatorio: any }>(url);
  return response.data;
};

export const getQuantidadeVendasEmAberto = async (): Promise<VendasAberto> => {
  const response = await api.get("/clients/em-aberto/count");
  return response.data;
};
