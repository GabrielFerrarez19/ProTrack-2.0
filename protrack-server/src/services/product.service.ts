import {
  FormaPagamentoCount,
  ProdutoMaisVendido,
} from "../@types/types.controller";
import { db } from "../config/database";

export interface ProdutoData {
  nome: string;
  descricao?: string;
  categoria?: string;
  codigo_barras?: string;
  quantidade?: number;
  tamanho?: string;
  preco_custo: number;
  preco_venda: number;
}

export const createProductDb = async (
  produto: ProdutoData
): Promise<number> => {
  const sql = `
    INSERT INTO produtos 
    (nome, descricao, categoria, codigo_barras, quantidade, tamanho, preco_custo, preco_venda)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    produto.nome,
    produto.descricao || null,
    produto.categoria || null,
    produto.codigo_barras || null,
    produto.quantidade || 0,
    produto.tamanho || null,
    produto.preco_custo,
    produto.preco_venda,
  ];

  const [result]: any = await db.query(sql, values);
  return result.insertId;
};

export const updateProductDb = async (
  id: number,
  produto: ProdutoData
): Promise<void> => {
  const sql = `
    UPDATE produtos SET 
      nome = ?, 
      descricao = ?, 
      categoria = ?, 
      codigo_barras = ?, 
      quantidade = ?, 
      tamanho = ?, 
      preco_custo = ?, 
      preco_venda = ?
    WHERE id = ?
  `;

  const values = [
    produto.nome,
    produto.descricao || null,
    produto.categoria || null,
    produto.codigo_barras || null,
    produto.quantidade || 0,
    produto.tamanho || null,
    produto.preco_custo,
    produto.preco_venda,
    id,
  ];

  const [result]: any = await db.query(sql, values);

  if (result.affectedRows === 0) {
    throw new Error("Produto não encontrado");
  }
};

export const getTotalEstoqueDb = async (): Promise<number> => {
  const sql = "SELECT SUM(quantidade) AS totalEstoque FROM produtos";
  const [rows]: any = await db.query(sql);

  return rows[0].totalEstoque || 0;
};

export const getAllProdutosDb = async (): Promise<any[]> => {
  const sql = "SELECT * FROM produtos";
  const [rows]: any = await db.query(sql);

  return rows;
};

export const getTotalPrecoEstoque = async (): Promise<number> => {
  const sql = `
    SELECT SUM(preco_custo * quantidade) AS total_estoque
    FROM produtos
  `;

  const [rows]: any = await db.query(sql);

  // Retorna 0 caso não exista nenhum produto
  return rows[0]?.total_estoque || 0;
};

export const calcularGiroEstoque = async (): Promise<number> => {
  // 1. Total do estoque atual
  const sqlEstoque = `
    SELECT SUM(preco_custo * quantidade) AS total_estoque
    FROM produtos
  `;
  const [estoqueRows]: any = await db.query(sqlEstoque);
  const totalEstoque = estoqueRows[0]?.total_estoque || 0;

  if (totalEstoque === 0) return 0; // evita divisão por zero

  // 2. Custo das mercadorias vendidas (CMV)
  const sqlCMV = `
    SELECT SUM(iv.quantidade * p.preco_custo) AS cmv
    FROM itens_venda iv
    JOIN produtos p ON iv.produto_id = p.id
    JOIN vendas v ON iv.venda_id = v.id
    WHERE v.status != 'cancelado'
  `;
  const [cmvRows]: any = await db.query(sqlCMV);
  const cmv = cmvRows[0]?.cmv || 0;

  // 3. Calcula o giro do estoque em porcentagem
  const giro = (cmv / totalEstoque) * 100;

  return parseFloat(giro.toFixed(2)); // retorna com 2 casas decimais
};

export const getProdutosMaisVendidos = async (
  limit: number = 5 // retorna top 5 por padrão
): Promise<ProdutoMaisVendido[]> => {
  const sql = `
    SELECT 
      p.id AS produto_id,
      p.nome,
      SUM(iv.quantidade) AS total_vendido
    FROM itens_venda iv
    INNER JOIN vendas v ON iv.venda_id = v.id
    INNER JOIN produtos p ON iv.produto_id = p.id
    WHERE v.status != 'cancelado'
    GROUP BY p.id, p.nome
    ORDER BY total_vendido DESC
    LIMIT ?
  `;

  const [rows]: any = await db.query(sql, [limit]);

  return rows.map((row: any) => ({
    produto_id: row.produto_id,
    nome: row.nome,
    total_vendido: Number(row.total_vendido),
  }));
};

export const contarProdutosQuantidadeBaixa = async (): Promise<number> => {
  const sql = `
    SELECT COUNT(*) AS total
    FROM produtos
    WHERE quantidade <= 4
  `;

  const [rows]: any = await db.query(sql);
  const total = rows[0]?.total || 0;

  return total;
};
