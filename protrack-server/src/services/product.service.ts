import { db } from "../db/connection";

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

  return new Promise((resolve, reject) => {
    db.query(sql, values, (err: any, results: any) => {
      if (err) return reject(err);
      resolve(results.insertId);
    });
  });
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

  return new Promise((resolve, reject) => {
    db.query(sql, values, (err: any, results: any) => {
      if (err) return reject(err);
      if (results.affectedRows === 0)
        return reject(new Error("Produto não encontrado"));
      resolve();
    });
  });
};

export const getTotalEstoqueDb = async (): Promise<number> => {
  const sql = "SELECT SUM(quantidade) AS totalEstoque FROM produtos";

  return new Promise((resolve, reject) => {
    db.query(sql, (err: any, results: any) => {
      if (err) return reject(err);
      resolve(results[0].totalEstoque || 0);
    });
  });
};

export const getAllProdutosDb = async (): Promise<any[]> => {
  const sql = "SELECT * FROM produtos";

  return new Promise((resolve, reject) => {
    db.query(sql, (err: any, results: any) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};
