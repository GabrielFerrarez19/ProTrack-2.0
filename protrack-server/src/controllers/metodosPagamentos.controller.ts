import { Request, Response } from "express";
import {
  getMetodosPagamento,
  getMetodosPagamentoAtivos,
  toggleMetodoPagamento,
} from "../services/metodosPagamentos.service";

// Controller: retorna todos os métodos de pagamento
export const getMetodosPagamentoConfig = async (
  req: Request,
  res: Response
) => {
  try {
    const metodos = await getMetodosPagamento();
    res.status(200).json(metodos);
  } catch (error) {
    console.error("Erro ao buscar métodos de pagamento:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

// controller
export const toggleMetodoPagamentoController = async (req: any, res: any) => {
  const { id } = req.params;
  const { ativo } = req.body; // aqui deve vir true/false

  if (ativo === undefined) {
    return res.status(400).json({ error: "Campo 'ativo' é obrigatório" });
  }

  // chama o service com o valor real
  await toggleMetodoPagamento(Number(id), ativo);

  res.status(200).json({ message: "Método atualizado com sucesso" });
};

export const getMetodosPagamentoAtivosController = async (
  req: any,
  res: any
) => {
  const metodosAtivos = await getMetodosPagamentoAtivos();
  res.json(metodosAtivos);
};
