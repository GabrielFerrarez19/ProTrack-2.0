export interface ProductCategoryRequest {
  company_id: string;
  name: string;
  color: string;
  created_by: string;
}

export interface ProductCategoryResponse {
  id: string;
  company_id: string;
  name: string;
  color: string;
  status: string;
  created_by: string;
  updated_by: string | null;
  deleted_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
