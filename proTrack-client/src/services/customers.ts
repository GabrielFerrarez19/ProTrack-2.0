import type { CustomerRequest, CustomerResponse } from "@/@types/customers";
import { api } from "./api";
import { data } from "react-router-dom";

interface ListCustomersResponse {
  customers: CustomerResponse[];
  count: number;
  percentage: number;
}

export async function CreateCustomers(data: CustomerRequest): Promise<string> {
  const response = await api.post<string>("/customers", data);
  return response.data;
}

export async function ListCustomers(): Promise<CustomerResponse[]> {
  const response = await api.get<ListCustomersResponse>("/customers/list");
  return response.data.customers;
}

export async function CountCustomers(): Promise<number> {
  const response = await api.get<ListCustomersResponse>("/customers/count");
  return response.data.count;
}

export async function PercentageCustomers(): Promise<number> {
  const response = await api.get<ListCustomersResponse>(
    "/customers/percentage",
  );
  return response.data.percentage;
}
