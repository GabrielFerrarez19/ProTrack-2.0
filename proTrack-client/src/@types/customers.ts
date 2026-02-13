export interface CustomerRequest {
  company_id: string; // UUID da empresa
  full_name: string;
  birth_date: string; // Formato YYYY-MM-DD
  cpf: string;
  rg: string;
  marital_status: string;
  gender: Gender; // 'MALE' | 'FEMALE' | 'OTHER' | 'NOT_SAY'
  whatsapp: string;
  mobile_phone: string;
  home_phone: string;
  email: string;
  address_street: string;
  address_number: string;
  address_complement: string;
  address_neighborhood: string;
  address_city: string;
  address_state: string;
  address_zipcode: string;
  address_country: string;
  balance_due: number;
  created_by: string; // UUID do usuário logado que está criando
}

export interface CustomerResponse {
  id: string; // uuid.UUID
  company_id: string;
  full_name: string;
  birth_date: string; // ISO Date string
  cpf: string;
  rg: string;
  marital_status: string;
  gender: Gender; // Usando o Type que criamos abaixo
  whatsapp: string;
  mobile_phone: string;
  home_phone: string;
  email: string;
  address_street: string;
  address_number: string;
  address_complement: string;
  address_neighborhood: string;
  address_city: string;
  address_state: string;
  address_zipcode: string;
  address_country: string;
  balance_due: number; // float64 -> number
  created_by: string;
  updated_by: string;
  deleted_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Alinhado com o seu pacote enums em Go
export type Gender = "MALE" | "FEMALE" | "OTHER" | "NOT_SAY";
