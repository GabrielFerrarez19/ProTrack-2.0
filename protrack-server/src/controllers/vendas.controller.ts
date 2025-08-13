import { Request, Response } from "express";
import { db } from "../config/database";
import { ResultSetHeader, RowDataPacket } from "mysql2";

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

export const getTotalVendas = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT COUNT(*) AS totalVendas FROM vendas");
    const total = (rows as any)[0]?.totalVendas || 0;
    res.status(200).json({ totalVendas: total });
  } catch (error) {
    console.error("Erro ao buscar total de vendas:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Controller para retornar todas as vendas com os itens
export const getAllVendas = async (req: Request, res: Response) => {
  const sql = `
    SELECT 
      v.id AS venda_id,
      v.cliente_id,
      c.nome AS cliente_nome,
      v.data_venda,
      v.desconto AS venda_desconto,
      v.total,
      v.total_com_desconto,
      v.data_cadastro,
      iv.id AS item_id,
      iv.produto_id,
      p.nome AS produto_nome,
      iv.quantidade,
      iv.preco_unitario,
      iv.desconto AS item_desconto
    FROM vendas v
    JOIN clientes c ON v.cliente_id = c.id
    LEFT JOIN itens_venda iv ON iv.venda_id = v.id
    LEFT JOIN produtos p ON iv.produto_id = p.id
    ORDER BY v.id, iv.id;
  `;

  try {
    const [results]: any[] = await db.query(sql);

    const vendasMap: Record<number, any> = {};

    results.forEach((row: any) => {
      if (!vendasMap[row.venda_id]) {
        vendasMap[row.venda_id] = {
          id: row.venda_id,
          cliente_id: row.cliente_id,
          cliente_nome: row.cliente_nome,
          data_venda: row.data_venda,
          desconto: row.venda_desconto,
          total: row.total,
          total_com_desconto: row.total_com_desconto,
          data_cadastro: row.data_cadastro,
          itens: [],
        };
      }

      if (row.item_id) {
        vendasMap[row.venda_id].itens.push({
          id: row.item_id,
          venda_id: row.venda_id,
          produto_id: row.produto_id,
          produto_nome: row.produto_nome,
          quantidade: row.quantidade,
          preco_unitario: row.preco_unitario,
          desconto: row.item_desconto,
        });
      }
    });

    res.status(200).json(Object.values(vendasMap));
  } catch (err) {
    console.error("Erro ao buscar vendas:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const atualizarVenda = async (req: Request, res: Response) => {
  const vendaId = Number(req.params.id);
  const { clienteId, dataVenda, desconto, total, totalComDesconto, produtos } =
    req.body;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Prepara os campos que podem ser atualizados
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (clienteId != null) {
      updateFields.push("cliente_id = ?");
      updateValues.push(clienteId);
    }
    if (dataVenda) {
      updateFields.push("data_venda = ?");
      updateValues.push(dataVenda); // deve estar em YYYY-MM-DD
    }
    if (desconto != null) {
      updateFields.push("desconto = ?");
      updateValues.push(Number(desconto));
    }
    if (total != null) {
      updateFields.push("total = ?");
      updateValues.push(Number(total));
    }
    if (totalComDesconto != null) {
      updateFields.push("total_com_desconto = ?");
      updateValues.push(Number(totalComDesconto));
    }

    if (updateFields.length > 0) {
      const sql = `UPDATE vendas SET ${updateFields.join(", ")} WHERE id = ?`;
      updateValues.push(vendaId);
      await connection.query(sql, updateValues);
    }

    // Atualiza itens somente se vierem no body
    if (Array.isArray(produtos) && produtos.length > 0) {
      // Remove itens antigos
      await connection.query(`DELETE FROM itens_venda WHERE venda_id = ?`, [
        vendaId,
      ]);

      // Insere novos itens
      for (const item of produtos) {
        const {
          produtoId,
          quantidade,
          precoUnitario,
          desconto: itemDesconto = 0,
        } = item;

        if (!produtoId || quantidade == null || precoUnitario == null) {
          throw new Error("Item inválido: " + JSON.stringify(item));
        }

        await connection.query(
          `INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario, desconto)
           VALUES (?, ?, ?, ?, ?)`,
          [vendaId, produtoId, quantidade, precoUnitario, Number(itemDesconto)]
        );
      }
    }

    await connection.commit();
    res.json({ message: "Venda atualizada com sucesso" });
  } catch (error: any) {
    await connection.rollback();
    console.error("Erro ao atualizar venda:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  } finally {
    connection.release();
  }
};
