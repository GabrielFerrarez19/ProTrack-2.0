import { api } from "./api";
import type {
  ListSalesByCompanyResponse,
  SaleRequest,
  SaleWithDetails,
  TotalAmountSummary,
} from "@/@types/sales";

interface ListSalesResponse {
  sales: ListSalesByCompanyResponse[];
  count: number;
  percentage: number;
  total_open: number;
  total_overdue: number;
  total_amount: TotalAmountSummary;
}

export async function CreateSale(data: SaleRequest): Promise<string> {
  const response = await api.post<{ id: string }>("/sales", data);
  return response.data.id;
}

export async function ListSales(): Promise<ListSalesByCompanyResponse[]> {
  const response = await api.get<ListSalesResponse>("/sales/list/company");
  return response.data.sales;
}

export async function ListSalesWithDetails(): Promise<SaleWithDetails[]> {
  const response = await api.get<{ sales_completed: SaleWithDetails[] }>(
    "/sales/complete",
  );
  return response.data.sales_completed ?? [];
}

export async function ListSalesWithDetailsPendingOverdue(): Promise<
  SaleWithDetails[]
> {
  const response = await api.get<{ sales_completed: SaleWithDetails[] }>(
    "/sales/complete/pending-overdue",
  );
  return response.data.sales_completed ?? [];
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

export async function CountSalesPendingOverdue(): Promise<number> {
  const response = await api.get<{ cont_sales: number }>(
    "/sales/count/pending-overdue",
  );
  return response.data.cont_sales ?? 0;
}

export async function PercentageSales(): Promise<number> {
  const response = await api.get<ListSalesResponse>("/sales/percentage");
  return response.data.percentage;
}

export async function GetTotalAmountIsPending(): Promise<number> {
  const response = await api.get<ListSalesResponse>(
    "/accounts-receivable/total-pending",
  );
  return response.data.total_open ?? 0;
}

export async function GetTotalAmountSummary(): Promise<TotalAmountSummary> {
  const response = await api.get<ListSalesResponse>("/sales/total-amount");
  return response.data.total_amount ?? 0;
}

export async function GetTotalOverdue(): Promise<number> {
  const response = await api.get<ListSalesResponse>(
    "/accounts-receivable/total-overdue",
  );
  return response.data.total_overdue ?? 0;
}

export interface TotalPendingAndOverdueResponse {
  totals: {
    total_pending: number;
    total_overdue: number;
  };
}

export async function GetTotalPendingAndOverdue(): Promise<{
  total_pending: number;
  total_overdue: number;
}> {
  const response = await api.get<TotalPendingAndOverdueResponse>(
    "/accounts-receivable/total-pending-overdue",
  );
  const totals = response.data.totals;
  return {
    total_pending: totals?.total_pending ?? 0,
    total_overdue: totals?.total_overdue ?? 0,
  };
}
