import type { Cliente } from "../@types/types.components";

export function normalizeCliente(cliente: any): Cliente {
  return {
    id: cliente.id,
    nome: cliente.nome,
    dataNascimento: cliente.data_nascimento,
    cpf: cliente.cpf,
    rg: cliente.rg,
    estadoCivil: cliente.estado_civil,
    sexo: cliente.sexo,
    telefoneWhatsapp: cliente.telefone_whatsapp,
    telefoneCelular: cliente.telefone_celular,
    telefoneResidencial: cliente.telefone_residencial,
    email: cliente.email,
    cep: cliente.cep,
    endereco: cliente.endereco,
    numero: cliente.numero,
    complemento: cliente.complemento,
    bairro: cliente.bairro,
    cidade: cliente.cidade,
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

// Função que retorna a cor de acordo com o status
export function formatStatus(status: "pendente" | "pago" | "cancelado") {
  let color = "";
  switch (status) {
    case "pendente":
      color = "bg-yellow-100 text-yellow-800";
      break;
    case "pago":
      color = "bg-green-100 text-green-800";
      break;
    case "cancelado":
      color = "bg-red-100 text-red-800";
      break;
    default:
      color = "bg-gray-100 text-gray-800";
  }

  // Coloca a primeira letra em maiúscula
  const formattedText = status.charAt(0).toUpperCase() + status.slice(1);

  return { color, text: formattedText };
}

// Formata número em Real brasileiro com separador de milhares
export function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
