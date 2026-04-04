export interface CashFlowSummary {
  total_inflow: number;
  total_outflow: number;
  net_balance: number;
}

export interface CashFlowHistoryProjection {
  date: string;
  total_inflow: number;
  total_outflow: number;
  accumulated_balance: number;
}

export interface CashInFlowCategory {
  name_category: string;
  total_inflow: number;
  percentage_in_flow: number;
}

export interface CashOutFlowCategory {
  name_category: string;
  total_outflow: number;
  percentage_in_flow: number;
}

/** Backend usa json "mount" (typo no domínio Go). */
export interface CashFlowMonthPeriod {
  mount: string;
  total_inflow: number;
  total_outflow: number;
}
