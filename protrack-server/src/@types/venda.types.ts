// ===== TIPOS PARA VENDAS =====

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
  diasVencimento?: number; // somente se formaPagamento === "aprazo"
}

export interface VendaResponse {
  id: number;
  cliente_id: number;
  cliente_nome: string;
  data_venda: string; // formato YYYY-MM-DD vindo do MySQL
  data_vencimento?: string | null;
  desconto: number;
  total: number;
  total_com_desconto: number;
  status: "pendente" | "pago" | "cancelado"; // novo campo
  forma_pagamento: string;
  dias_vencimento?: number | null;
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

export interface VendaAtualizacao {
  clienteId?: number;
  dataVenda?: string; // formato 'YYYY-MM-DD'
  desconto?: number;
  total?: number;
  totalComDesconto?: number;
  status?: "pendente" | "pago" | "cancelado" | "aprazo";
  formaPagamento?: "dinheiro" | "cartao" | "pix" | "transferencia" | "aprazo";
  diasVencimento?: number;
  produtos?: ProdutoVenda[];
}

export interface TotalVendasResponse {
  totalVendas: number;
}

export interface VendasResponse {
  success: boolean;
  vendas: VendaResponse[];
  total: number;
}

export interface VendasVencidasResponse {
  vendas: VendaResponse[];
}

export interface TotalVendasVencidasResponse {
  totalVendasVencidas: number;
}

export interface VendasAberto {
  totalClientesEmAberto: number;
}
