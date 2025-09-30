// ===== TIPOS PARA PRODUTOS =====

export interface Product {
  id: number;
  nome: string;
  descricao?: string;
  categoria?: string;
  codigo_barras?: string;
  quantidade?: number;
  tamanho?: string;
  preco_custo: number;
  preco_venda: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface ProdutoData {
  nome: string;
  descricao?: string;
  categoria?: string;
  codigo_barras?: string;
  quantidade?: number;
  tamanho?: string;
  preco_custo: number;
  preco_venda: number;
}

export interface CreateProductData {
  nome: string;
  descricao?: string;
  categoria?: string;
  codigo_barras?: string;
  quantidade?: number;
  tamanho?: string;
  preco_custo: number;
  preco_venda: number;
}

export interface UpdateProductData {
  nome?: string;
  descricao?: string;
  categoria?: string;
  codigo_barras?: string;
  quantidade?: number;
  tamanho?: string;
  preco_custo?: number;
  preco_venda?: number;
}

export interface ProductResponse {
  success: boolean;
  product: Product;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
  total: number;
}

export interface EstoqueResponse {
  totalEstoque: number;
}

export interface ProdutoMargemLucro {
  id: number;
  nome: string;
  categoria?: string;
  preco_custo: number;
  preco_venda: number;
  margem_lucro: number;
  lucro_unitario: number;
}

export interface MargemLucroTotal {
  margem_lucro_total: number;
  lucro_total: number;
  receita_total: number;
  custo_total: number;
}

export interface ValorInvestidoPorCategoria {
  categoria: string;
  valor_investido: number;
  quantidade_produtos: number;
  percentual_total: number;
  preco_medio_custo: number;
}
