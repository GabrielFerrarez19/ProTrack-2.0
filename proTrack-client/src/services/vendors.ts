import { api } from "./api";

export interface VendorResponse {
  id: string;
  company_id: string;
  name: string;
  tax_id: string;
  email: string;
  phone: string;
  postal_code: string;
  address_line_1: string;
  address_line_2: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ListVendorsIsActiveResponse {
  vendors_active: VendorResponse[];
}

export async function listVendorsIsActive(): Promise<VendorResponse[]> {
  const response = await api.get<ListVendorsIsActiveResponse>(
    "/vendors/list/is-active",
  );
  return response.data.vendors_active ?? [];
}
