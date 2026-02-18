import { api } from "./api";
import type { SaleRequest } from "@/@types/sales";

export async function CreateSale(data: SaleRequest): Promise<string> {
  const response = await api.post<string>("/sales", data);
  return response.data;
}
