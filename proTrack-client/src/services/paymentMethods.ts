import type {
  PaymentMethodResponse,
  PaymentMethodStats,
} from "@/@types/paymentMethods";
import { api } from "./api";

interface PaymentMethodsResponse {
  payment_methods: PaymentMethodResponse[];
  payment_methods_status: PaymentMethodStats[];
}

export async function ListPaymentMethodsIsActive(): Promise<
  PaymentMethodResponse[]
> {
  const response = await api.get<PaymentMethodsResponse>(
    "/payment-methods/is-active",
  );

  return response.data.payment_methods ?? [];
}

export async function GetPaymentMethodsStats(): Promise<PaymentMethodStats[]> {
  const response = await api.get<PaymentMethodsResponse>(
    "/payment-methods/stats",
  );

  return response.data.payment_methods_status ?? [];
}

// paymentMethods.ts
export async function GetPaymentMethods(
  signal?: AbortSignal,
): Promise<PaymentMethodResponse[]> {
  const response = await api.get<PaymentMethodsResponse>("/payment-methods", {
    signal,
  });
  return response.data.payment_methods ?? [];
}
