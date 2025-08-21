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
  status: string;
  totalComDesconto: number;
  produtos: ProdutoVenda[];
}

export interface TotalVendasResponse {
  totalVendas: number;
}

export interface VendaResponse {
  id: number;
  cliente_id: number;
  cliente_nome: string;
  data_venda: string; // formato YYYY-MM-DD vindo do MySQL
  desconto: number;
  total: number;
  total_com_desconto: number;
  status: "pendente" | "pago" | "cancelado"; // novo campo
  data_cadastro: string; // formato DATETIME vindo do MySQL
  itens: {
    id: number;
    venda_id: number;
    produto_id: number;
    produto_nome: string;
    quantidade: number;
    preco_unitario: number;
    desconto: number;
  }[];
}

// Tipagem dos itens da venda
export interface ItemVenda {
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
  desconto?: number; // opcional, padrão 0
}

// Tipagem do corpo da venda (atualização)
export interface VendaAtualizacao {
  clienteId?: number;
  dataVenda?: string; // formato 'YYYY-MM-DD'
  desconto?: number;
  total?: number;
  totalComDesconto?: number;
  status?: "pendente" | "pago" | "cancelado" | "aprazo"; // novo campo
  produtos?: ItemVenda[];
}

// Tipagem para o retornoexport interface TotalAPagarResponse {
export interface TotalAPagarResponse {
  total_geral: number;
}
