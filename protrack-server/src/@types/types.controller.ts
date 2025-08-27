// types/venda.ts
export interface ProdutoVenda {
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
  desconto?: number; // em %
}

export interface CriarVendaData {
  clienteId: number;
  dataVenda: string | Date;
  desconto?: number; // desconto da venda em %
  total: number;
  totalComDesconto: number;
  status?: string;
  produtos: ProdutoVenda[];
  formaPagamento?: string;
}

export interface VendasDashboard {
  mesAtual: number;
  mesAnterior: number;
  crescimento: number; // percentual de crescimento
}

export interface ProdutoMaisVendido {
  produto_id: number;
  nome: string;
  total_vendido: number; // soma da quantidade vendida
}

export interface FormaPagamentoCount {
  forma_pagamento: string;
  total: number;
}

export interface MetodoPagamentoConfig {
  id: string;
  nome: string;
  tipo: "dinheiro" | "cartao" | "pix" | "transferencia" | "outro";
  ativo: boolean;
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
  forma_pagamento: string;
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
