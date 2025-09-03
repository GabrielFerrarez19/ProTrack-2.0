// ===== TIPOS PARA CONTAS A PAGAR =====

export interface ContaPagar {
  id: string;
  fornecedor_id?: string;
  fornecedor_nome: string;
  valor: number;
  data_vencimento: string;
  status: "pendente" | "pago" | "vencido" | "agendado";
  categoria_id: string;
  categoria_nome: string;
  descricao?: string;
  data_agendamento?: string;
  data_pagamento?: string;
  valor_pago?: number;
  forma_pagamento?: string;
  observacoes?: string;
  dias_atraso: number;
  criado_em: string;
  atualizado_em: string;
}

export interface ContaPagarCreate {
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

export interface ContaPagarUpdate {
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

export interface ContaPagarFiltros {
  search?: string;
  status?: string;
  categoria_id?: string;
  data_inicio?: string;
  data_fim?: string;
}

export interface ContaPagarResumo {
  total_pendente: number;
  total_vencido: number;
  total_agendado: number;
  total_pago: number;
  total_contas: number;
  contas_vencidas_count: number;
}

export interface ContaPagarResponse {
  success: boolean;
  message: string;
  data: ContaPagar;
}

export interface ContasPagarResponse {
  success: boolean;
  message: string;
  data: ContaPagar[];
}

export interface ContaPagarResumoResponse {
  success: boolean;
  message: string;
  data: ContaPagarResumo;
}

// ===== TIPOS PARA FORNECEDORES =====

export interface Fornecedor {
  id: string;
  nome: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  observacoes?: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

export interface FornecedorCreate {
  nome: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  observacoes?: string;
}

export interface FornecedorUpdate {
  nome?: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  observacoes?: string;
}

export interface FornecedorResponse {
  success: boolean;
  message: string;
  data: Fornecedor;
}

export interface FornecedoresResponse {
  success: boolean;
  message: string;
  data: Fornecedor[];
}

// ===== TIPOS PARA CATEGORIAS =====

export interface Categoria {
  id: string;
  nome: string;
  tipo: "receita" | "despesa";
  cor: string;
  criado_em: string;
  atualizado_em: string;
}

export interface CategoriaCreate {
  nome: string;
  tipo: "receita" | "despesa";
  cor: string;
}

export interface CategoriaUpdate {
  nome?: string;
  cor?: string;
}

export interface CategoriaResponse {
  success: boolean;
  message: string;
  data: Categoria;
}

export interface CategoriasResponse {
  success: boolean;
  message: string;
  data: Categoria[];
}

// ===== TIPOS PARA RELATÓRIOS =====

export interface RelatorioContasPagar {
  periodo: {
    data_inicio: string;
    data_fim: string;
  };
  resumo: {
    total_contas: number;
    total_pendente: number;
    total_vencido: number;
    total_pago: number;
    total_agendado: number;
  };
  contas_por_status: Array<{
    status: string;
    quantidade: number;
    valor_total: number;
  }>;
  contas_por_categoria: Array<{
    categoria: string;
    quantidade: number;
    valor_total: number;
  }>;
  contas_por_fornecedor: Array<{
    fornecedor: string;
    quantidade: number;
    valor_total: number;
  }>;
  contas_vencidas: ContaPagar[];
  contas_vencendo_em: ContaPagar[];
}

export interface RelatorioResponse {
  success: boolean;
  message: string;
  data: RelatorioContasPagar;
}

// ===== TIPOS PARA ESTATÍSTICAS =====

export interface EstatisticasContasPagar {
  periodo: {
    data_inicio: string;
    data_fim: string;
  };
  totais: {
    contas_criadas: number;
    contas_pagas: number;
    contas_vencidas: number;
    valor_total_pago: number;
    valor_total_vencido: number;
  };
  evolucao_mensal: Array<{
    mes: string;
    contas_criadas: number;
    contas_pagas: number;
    valor_pago: number;
  }>;
  top_fornecedores: Array<{
    fornecedor: string;
    quantidade: number;
    valor_total: number;
  }>;
  top_categorias: Array<{
    categoria: string;
    quantidade: number;
    valor_total: number;
  }>;
}

export interface EstatisticasResponse {
  success: boolean;
  message: string;
  data: EstatisticasContasPagar;
}

// ===== TIPOS PARA PROJEÇÕES =====

export interface ProjecaoPagamentos {
  periodo: {
    data_inicio: string;
    data_fim: string;
    dias: number;
  };
  projecao: Array<{
    data: string;
    contas_vencendo: number;
    valor_total: number;
    contas_criticas: number;
  }>;
  alertas: Array<{
    tipo: "vencimento_proximo" | "valor_alto" | "fornecedor_frequente";
    mensagem: string;
    contas_afetadas: number;
    valor_total: number;
  }>;
}

export interface ProjecaoResponse {
  success: boolean;
  message: string;
  data: ProjecaoPagamentos;
}

// ===== TIPOS PARA ALERTAS =====

export interface AlertaContasPagar {
  id: string;
  tipo:
    | "vencimento_proximo"
    | "conta_vencida"
    | "valor_alto"
    | "fornecedor_frequente";
  titulo: string;
  mensagem: string;
  nivel: "baixo" | "medio" | "alto" | "critico";
  lido: boolean;
  contas_afetadas: string[];
  criado_em: string;
}

export interface AlertasResponse {
  success: boolean;
  message: string;
  data: AlertaContasPagar[];
}

// ===== TIPOS PARA CONFIGURAÇÕES =====

export interface ConfiguracoesContasPagar {
  dias_alerta_vencimento: number;
  notificar_por_email: boolean;
  notificar_por_sms: boolean;
  categorias_padrao: string[];
  formas_pagamento_padrao: string[];
  alertas_automaticos: boolean;
  backup_automatico: boolean;
}

export interface ConfiguracoesResponse {
  success: boolean;
  message: string;
  data: ConfiguracoesContasPagar;
}

// ===== TIPOS PARA EXPORTAÇÃO =====

export interface ExportacaoFiltros {
  status?: string;
  categoria_id?: string;
  data_inicio?: string;
  data_fim?: string;
  formato: "pdf" | "excel";
}

export interface ExportacaoResponse {
  success: boolean;
  message: string;
  data: {
    arquivo_url: string;
    nome_arquivo: string;
    tamanho: number;
    formato: string;
  };
}

// ===== TIPOS PARA PAGINAÇÃO =====

export interface PaginacaoParams {
  pagina: number;
  limite: number;
  ordenacao?: string;
  direcao?: "asc" | "desc";
}

export interface PaginacaoResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    paginacao: {
      pagina_atual: number;
      total_paginas: number;
      total_items: number;
      limite: number;
      tem_proxima: boolean;
      tem_anterior: boolean;
    };
  };
}

// ===== TIPOS PARA BUSCA AVANÇADA =====

export interface BuscaAvancadaParams {
  texto?: string;
  status?: string[];
  categoria_id?: string[];
  fornecedor_id?: string[];
  data_inicio?: string;
  data_fim?: string;
  valor_minimo?: number;
  valor_maximo?: number;
  dias_vencimento_min?: number;
  dias_vencimento_max?: number;
}

export interface BuscaAvancadaResponse {
  success: boolean;
  message: string;
  data: {
    contas: ContaPagar[];
    total_encontrado: number;
    tempo_busca: number;
    filtros_aplicados: BuscaAvancadaParams;
  };
}
