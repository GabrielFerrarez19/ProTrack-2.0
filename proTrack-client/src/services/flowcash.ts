import type {
  CashFlowHistoryProjection,
  CashFlowMonthPeriod,
  CashFlowSummary,
  CashInFlowCategory,
  CashOutFlowCategory,
} from "@/@types/flowcash";
import { api } from "./api";

function encodeQueryParam(iso: string): string {
  return encodeURIComponent(iso);
}

/** Intervalo do mês corrente em UTC (alinhado ao exemplo da API). */
export function getCurrentMonthRange(): { startAt: string; endAt: string } {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  const startAt = `${y}-${String(m + 1).padStart(2, "0")}-01T00:00:00.000Z`;
  const end = new Date(Date.UTC(y, m + 1, 0, 23, 59, 59, 999));
  const endAt = end.toISOString();
  return { startAt, endAt };
}

export async function getCashFlowSummary(
  startAt: string,
  endAt: string,
): Promise<CashFlowSummary> {
  const response = await api.get<{ cash_flow_summary: CashFlowSummary }>(
    `/cash-flow/summary?startAt=${encodeQueryParam(startAt)}&endAt=${encodeQueryParam(endAt)}`,
  );
  return response.data.cash_flow_summary;
}

export async function getCashFlowHistoryProjections(): Promise<
  CashFlowHistoryProjection[]
> {
  const response = await api.get<{
    cash_flow_history: CashFlowHistoryProjection[];
  }>("/cash-flow/history-projection");
  return response.data.cash_flow_history;
}

export async function getCashInFlowByCategory(): Promise<CashInFlowCategory[]> {
  const response = await api.get<{
    cash_inflow_categories: CashInFlowCategory[];
  }>("/cash-flow/inflow-category");
  return response.data.cash_inflow_categories;
}

export async function getCashOutFlowByCategory(): Promise<
  CashOutFlowCategory[]
> {
  const response = await api.get<{
    cash_outflow_categories: CashOutFlowCategory[];
  }>("/cash-flow/outflow-category");
  return response.data.cash_outflow_categories;
}

export async function getCashFlowSummaryMonth(): Promise<CashFlowMonthPeriod[]> {
  const response = await api.get<{ cash_flow_month: CashFlowMonthPeriod[] }>(
    "/cash-flow/summary-month",
  );
  return response.data.cash_flow_month;
}

export async function fetchAllCashFlowData(range: {
  startAt: string;
  endAt: string;
}) {
  const [
    summary,
    history,
    inflowCategories,
    outflowCategories,
    monthPeriods,
  ] = await Promise.all([
    getCashFlowSummary(range.startAt, range.endAt),
    getCashFlowHistoryProjections(),
    getCashInFlowByCategory(),
    getCashOutFlowByCategory(),
    getCashFlowSummaryMonth(),
  ]);

  return {
    summary,
    history,
    inflowCategories,
    outflowCategories,
    monthPeriods,
  };
}
