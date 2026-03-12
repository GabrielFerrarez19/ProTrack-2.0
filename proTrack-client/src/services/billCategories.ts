import { api } from "./api";

export interface BillCategoryResponse {
  id: string;
  company_id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ListBillCategoriesResponse {
  bill_categories: BillCategoryResponse[];
}

export async function listBillCategories(): Promise<BillCategoryResponse[]> {
  const response =
    await api.get<ListBillCategoriesResponse>("/bill-categories");
  return response.data.bill_categories ?? [];
}

