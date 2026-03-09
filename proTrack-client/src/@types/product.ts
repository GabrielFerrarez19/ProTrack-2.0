export interface ProductRequest {
  name: string;
  description: string;
  category_id: string;
  barcode: string;
  quantity: number;
  size: string;
  cost_price: number;
  sale_price: number;
}

export interface ProductResponse {
  id: string;
  company_id: string;
  category_id: string;
  name: string;
  description: string;
  barcode: string;
  quantity: number;
  size: string;
  cost_price: number;
  sale_price: number;
  created_by: string;
  updated_by: string;
  deleted_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  category_name: string;
}

export interface Top5Products {
  id: string;
  name: string;
  total_quantity_sold: number;
}
