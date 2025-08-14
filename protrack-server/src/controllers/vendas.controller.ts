import { Request, Response } from "express";
import { db } from "../config/database";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import {
  atualizarVendaDb,
  criarVendaDb,
  getAllVendasDb,
  getTotalVendasDb,
  mapVendasComItens,
} from "../services/venda.service";

export const criarVenda = async (req: Request, res: Response) => {
  const dados = req.body;

  if (
    !dados.clienteId ||
    !dados.dataVenda ||
    !dados.produtos ||
    !Array.isArray(dados.produtos)
  ) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  try {
    const vendaId = await criarVendaDb(dados);
    res.status(201).json({ message: "Venda criada com sucesso", vendaId });
  } catch (error: any) {
    console.error("Erro ao criar venda:", error);
    res.status(500).json({ error: "Erro ao criar venda" });
  }
};

export const getTotalVendas = async (req: Request, res: Response) => {
  try {
    const total = await getTotalVendasDb();
    res.status(200).json({ totalVendas: total });
  } catch (error) {
    console.error("Erro ao buscar total de vendas:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Controller para retornar todas as vendas com os itens
export const getAllVendas = async (req: Request, res: Response) => {
  try {
    const rows = await getAllVendasDb();
    const vendas = mapVendasComItens(rows);
    res.status(200).json(vendas);
  } catch (err) {
    console.error("Erro ao buscar vendas:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const atualizarVenda = async (req: Request, res: Response) => {
  const vendaId = Number(req.params.id);
  const dados = req.body;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    await atualizarVendaDb(vendaId, dados, connection);
    await connection.commit();
    res.json({ message: "Venda atualizada com sucesso" });
  } catch (error: any) {
    await connection.rollback();
    console.error("Erro ao atualizar venda:", error);
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};
