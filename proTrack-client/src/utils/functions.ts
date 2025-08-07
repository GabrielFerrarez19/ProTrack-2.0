import type { Cliente } from "../@types/types.components";

export function normalizeCliente(cliente: any): Cliente {
  return {
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
