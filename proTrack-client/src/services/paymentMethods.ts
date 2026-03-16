import { api } from "./api";

export interface PaymentMethodResponse {
  id: string;
  company_id: string;
  name: string;
  type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ListPaymentMethodsResponse {
  payment_methods: PaymentMethodResponse[];
}

export async function ListPaymentMethodsIsActive(): Promise<
  PaymentMethodResponse[]
> {
  const response =
    await api.get<ListPaymentMethodsResponse>("/payment-methods/is-active");
  return response.data.payment_methods ?? [];
}

export interface PaymentMethodStats {
  payment_method: string;
  percentage_method: number;
}

interface GetPaymentMethodsStatsResponse {
  payment_method_stats: PaymentMethodStats[];
}

export async function GetPaymentMethodsStats(): Promise<PaymentMethodStats[]> {
  const response = await api.get<GetPaymentMethodsStatsResponse>(
    "/payment-methods/stats"
  );

  return response.data.payment_method_stats ?? [];
}
