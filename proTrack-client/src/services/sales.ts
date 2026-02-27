import { api } from "./api";
import type {
  ListSalesByCompanyResponse,
  SaleRequest,
  TotalAmountSummary,
} from "@/@types/sales";

interface ListSalesResponse {
  sales: ListSalesByCompanyResponse[];
  count: number;
  percentage: number;
  total_pending: number;
  total_amount: TotalAmountSummary;
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

export async function PercentageSales(): Promise<number> {
  const response = await api.get<ListSalesResponse>("/sales/percentage");
  return response.data.percentage;
}

export async function GetTotalAmountIsPending(): Promise<number> {
  const response = await api.get<ListSalesResponse>("/sales/total-pending");
  return response.data.total_pending ?? 0;
}

export async function GetTotalAmountSummary(): Promise<TotalAmountSummary> {
  const response = await api.get<ListSalesResponse>("/sales/total-amount");
  return response.data.total_amount ?? 0;
}
