import type { CustomerRequest, CustomerResponse } from "@/@types/customers";
import { api } from "./api";
import { data } from "react-router-dom";

interface ListCustomersResponse {
  customers: CustomerResponse[];
}

export async function CreateCustomers(data: CustomerRequest): Promise<string> {
  const response = await api.post<string>("/customers", data);
  return response.data;
}

export async function ListCustomers(): Promise<CustomerResponse[]> {
  const response = await api.get<ListCustomersResponse>("/customers/list");
  return response.data.customers;
}
