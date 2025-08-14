// types/venda.ts
export interface ProdutoItem {
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
  desconto?: number;
}

export interface CriarVendaData {
  clienteId: number;
  dataVenda: string;
  desconto?: number;
  total: number;
  totalComDesconto: number;
  status?: string;
  produtos: ProdutoItem[];
}
