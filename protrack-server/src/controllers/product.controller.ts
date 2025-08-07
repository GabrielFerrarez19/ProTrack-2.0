import { Request, Response } from "express";
import { db } from "../db/connection";

export const createProduct = (req: Request, res: Response) => {
  const {
    nome,
    descricao,
    categoria,
    codigo_barras,
    quantidade,
    tamanho,
    preco_custo,
    preco_venda,
  } = req.body;

  if (!nome || preco_custo === undefined || preco_venda === undefined) {
    return res.status(400).json({
      error: "Nome, preço de custo e preço de venda são obrigatórios",
    });
  }

  const sql = `
    INSERT INTO produtos 
    (nome, descricao, categoria, codigo_barras, quantidade, tamanho, preco_custo, preco_venda)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    nome,
    descricao || null,
    categoria || null,
    codigo_barras || null,
    quantidade || 0,
    tamanho || null,
    preco_custo,
    preco_venda,
  ];

  db.query(sql, values, (err: any, results: any) => {
    if (err) {
      console.error("Erro ao inserir produto:", err);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }

    res.status(201).json({
      message: "Produto criado com sucesso",
      id: results.insertId,
    });
  });
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const dadosAtualizados = req.body;

  try {
    // exemplo de atualização
    const produto = await db.query(
      "UPDATE produtos SET nome = ?, ... WHERE id = ?",
      [dadosAtualizados.nome, id]
    );

    res.status(200).json({ mensagem: "Produto atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
};

export const getTotalEstoque = (req: Request, res: Response) => {
  const sql = "SELECT SUM(quantidade) AS totalEstoque FROM produtos";

  db.query(sql, (err: any, results: any) => {
    if (err) {
      console.error("Erro ao buscar o total de itens no estoque:", err);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }

    const total = results[0].totalEstoque || 0;

    res.status(200).json({ totalEstoque: total });
  });
};

export const getAllProdutos = (req: Request, res: Response) => {
  const sql = "SELECT * FROM produtos";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar os produtos:", err);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }

    res.status(200).json(results);
  });
};
