import { api } from "./api";
import type { CompanyRequest, CompanyResponse } from "@/@types/companies";

export async function CreateProduct(
  data: CompanyRequest,
): Promise<CompanyResponse> {
  const response = await api.post<CompanyResponse>("/companies", data);
  return response.data;
}
