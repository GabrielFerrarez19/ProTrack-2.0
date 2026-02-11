import { api } from "./api";
import type { CompanyRequest, CompanyResponse } from "@/@types/companies";

export async function createCompany(
  data: CompanyRequest,
): Promise<CompanyResponse> {
  const response = await api.post<{ company: CompanyResponse }>(
    "/companies",
    data,
  );
  return response.data.company;
}
