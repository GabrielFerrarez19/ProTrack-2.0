// ===== TIPOS PARA FLUXO DE CAIXA =====

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

export interface FluxoCaixaItem {
  data: string;
  entradas: number;
  saidas: number;
  saldo: number;
  tipo?: "historico" | "projecao";
}

export interface CategoriaFluxo {
  categoria: string;
  valor: number;
  percentual: number;
}

export interface ComparativoPeriodo {
  periodo: string;
  entradas: number;
  saidas: number;
  saldo: number;
}

export interface ResumoFluxoCaixaResponse {
  saldo_atual: number;
  total_entradas: number;
  total_saidas: number;
  projecao_30_dias: number;
  crescimento_percentual: number;
}
