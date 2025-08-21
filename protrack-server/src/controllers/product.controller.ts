import { Request, Response } from "express";
import {
  ProdutoData,
  createProductDb,
  updateProductDb,
  getTotalEstoqueDb,
  getAllProdutosDb,
  getTotalPrecoEstoque,
  calcularGiroEstoque,
  getProdutosMaisVendidos,
} from "../services/product.service";

export const createProduct = async (req: Request, res: Response) => {
  const produto: ProdutoData = req.body;

  if (
    !produto.nome ||
    produto.preco_custo === undefined ||
    produto.preco_venda === undefined
  ) {
    return res.status(400).json({
      error: "Nome, preço de custo e preço de venda são obrigatórios",
    });
  }

  try {
    const id = await createProductDb(produto);
    res.status(201).json({ message: "Produto criado com sucesso", id });
  } catch (err: any) {
    console.error("Erro ao criar produto:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const produto: ProdutoData = req.body;

  if (
    !id ||
    !produto.nome ||
    produto.preco_custo === undefined ||
    produto.preco_venda === undefined
  ) {
    return res.status(400).json({
      error: "ID, nome, preço de custo e preço de venda são obrigatórios",
    });
  }

  try {
    await updateProductDb(id, produto);
    res.status(200).json({ message: "Produto atualizado com sucesso" });
  } catch (err: any) {
    if (err.message === "Produto não encontrado")
      return res.status(404).json({ error: err.message });
    console.error("Erro ao atualizar produto:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const getTotalEstoque = async (req: Request, res: Response) => {
  try {
    const total = await getTotalEstoqueDb();
    res.status(200).json({ totalEstoque: total });
  } catch (err) {
    console.error("Erro ao buscar total do estoque:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const getAllProdutos = async (req: Request, res: Response) => {
  try {
    const produtos = await getAllProdutosDb();
    res.status(200).json(produtos);
  } catch (err) {
    console.error("Erro ao buscar produtos:", err); // já tem, mas vamos confirmar que imprime
    res.status(500).json({ error: (err as Error).message }); // mostra a mensagem real
  }
};

export const getTotalEstoquePrecoController = async (
  req: Request,
  res: Response
) => {
  try {
    const total = await getTotalPrecoEstoque();
    res.status(200).json({ totalEstoque: total });
  } catch (err) {
    console.error("Erro ao calcular o total do estoque:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getGiroEstoqueController = async (req: Request, res: Response) => {
  try {
    const giro = await calcularGiroEstoque();
    res.status(200).json({ giroEstoque: giro });
  } catch (err) {
    console.error("Erro ao calcular o giro de estoque:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getProdutosMaisVendidosController = async (
  req: Request,
  res: Response
) => {
  try {
    // Podemos aceitar um parâmetro 'limit' opcional na query string
    const limit = req.query.limit ? Number(req.query.limit) : 5;

    const produtos = await getProdutosMaisVendidos(limit);

    res.status(200).json({ produtos });
  } catch (err) {
    console.error("Erro ao buscar produtos mais vendidos:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};
