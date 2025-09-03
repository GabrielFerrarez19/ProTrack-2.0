import type { Cliente, VendaResponse } from "../@types/types.components";
import dayjs from "dayjs";

export function normalizeCliente(cliente: any): Cliente {
  return {
    id: String(cliente.id),
    nome: cliente.nome ?? "",
    dataNascimento: cliente.data_nascimento ?? "",
    cpf: cliente.cpf ? String(cliente.cpf) : "",
    rg: cliente.rg ?? "",
    estadoCivil: cliente.estado_civil ?? "",
    sexo: cliente.sexo ?? "",
    telefoneWhatsapp: cliente.telefone_whatsapp
      ? String(cliente.telefone_whatsapp)
      : "",
    telefoneCelular: cliente.telefone_celular
      ? String(cliente.telefone_celular)
      : "",
    telefoneResidencial: cliente.telefone_residencial
      ? String(cliente.telefone_residencial)
      : "",
    email: cliente.email ?? "",
    cep: cliente.cep ?? "",
    endereco: cliente.endereco ?? "",
    numero: cliente.numero ?? "",
    complemento: cliente.complemento ?? "",
    bairro: cliente.bairro ?? "",
    cidade: cliente.cidade ?? "",
    valorAPagar: cliente.valor_a_pagar ?? 0, // continua número
  };
}

export function formatarDataNascimento(data: string): string {
  if (!data) return "";

  const date = new Date(data);
  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const ano = date.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

// Função para formatar a data para o formato YYYY-MM-DD (útil para inputs type="date")
export function formatarDataParaInput(data: string): string {
  if (!data) return "";

  // Se a data já está no formato YYYY-MM-DD, retorna como está
  if (data.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return data;
  }

  // Se a data está no formato DD/MM/YYYY, converte para YYYY-MM-DD
  if (data.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
    const [dia, mes, ano] = data.split("/");
    return `${ano}-${mes}-${dia}`;
  }

  // Se é uma data válida, tenta converter
  try {
    const date = new Date(data);
    if (!isNaN(date.getTime())) {
      const ano = date.getFullYear();
      const mes = String(date.getMonth() + 1).padStart(2, "0");
      const dia = String(date.getDate()).padStart(2, "0");
      return `${ano}-${mes}-${dia}`;
    }
  } catch (error) {
    console.error("Erro ao formatar data:", error);
  }

  return "";
}

// Função que retorna a cor e o texto formatado de acordo com o status
export function formatStatus(
  status: "pendente" | "pago" | "cancelado" | "aprazo"
) {
  let color = "";
  let text = "";

  switch (status.toLowerCase()) {
    case "pendente":
      color = "bg-yellow-100 text-yellow-800";
      text = "Pendente";
      break;
    case "pago":
      color = "bg-green-100 text-green-800";
      text = "Pago";
      break;
    case "cancelado":
      color = "bg-red-100 text-red-800";
      text = "Cancelado";
      break;
    case "aprazo":
      color = "bg-blue-100 text-blue-800";
      text = "À prazo";
      break;
    default:
      color = "bg-gray-100 text-gray-800";
      text = status.charAt(0).toUpperCase() + status.slice(1);
  }

  return { color, text };
}

// Formata número em Real brasileiro com separador de milhares
export function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Função utilitária
export const formatBRL = (value: number | string | undefined | null) => {
  if (value === undefined || value === null) return "0,00";

  // garante que seja número
  const num = typeof value === "string" ? parseFloat(value) : value;

  // separa parte inteira e decimal
  const [inteiro, decimal] = num.toFixed(2).split(".");

  // adiciona pontos a cada 3 dígitos
  const inteiroFormatado = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${inteiroFormatado},${decimal}`;
};

// Função utilitária para formatar os nomes
export function formatarFormaPagamento(nome?: string | null): string {
  if (!nome) return "À prazo";

  const mapa: Record<string, string> = {
    pix: "Pix",
    dinheiro: "Dinheiro",
    cartao: "Cartão",
    transferencia: "Transferência",
    aprazo: "À prazo",
  };

  return mapa[nome] || nome.charAt(0).toUpperCase() + nome.slice(1);
}

export function getBadgeClass(valor: number) {
  if (valor < 0) {
    return "bg-red-100 text-red-700"; // negativo
  }
  return "bg-green-100 text-green-700"; // positivo
}

// Calcula dias de atraso considerando vencimento fixo todo dia do mês

export const calcularDiasAtraso = (
  dataCompra: string,
  diaVencimento: number
): number => {
  const hoje = dayjs();
  let vencimento = dayjs(dataCompra).date(diaVencimento);

  // Se o vencimento calculado ainda é antes da compra, avança para o próximo mês
  if (vencimento.isBefore(dayjs(dataCompra), "day")) {
    vencimento = vencimento.add(1, "month");
  }

  // Se ainda não venceu
  if (hoje.isBefore(vencimento, "day")) return 0;

  return hoje.diff(vencimento, "day");
};
export // Função para calcular o status "local" da venda
function calcularStatusVenda(
  venda: VendaResponse
): "pago" | "pendente" | "cancelado" | "vencido" {
  if (venda.status === "pago") return "pago";
  if (venda.status === "cancelado") return "cancelado";

  // calcula a data de vencimento
  if (venda.dias_vencimento && venda.data_venda) {
    const dataVencimento = new Date(venda.data_venda);
    dataVencimento.setDate(dataVencimento.getDate() + venda.dias_vencimento);

    const hoje = new Date();
    if (dataVencimento < hoje) return "vencido"; // está atrasada
  }

  return "pendente"; // ainda não venceu
}
