import axios from "axios";
import type { EstoqueResponse, Produto } from "../@types/types.api";

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
  } catch (error: any) {
    throw error.response?.data || { error: "Erro desconhecido" };
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
