import { Request, Response } from "express";
import {
  ClienteData,
  createClienteDb,
  updateClienteDb,
  getTotalClientesDb,
  getAllClientesDb,
  getVendasByClienteId,
  getTotalAPagarGeral,
  getClientesEmAbertoCountDb,
} from "../services/client.service";

export const createCliente = async (req: Request, res: Response) => {
  const cliente: ClienteData = req.body;

  if (
    !cliente.nome ||
    !cliente.dataNascimento ||
    !cliente.cpf ||
    !cliente.email
  ) {
    return res.status(400).json({
      error: "Nome, data de nascimento, CPF e e-mail são obrigatórios.",
    });
  }

  try {
    const id = await createClienteDb(cliente);
    res.status(201).json({ message: "Cliente cadastrado com sucesso!", id });
  } catch (err: any) {
    console.error("Erro ao criar cliente:", err);
    res.status(500).json({ error: "Erro interno ao cadastrar cliente" });
  }
};

export const updateCliente = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const cliente: ClienteData = req.body;

  if (
    !id ||
    !cliente.nome ||
    !cliente.dataNascimento ||
    !cliente.cpf ||
    !cliente.email
  ) {
    return res.status(400).json({
      error: "ID, nome, data de nascimento, CPF e e-mail são obrigatórios.",
    });
  }

  try {
    await updateClienteDb(id, cliente);
    res.status(200).json({ message: "Cliente atualizado com sucesso" });
  } catch (err: any) {
    if (err.message === "Cliente não encontrado")
      return res.status(404).json({ error: err.message });
    console.error("Erro ao atualizar cliente:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const getTotalClientes = async (req: Request, res: Response) => {
  try {
    const total = await getTotalClientesDb();
    res.status(200).json({ totalClientes: total });
  } catch (err) {
    console.error("Erro ao buscar total de clientes:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const getAllClientes = async (req: Request, res: Response) => {
  try {
    const clientes = await getAllClientesDb();
    res.status(200).json({ clientes });
  } catch (err) {
    console.error("Erro ao buscar clientes:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const getVendasCliente = async (req: Request, res: Response) => {
  try {
    const idCliente = Number(req.params.id);
    if (isNaN(idCliente)) {
      return res.status(400).json({ error: "ID de cliente inválido." });
    }
    const vendas = await getVendasByClienteId(idCliente);
    res.json(vendas);
  } catch (error) {
    console.error("Erro ao buscar vendas do cliente:", error);
    res
      .status(500)
      .json({ error: "Erro interno ao buscar vendas do cliente." });
  }
};

export const getTotalGeralAReceberController = async (
  req: Request,
  res: Response
) => {
  try {
    const totalGeral = await getTotalAPagarGeral();

    res.status(200).json({
      total_geral: totalGeral ?? 0, // garante número
    });
  } catch (err) {
    console.error("Erro ao buscar total geral a receber:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const getClientesEmAbertoCountController = async (
  req: Request,
  res: Response
) => {
  try {
    const total = await getClientesEmAbertoCountDb();
    res.status(200).json({ totalClientesEmAberto: total });
  } catch (err) {
    console.error("Erro ao buscar contagem de clientes em aberto:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
