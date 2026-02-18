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
  due_days?: number;
  payment_method?: string;
  created_by: string;
  items: CreateSaleItemRequest[];
}

export interface ListSalesByCompanyResponse {
  sale_id: string;
  total_amount: number;
  discount_amount: number;
  status: string | any;
  sale_date: string | Date;
  item_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  discount: number;
  product_name: string;
  customer_name: string;
}

export interface VendaAgrupada {
  sale_id: string;
  total_amount: number;
  discount_amount: number;
  status: string;
  sale_date: string | Date;
  customer_name: string;
  itens: {
    item_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    discount: number;
    product_name: string;
  }[];
}
