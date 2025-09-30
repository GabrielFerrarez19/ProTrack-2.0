// ===== TIPOS PARA CONTAS A PAGAR =====

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
