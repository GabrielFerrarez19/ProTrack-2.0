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
