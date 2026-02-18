export interface CreateSaleItemRequest {
  sale_id?: string; // Opcional se for enviado antes de existir o ID
  product_id: string;
  quantity: number;
  unit_price: number;
  discount: number;
}

export interface SaleRequest {
  customer_id: string;
  company_id: string;
  discount_amount: number;
  subtotal: number;
  total_amount: number;
  created_by: string;
  items: CreateSaleItemRequest[];
}
