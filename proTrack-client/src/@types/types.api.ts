export interface Produto {
  id?: number;
  nome: string;
  descricao?: string;
  categoria?: string;
  codigo_barras?: string;
  quantidade?: number;
  tamanho?: string;
  preco_custo: number;
  preco_venda: number;
}

export type EstoqueResponse = {
  totalEstoque: number;
};

export interface Cliente {
  id: number;
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

export interface TotalClientesResponse {
  totalClientes: number;
}

export interface ProdutoTodos {
  id: number;
  nome: string;
  codigoBarras: string;
  categoria: string;
  tamanho: string;
  preco: number;
  quantidade: number;
}

export interface ClientesResponse {
  clientes: Cliente[];
}

export interface ProdutoVenda {
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  desconto?: number;
}

export interface VendaData {
  clienteId: string;
  dataVenda: string;
  desconto: number;
  total: number;
  totalComDesconto: number;
  produtos: ProdutoVenda[];
}
