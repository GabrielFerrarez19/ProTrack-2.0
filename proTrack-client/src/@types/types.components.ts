export interface TypeInput {
  TextLabel: string;
  type: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface TypeButton {
  Text: string;
  type: "submit" | "button" | "reset";
  onClick?: () => void;
}

export interface TypeHeader {
  text: string;
  title: string;
}

export interface ProductFormData {
  nome: string;
  descricao: string;
  categoria: string;
  codigoBarras: string;
  quantidade: number;
  tamanho: string;
  precoCusto: number;
  precoVenda: number;
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

export interface Cliente {
  id: string;
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
  forma_pagamento: "dinheiro" | "cartao" | "pix" | "transferencia";
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

export interface ItemVenda {
  id: number; // ID do item na venda
  venda_id: number; // ID da venda à qual o item pertence
  produto_id: number; // ID do produto
  produto_nome: string; // Nome do produto
  quantidade: number; // Quantidade vendida
  preco_unitario: number; // Preço unitário do produto
  desconto?: number; // Desconto aplicado no item (em %)
}

export interface ItemVendaForm {
  produto_id: number;
  produto_nome: string;
  quantidade: number;
  preco_unitario: number;
  desconto: number;
}

export interface VendaForm {
  data_venda: string;
  desconto: number;
  status: "pendente" | "pago" | "cancelado" | "aprazo";
  formaPagamento?: "dinheiro" | "cartao" | "pix" | "transferencia" | "aprazo";
  diasVencimento?: number;
  itens: ItemVendaForm[];
}
export interface ProdutoApi {
  id: number;
  nome: string;
  codigo_barras?: string;
  preco_venda?: number;
}

export interface ProdutoMaisVendido {
  produto_id: number; // ID do produto
  nome: string; // Nome do produto
  total_vendido: number; // Quantidade total vendida
}
export interface ContaBancaria {
  id: string;
  nome: string;
  banco: string;
  agencia: string;
  conta: string;
  saldo: number;
  ativa: boolean;
}

export interface MetodoPagamento {
  id: string;
  nome: string;
  tipo: "dinheiro" | "cartao" | "pix" | "transferencia" | "aprazo";
  ativo: boolean;
}

export interface Categoria {
  id: string;
  nome: string;
  tipo: "receita" | "despesa";
  cor: string;
}

export interface LimitesFluxo {
  limiteDiario: number;
  limiteSemanal: number;
  limiteMensal: number;
  alertaFluxoCaixa: boolean;
}

export interface Alerta {
  tipo: string;
  mensagem: string;
  urgencia: "alta" | "media";
}

export interface ContaPagar {
  id: string;
  fornecedor: string;
  valor: number;
  dataVencimento: string;
  diasAtraso: number;
  status: "pendente" | "pago" | "vencido" | "agendado";
  categoria: string;
  descricao: string;
  dataAgendamento?: string;
}

export interface ProdutoMargemLucroResponse {
  produtos: {
    id: number;
    nome: string;
    categoria?: string;
    preco_custo: number;
    preco_venda: number;
    margem_lucro: number;
    lucro_unitario: number;
  }[];
}

export interface RelatorioItem {
  produto_id: number;
  nome: string;
  categoria: string;
  preco_custo: number;
  preco_venda: number;
  [key: string]: string | number | null; // Para suportar outros campos dinâmicos
}

export interface RelatorioResponse {
  relatorio: RelatorioItem[];
}

export interface ContasPagarFormData {
  fornecedor_nome: string;
  valor: string; // pode ser string (do input) ou number, depende de como vai salvar
  data_vencimento: string;
  status: "pendente" | "pago" | "vencido" | "agendado";
  categoria_id: string;
  descricao: string;
  data_agendamento: string;
  valor_pago: string; // idem ao valor, pode ser number se preferir
  forma_pagamento: string;
  observacoes: string;
}
