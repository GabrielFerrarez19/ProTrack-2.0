import { api } from "./api";

export interface CreatePaymentRequest {
  customer_id: string;
  payment_method_id: string;
  amount_paid: number;
  notes: string;
}

export async function CreatePayment(
  data: CreatePaymentRequest,
): Promise<void> {
  await api.post("/payments", data);
}
