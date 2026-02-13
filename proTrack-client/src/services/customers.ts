import type { CustomerRequest, CustomerResponse } from "@/@types/customers";
import { api } from "./api";

interface ListCustomersResponse {
  customers: CustomerResponse[];
}

export async function CreateCustomers(data: CustomerRequest): Promise<string> {
  const response = await api.post<string>("/customers", data);
  return response.data;
}
