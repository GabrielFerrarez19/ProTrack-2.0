import { api } from "./api";
import { ListPaymentMethodsIsActive } from "./paymentMethods";

export interface BillPayableApi {
  id: string;
  company_id: string;
  vendor_id: string | null;
  category_id: string;
  payment_method_id: string | null;
  amount: number;
  due_date: string;
  status: string;
  description: string;
  scheduled_date?: string | null;
  payment_date?: string | null;
  amount_paid?: number | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  // Campos extras disponíveis no SELECT de listagem
  vendor_name?: string | null;
  category_name?: string | null;
  payment_method_name?: string | null;
}

interface ListBillsPayableResponse {
  bills_payable: BillPayableApi[];
}

interface BillsSummaryApi {
  total_quantity: number;
  total_to_pay: number;
  total_overdue: number;
  total_scheduled: number;
  general_status: string;
}

interface BillsSummaryResponse {
  bills_summary: BillsSummaryApi;
}

export async function listBillsPayable(): Promise<BillPayableApi[]> {
  const response = await api.get<ListBillsPayableResponse>("/bills_payable/list");
  return response.data.bills_payable ?? [];
}

export async function listOverdueBills(): Promise<BillPayableApi[]> {
  const response =
    await api.get<ListBillsPayableResponse>("/bills_payable/overdue");
  return response.data.bills_payable ?? [];
}

export async function getBillsSummary(): Promise<BillsSummaryApi> {
  const response =
    await api.get<BillsSummaryResponse>("/bills_payable/summary");
  return response.data.bills_summary;
}

export async function payBill(
  id: string,
  amountPaid: number,
  paymentMethodName: string,
): Promise<void> {
  const methods = await ListPaymentMethodsIsActive();

  const method = methods.find(
    (m) => m.name.toLowerCase() === paymentMethodName.toLowerCase(),
  );

  if (!method) {
    throw new Error(
      "Forma de pagamento não encontrada entre os métodos cadastrados.",
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  await api.put(`/bills_payable/pay/${id}`, {
    payment_date: today,
    amount_paid: amountPaid,
    payment_method_id: method.id,
  });
}

export async function scheduleBill(
  id: string,
  scheduledDate: string,
): Promise<void> {
  await api.put(`/bills_payable/schedule/${id}`, {
    scheduled_date: scheduledDate,
  });
}

export interface CreateBillPayablePayload {
  vendor_id?: string;
  category_id: string;
  payment_method_id: string;
  amount: number;
  due_date: string;
  status: string;
  description: string;
  notes: string;
}

export async function createBillPayable(
  payload: CreateBillPayablePayload,
): Promise<void> {
  await api.post("/bills_payable", payload);
}


