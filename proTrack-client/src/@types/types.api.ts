import type {
  ProdutoMaisVendido,
  ProdutoMargemLucroResponse,
} from "./types.components";

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

export interface ClienteFormData {
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
  valorAPagar?: number;
}

export interface MetodoPagamentoConfig {
  id: string;
  nome: string;
  tipo: "dinheiro" | "cartao" | "pix" | "transferencia";
  ativo: boolean;
}

export interface VendaData {
  clienteId: string;
  dataVenda: string;
  desconto?: number;
  total: number;
  status: string;
  totalComDesconto: number;
  produtos: ProdutoVenda[];
  formaPagamento?: string;
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
  forma_pagamento: "dinheiro" | "cartao" | "pix" | "transferencia";
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
  desconto?: number;
}

export interface VendaAtualizacao {
  clienteId?: number;
  dataVenda?: string; // formato 'YYYY-MM-DD'
  desconto?: number;
  total?: number;
  totalComDesconto?: number;
  status?: "pendente" | "pago" | "cancelado" | "aprazo";
  formaPagamento?: "dinheiro" | "cartao" | "pix" | "transferencia"; // padronizado
  produtos?: ItemVenda[];
}

// Tipagem para o retornoexport interface TotalAPagarResponse {
export interface TotalAPagarResponse {
  total_geral: number;
}

// Define o tipo de retorno esperado
export interface TotalEstoqueResponse {
  totalEstoque: number;
}

export interface DashboardDados {
  estoque: TotalEstoqueResponse | null;
  financeiro: TotalAPagarResponse | null;
  giro?: GiroEstoqueResponse | null; // opcional
  vendas: VendasDashboardResponse | null;
  melhorMargem: ProdutoMargemLucroResponse | null;
  margemTotal: MargemLucroTotalResponse | null;
  evolucaoLucroMensal: EvolucaoLucroMensalResponse[] | null;
  valorInvestidoPorCategoria: ValorInvestidoPorCategoriaResponse | null;
  distribuicaoMargemLucro: DistribuicaoMargemLucroResponse | null;
}

export interface GiroEstoqueResponse {
  percentual: number; // ex: 68
}

export interface GiroEstoqueResponse {
  giroEstoque: number;
}

export interface VendasDashboardResponse {
  mesAtual: number;
  mesAnterior: number;
  crescimento: number;
}

export interface ProdutosMaisVendidosResponse {
  produtos: ProdutoMaisVendido[];
}

export interface FormaPagamento {
  forma_pagamento: string;
  total: number;
}

export interface FormasPagamentoResponse {
  formas: FormaPagamento[];
}

export interface ProdutosQuantidadeBaixaResponse {
  total: number;
}

// interface para a categoria
export interface Categoria {
  id: string; // UUID ou string única
  nome: string; // nome da categoria
  tipo: "receita" | "despesa"; // tipo da categoria
  cor: string; // cor em hexadecimal (#FFFFFF)
}

// response da listagem de categorias
export interface ListCategoriasResponse extends Array<Categoria> {}

// request para criar ou atualizar uma categoria
export interface CategoriaRequest {
  id: string;
  nome: string;
  tipo: "receita" | "despesa";
  cor: string;
}

// response padrão de sucesso (POST, PUT, DELETE)
export interface CategoriaResponse {
  message: string;
}

export interface ValorInvestidoPorCategoria {
  categoria: string;
  valor_investido: number;
  quantidade_produtos: number;
  percentual_total: number;
  preco_medio_custo: number;
}

export interface ValorInvestidoPorCategoriaResponse {
  categorias: ValorInvestidoPorCategoria[];
}

export interface DistribuicaoMargemLucro {
  faixa: string;
  qtd: number;
  percentual: number;
  margem_media: number;
}

export interface DistribuicaoMargemLucroResponse {
  distribuicao: DistribuicaoMargemLucro[];
  total_produtos: number;
  margem_media_geral: number;
}

export interface MargemLucroTotalResponse {
  receita_total: number;
  custo_total: number;
  lucro_total: number;
  margem_lucro_total: number; // ✅ deve existir
}

export interface EvolucaoLucroMensalResponse {
  mes: string;
  valor: number;
}

// Interfaces para Relatórios
export interface RelatorioLucroProduto {
  produto_id: number;
  nome: string;
  categoria: string;
  preco_custo: number;
  preco_venda: number;
  lucro_unitario: number;
  margem_lucro: number;
  quantidade_estoque: number;
  valor_total_estoque: number;
  lucro_total_potencial: number;
}

export interface RelatorioLucroCategoria {
  categoria: string;
  quantidade_produtos: number;
  valor_total_investido: number;
  valor_total_venda: number;
  lucro_total: number;
  margem_lucro_media: number;
  percentual_participacao: number;
}

export interface RelatorioLucroPeriodo {
  periodo: string;
  receita_total: number;
  custo_total: number;
  lucro_total: number;
  margem_lucro: number;
  quantidade_vendas: number;
  quantidade_produtos_vendidos: number;
}

export interface RelatorioEstoqueInvestimento {
  categoria: string;
  quantidade_produtos: number;
  valor_investido: number;
  valor_potencial_venda: number;
  lucro_potencial: number;
  margem_lucro_media: number;
  percentual_estoque: number;
}

export interface RelatorioCompleto {
  periodo: {
    inicio: string;
    fim: string;
  };
  resumo: {
    receita_total: number;
    custo_total: number;
    lucro_total: number;
    margem_lucro_geral: number;
    quantidade_vendas: number;
    quantidade_produtos: number;
  };
  produtos_melhor_margem: RelatorioLucroProduto[];
  categorias_lucro: RelatorioLucroCategoria[];
  evolucao_mensal: RelatorioLucroPeriodo[];
  distribuicao_margem: DistribuicaoMargemLucro[];
  estoque_investimento: RelatorioEstoqueInvestimento[];
  contas_detalhadas: any[];
}
