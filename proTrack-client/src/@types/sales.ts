export interface CreateSaleItemRequest {
  product_id: string;
  quantity: number;
  unit_price: number;
  discount: number;
}

export interface SaleRequest {
  customer_id: string;
  discount_amount: number;
  subtotal: number;
  total_amount: number;
  due_days?: number;
  payment_method?: string;
  installments_count?: number;
  status?: string;
  prohibited?: number;
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

export interface TotalAmountSummary {
  current_month_st: number;
  last_month_st: number;
}

// Resposta da rota GET /sales/complete (ListSalesWithDetails)
export interface ListSaleResponse {
  sale_id: string;
  sale_at: string;
  subtotal: number;
  discount_amount: number;
  total_amount: number;
  installments_count: number;
  payment_method: string;
  sale_status: string;
  customer_id: string;
  customer_name: string;
  installment_total_amount: number;
}

export interface ListProductResponse {
  sale_item_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  item_discount: number;
  product_name: string;
}

export interface ListInstallmentResponse {
  installment_id: string;
  installment_balance: number;
  due_date: string;
  installment_number: number;
  installment_status: string;
}

export interface SaleWithDetails {
  sale: ListSaleResponse;
  products: ListProductResponse[];
  installment: ListInstallmentResponse[];
}
