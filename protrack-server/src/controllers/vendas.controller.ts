import { Request, Response } from "express";
import { db } from "../config/database";
import { ResultSetHeader } from "mysql2";

export async function criarVenda(req: Request, res: Response) {
  const { clienteId, dataVenda, desconto, total, totalComDesconto, produtos } =
    req.body;

  if (!clienteId || !dataVenda || !produtos || !Array.isArray(produtos)) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Inserir a venda e obter o id
    const [vendaResult] = await connection.execute<ResultSetHeader>(
      `
        INSERT INTO vendas (cliente_id, data_venda, desconto, total, total_com_desconto)
        VALUES (?, ?, ?, ?, ?)
      `,
      [clienteId, dataVenda, desconto || 0, total, totalComDesconto]
    );

    const vendaId = vendaResult.insertId;

    // Inserir itens da venda
    const itensValues = produtos.map((item: any) => [
      vendaId,
      item.produtoId,
      item.quantidade,
      item.precoUnitario,
      item.desconto ?? 0,
    ]);

    await connection.query(
      `
        INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario, desconto)
        VALUES ?
      `,
      [itensValues]
    );

    await connection.commit();
    res.status(201).json({ message: "Venda criada com sucesso", vendaId });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ error: "Erro ao criar venda" });
  } finally {
    connection.release();
  }
}
