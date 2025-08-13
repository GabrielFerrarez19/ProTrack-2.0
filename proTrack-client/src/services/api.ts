import axios, { AxiosError } from "axios";
import type {
  Cliente,
  ClientesResponse,
  EstoqueResponse,
  Produto,
  TotalClientesResponse,
  TotalVendasResponse,
  VendaData,
  VendaResponse,
} from "../@types/types.api";
import type { ClienteFormData } from "../@types/types.components";

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(
    "https://pro-track-2-0-r1ug.vercel.app/login",
    {
      email,
      password,
    }
  );
  return response.data;
};

export const cadastrarProduto = async (produto: Produto) => {
  try {
    const response = await axios.post(
      "https://pro-track-2-0-r1ug.vercel.app/product/produtos",
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
      `https://pro-track-2-0-r1ug.vercel.app/product/produtos/${id}`,
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
      "https://pro-track-2-0-r1ug.vercel.app/product/produtos/estoque-total"
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
      "https://pro-track-2-0-r1ug.vercel.app/product/produtos/todos"
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
      "https://pro-track-2-0-r1ug.vercel.app/clients/clientes",
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
      "https://pro-track-2-0-r1ug.vercel.app/clients/clientes/total"
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
      "https://pro-track-2-0-r1ug.vercel.app/clients/clientes/todos"
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
      `https://pro-track-2-0-r1ug.vercel.app/clients/altera/${id}`, // rota corrigida
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
      "https://pro-track-2-0-r1ug.vercel.app/vendas/cadvendas",
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

export const fetchAllVendas = async (): Promise<VendaResponse[]> => {
  try {
    const response = await axios.get<VendaResponse[]>(
      "http://localhost:8085/vendas/todas"
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar vendas cadastradas:", error);
    throw error;
  }
};

// Tipagem dos itens da venda
interface ItemVenda {
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
  desconto?: number; // opcional, padrão 0
}

// Tipagem do corpo da venda
interface VendaAtualizacao {
  clienteId?: number;
  dataVenda?: string; // formato 'YYYY-MM-DD'
  desconto?: number;
  total?: number;
  totalComDesconto?: number;
  produtos?: ItemVenda[];
}

export const atualizarVenda = async (id: number, venda: VendaAtualizacao) => {
  try {
    const response = await axios.put(
      `http://localhost:8085/vendas/altera/${id}`,
      venda
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Erro ao atualizar venda:",
      error.response?.data || error.message
    );
    throw error;
  }
};
