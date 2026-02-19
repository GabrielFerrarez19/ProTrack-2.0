import { api } from "./api";
import type { ListSalesByCompanyResponse, SaleRequest } from "@/@types/sales";

interface ListSalesResponse {
  sales: ListSalesByCompanyResponse[];
  count: number;
}

export async function CreateSale(data: SaleRequest): Promise<string> {
  const response = await api.post<string>("/sales", data);
  return response.data;
}

export async function ListSales(): Promise<ListSalesByCompanyResponse[]> {
  const response = await api.get<ListSalesResponse>("/sales/list/company");
  return response.data.sales;
}

export async function UpdateSaleStatus(
  saleId: string,
  status: string,
): Promise<void> {
  await api.put(`/sales/status/${saleId}`, { status });
}

export async function CountSales(): Promise<number> {
  const response = await api.get<ListSalesResponse>("/sales/count");
  return response.data.count;
}
