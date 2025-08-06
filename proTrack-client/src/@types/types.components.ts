export interface TypeInput {
  TextLabel: string;
  type: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface TypeButton {
  Text: string;
  type: "submit" | "button" | "reset";
  onClick?: () => void;
}

export interface TypeHeader {
  text: string;
  title: string;
}

export interface ProductFormData {
  nome: string;
  descricao: string;
  categoria: string;
  codigoBarras: string;
  quantidade: number;
  tamanho: string;
  precoCusto: number;
  precoVenda: number;
}

export interface ClienteFormData {
  nome: string;
  dataNascimento: string;
  cpf: string;
  rg?: string;
  estadoCivil?: string;
  sexo?: string;
  telefoneWhatsapp?: string;
  telefoneCelular?: string;
  telefoneResidencial?: string;
  email: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
}
