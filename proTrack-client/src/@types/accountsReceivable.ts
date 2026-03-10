export interface AccountReceivable {
  id: string;
  company_id: string;
  customer_id: string;
  sale_id: string;
  total_amount: number;
  balance: number;
  due_date: string;
  installment_number: number;
  total_installments: number;
  status: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  deleted_at: string | null;
}

