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
