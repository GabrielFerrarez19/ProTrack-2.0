export interface PaymentMethodResponse {
  id: string;
  company_id: string;
  name: string;
  type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethodStats {
  payment_method: string;
  percentage_method: number;
}
