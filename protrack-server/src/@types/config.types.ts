// ===== TIPOS PARA CONFIGURAÇÕES =====

export interface MetodoPagamentoConfig {
  id: string;
  nome: string;
  tipo: "dinheiro" | "cartao" | "pix" | "transferencia" | "outro" | "aprazo";
  ativo: boolean;
}

export interface Categoria {
  id: string; // UUID ou string única
  nome: string; // nome da categoria
  tipo: "receita" | "despesa"; // tipo da categoria
  cor: string; // cor em hexadecimal (#FFFFFF)
}

export interface CategoriaRequest {
  id: string;
  nome: string;
  tipo: "receita" | "despesa";
  cor: string;
}

export interface CategoriaResponse {
  message: string;
}

export interface ListCategoriasResponse extends Array<Categoria> {}

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
