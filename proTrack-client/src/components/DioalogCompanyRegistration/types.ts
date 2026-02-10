export interface CompanyData {
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
}

export const initialCompanyData: CompanyData = {
  name: "",
  trade_name: "",
  document: "",
  document_type: "CNPJ",
  email: "",
  phone: "",
  website: "",
  address_street: "",
  address_number: "",
  address_complement: "",
  address_neighborhood: "",
  address_city: "",
  address_state: "",
  address_zipcode: "",
  address_country: "Brasil",
};
