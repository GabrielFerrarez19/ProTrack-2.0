// ===== TIPOS PARA RELATÓRIOS =====

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
  distribuicao_margem: any[];
  estoque_investimento: RelatorioEstoqueInvestimento[];
  contas_detalhadas: RelatorioContasDetalhadas[];
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

export interface EvolucaoLucroMensal {
  mes: string;
  ano: number;
  lucro_mensal: number;
  receita_mensal: number;
  custo_mensal: number;
  margem_lucro_mensal: number;
  quantidade_vendas: number;
}
