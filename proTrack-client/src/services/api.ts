import axios, { AxiosError } from "axios";
import type {
  Cliente,
  ClientesResponse,
  EstoqueResponse,
  Produto,
  TotalClientesResponse,
  TotalVendasResponse,
  VendaData,
} from "../@types/types.api";
import type { ClienteFormData } from "../@types/types.components";

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post("http://localhost:8085/login", {
    email,
    password,
  });
  return response.data;
};

export const cadastrarProduto = async (produto: Produto) => {
  try {
    const response = await axios.post(
      "http://localhost:8085/product/produtos",
      produto
    );
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;

    throw axiosError.response?.data || { error: "Erro desconhecido" };
  }
};

export const atualizarProduto = async (produto: Produto) => {
  try {
    if (!produto.id) {
      throw { error: "ID do produto é obrigatório para atualização" };
    }

    const id = produto.id;

    const response = await axios.put(
      `http://localhost:8085/product/produtos/${id}`,
      produto
    );

    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;

    throw axiosError.response?.data || { error: "Erro desconhecido" };
  }
};

export const fetchTotalEstoque = async (): Promise<EstoqueResponse> => {
  try {
    const response = await axios.get<EstoqueResponse>(
      "http://localhost:8085/product/produtos/estoque-total"
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar total em estoque:", error);
    throw error;
  }
};

export const fetchAllProdutos = async (): Promise<Produto[]> => {
  try {
    const response = await axios.get<Produto[]>(
      "http://localhost:8085/product/produtos/todos"
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
};

export const cadastrarCliente = async (cliente: Cliente) => {
  try {
    const response = await axios.post(
      "http://localhost:8085/clients/clientes",
      cliente
    );
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;

    throw axiosError.response?.data || { error: "Erro desconhecido" };
  }
};

export const fetchTotalClientes = async (): Promise<TotalClientesResponse> => {
  try {
    const response = await axios.get<TotalClientesResponse>(
      "http://localhost:8085/clients/clientes/total"
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar total de clientes:", error);
    throw error;
  }
};

export const fetchAllClientes = async (): Promise<ClientesResponse> => {
  try {
    const response = await axios.get<ClientesResponse>(
      "http://localhost:8085/clients/clientes/todos"
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar clientes cadastrados:", error);
    throw error;
  }
};

export const atualizarCliente = async (
  id: number,
  cliente: ClienteFormData
) => {
  try {
    if (!id) {
      throw { error: "ID do cliente é obrigatório para atualização" };
    }

    const response = await axios.put(
      `http://localhost:8085/clients/altera/${id}`, // rota corrigida
      cliente
    );

    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || { error: "Erro desconhecido" };
  }
};

export async function criarVenda(data: VendaData) {
  try {
    const response = await axios.post(
      "http://localhost:8085/vendas/cadvendas",
      data
    );
    return response.data;
  } catch (error) {
    // Você pode tratar o erro aqui ou repassar
    throw error;
  }
}

export const fetchTotalVendas = async (): Promise<TotalVendasResponse> => {
  try {
    const response = await axios.get<TotalVendasResponse>(
      "http://localhost:8085/vendas/totalvendas"
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar total de vendas:", error);
    throw error;
  }
};
