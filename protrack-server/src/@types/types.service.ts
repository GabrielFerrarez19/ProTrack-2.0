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
  diasVencimento?: number; // somente se formaPagamento === "aprazo"
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

export interface RelatorioContasDetalhadas {
  id: number;
  data: string;
  descricao: string;
  categoria: string;
  tipo: "receita" | "despesa";
  valor: number;
  status: string;
  forma_pagamento: string;
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
  contas_detalhadas: RelatorioContasDetalhadas[];
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

export interface EvolucaoLucroMensal {
  mes: string;
  ano: number;
  lucro_mensal: number;
  receita_mensal: number;
  custo_mensal: number;
  margem_lucro_mensal: number;
  quantidade_vendas: number;
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

export interface ValorInvestidoPorCategoria {
  categoria: string;
  valor_investido: number;
  quantidade_produtos: number;
  percentual_total: number;
  preco_medio_custo: number;
}

// Tipos para Fluxo de Caixa
export interface MovimentacaoFinanceira {
  id: number;
  tipo: "entrada" | "saida";
  categoria_id: string;
  descricao: string;
  valor: number;
  data_movimentacao: Date;
  data_vencimento?: Date;
  status: "pendente" | "pago" | "cancelado" | "vencido";
  forma_pagamento: "dinheiro" | "cartao" | "pix" | "transferencia" | "aprazo";
  venda_id?: number;
  cliente_id?: number;
  fornecedor_id?: number;
  observacoes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Fornecedor {
  id: number;
  nome: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  ativo: boolean;
  created_at: Date;
}

export interface ContaBancaria {
  id: number;
  nome: string;
  banco?: string;
  agencia?: string;
  conta?: string;
  saldo_inicial: number;
  ativo: boolean;
  created_at: Date;
}

export interface FluxoCaixaPeriodo {
  data: string;
  entradas: number;
  saidas: number;
  saldo: number;
  tipo?: "historico" | "projecao";
}

export interface CategoriaFluxoCaixa {
  categoria: string;
  valor: number;
  percentual: number;
}

export interface ComparativoPeriodos {
  periodo: string;
  entradas: number;
  saidas: number;
  saldo: number;
}

export interface ResumoFluxoCaixa {
  saldo_atual: number;
  total_entradas_periodo: number;
  total_saidas_periodo: number;
  saldo_periodo: number;
  projecao_30_dias: number;
}

export interface FiltrosFluxoCaixa {
  periodo: "7dias" | "30dias" | "90dias" | "1ano";
  tipo_visualizacao: "diario" | "semanal" | "mensal";
  data_inicio?: Date;
  data_fim?: Date;
  categoria_id?: string;
  tipo_movimentacao?: "entrada" | "saida";
}

export interface ContaPagarCreateRequest {
  fornecedor_id?: string;
  fornecedor_nome: string;
  valor: number;
  data_vencimento: string;
  categoria_id: string;
  descricao: string;
  data_agendamento?: string;
  forma_pagamento?: string;
  observacoes?: string;
}

export interface ContaPagarUpdateRequest {
  fornecedor_id?: string;
  fornecedor_nome?: string;
  valor?: number;
  data_vencimento?: string;
  categoria_id?: string;
  descricao?: string;
  data_agendamento?: string;
  forma_pagamento?: string;
  observacoes?: string;
}

export interface ContaPagarResponse {
  id: string;
  fornecedor_id?: string;
  fornecedor_nome: string;
  valor: number;
  data_vencimento: string;
  status: "pendente" | "pago" | "vencido" | "agendado";
  categoria_id: string;
  categoria_nome: string;
  descricao: string;
  data_agendamento?: string;
  data_pagamento?: string;
  valor_pago?: number;
  forma_pagamento?: string;
  observacoes?: string;
  dias_atraso: number;
  criado_em: string;
  atualizado_em: string;
}

export interface ContaPagarResumoResponse {
  total_pendente: number;
  total_vencido: number;
  total_agendado: number;
  total_pago: number;
  total_contas: number;
  contas_vencidas_count: number;
  total_vence_hoje: number;
  total_proximos_7_dias: number;
}

export interface FornecedorCreateRequest {
  nome: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
}

export interface FornecedorUpdateRequest {
  nome?: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  ativo?: boolean;
}

export interface FornecedorResponse {
  id: string;
  nome: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

export interface ContaPagarFiltros {
  search?: string;
  status?: string;
  categoria_id?: string;
  data_inicio?: string;
  data_fim?: string;
  fornecedor_id?: string;
}
