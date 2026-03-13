import { api } from "./api";
import type { AccountReceivable } from "@/@types/accountsReceivable";

interface AccountsReceivableResponse {
  accounts_receivable: AccountReceivable[];
}

export async function GetPendingReceivablesByCustomer(
  customerId: string,
): Promise<AccountReceivable[]> {
  const response =
    await api.get<AccountsReceivableResponse>(`/accounts-receivable/customer/${customerId}`);
  return response.data.accounts_receivable ?? [];
}

export async function GetReceivablesBySale(
  saleId: string,
): Promise<AccountReceivable[]> {
  const response =
    await api.get<AccountsReceivableResponse>(`/accounts-receivable/sale/${saleId}`);
  return response.data.accounts_receivable ?? [];
}

