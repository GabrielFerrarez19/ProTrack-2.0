export interface CompanyRequest {
  name: string;
  trade_name: string;
  document: string;
  email: string;
  phone: string;
  website: string;
  address_street: string;
  address_number: string;
  address_complement: string;
  address_neighborhood: string;
  address_city: string;
  address_state: string;
  address_zipcode: string;
  address_country: string;
}

export interface CompanyResponse {
  id: string; // uuid
  name: string;
  trade_name: string;
  document: string;
  document_type: string;
  email: string;
  phone: string;
  website: string;
  address_street: string;
  address_number: string;
  address_complement: string;
  address_neighborhood: string;
  address_city: string;
  address_state: string;
  address_zipcode: string;
  address_country: string;
  status: any;
  created_by: string; // uuid
  updated_by: string; // uuid
  deleted_by: string; // uuid
  created_at: string; // ISO date (time.Time)
  updated_at: string; // ISO date (time.Time)
  deleted_at: string; // ISO date (time.Time)
}
