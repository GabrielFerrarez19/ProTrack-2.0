import { Request, Response } from "express";
import {
  addCategoria,
  deleteCategoria,
  getCategorias,
  getMetodosPagamento,
  getMetodosPagamentoAtivos,
  toggleMetodoPagamento,
  updateCategoria,
} from "../services/config.service";

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

// GET /categorias
export const listarCategorias = async (req: Request, res: Response) => {
  try {
    const categorias = await getCategorias();
    res.json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao listar categorias" });
  }
};

// POST /categorias
export const criarCategoria = async (req: Request, res: Response) => {
  try {
    const { id, nome, tipo, cor } = req.body;
    if (!id || !nome || !tipo || !cor) {
      return res.status(400).json({ message: "Dados incompletos" });
    }

    await addCategoria({ id, nome, tipo, cor });
    res.status(201).json({ message: "Categoria criada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar categoria" });
  }
};

// PUT /categorias/:id
export const atualizarCategoria = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, tipo, cor } = req.body;
    if (!nome || !tipo || !cor) {
      return res.status(400).json({ message: "Dados incompletos" });
    }

    await updateCategoria({ id, nome, tipo, cor });
    res.json({ message: "Categoria atualizada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar categoria" });
  }
};

// DELETE /categorias/:id
export const removerCategoria = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteCategoria(id);
    res.json({ message: "Categoria removida com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao remover categoria" });
  }
};
