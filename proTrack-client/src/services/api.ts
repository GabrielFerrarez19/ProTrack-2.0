import { AxiosError } from "axios";
import type {
  Cliente,
  ClientesResponse,
  EstoqueResponse,
  Produto,
  TotalAPagarResponse,
  TotalClientesResponse,
  TotalVendasResponse,
  VendaAtualizacao,
  VendaData,
  VendaResponse,
} from "../@types/types.api";
import type { ClienteFormData } from "../@types/types.components";
import { api } from "./apiClient";

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
