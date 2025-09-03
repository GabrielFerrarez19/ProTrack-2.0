"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDistribuicaoMargemLucro = exports.getValorInvestidoPorCategoria = exports.getEvolucaoLucroMensal = exports.getMargemLucroTotal = exports.getProdutosMelhorMargemLucro = exports.contarProdutosQuantidadeBaixa = exports.getProdutosMaisVendidos = exports.calcularGiroEstoque = exports.getTotalPrecoEstoque = exports.getAllProdutosDb = exports.getTotalEstoqueDb = exports.updateProductDb = exports.createProductDb = void 0;
const database_1 = require("../config/database");
const createProductDb = async (produto) => {
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
    const [result] = await database_1.db.query(sql, values);
    return result.insertId;
};
exports.createProductDb = createProductDb;
const updateProductDb = async (id, produto) => {
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
    const [result] = await database_1.db.query(sql, values);
    if (result.affectedRows === 0) {
        throw new Error("Produto não encontrado");
    }
};
exports.updateProductDb = updateProductDb;
const getTotalEstoqueDb = async () => {
    const sql = "SELECT SUM(quantidade) AS totalEstoque FROM produtos";
    const [rows] = await database_1.db.query(sql);
    return rows[0].totalEstoque || 0;
};
exports.getTotalEstoqueDb = getTotalEstoqueDb;
const getAllProdutosDb = async () => {
    const sql = "SELECT * FROM produtos";
    const [rows] = await database_1.db.query(sql);
    return rows;
};
exports.getAllProdutosDb = getAllProdutosDb;
const getTotalPrecoEstoque = async () => {
    const sql = `
    SELECT SUM(preco_custo * quantidade) AS total_estoque
    FROM produtos
  `;
    const [rows] = await database_1.db.query(sql);
    // Retorna 0 caso não exista nenhum produto
    return rows[0]?.total_estoque || 0;
};
exports.getTotalPrecoEstoque = getTotalPrecoEstoque;
const calcularGiroEstoque = async () => {
    // 1. Total do estoque atual
    const sqlEstoque = `
    SELECT SUM(preco_custo * quantidade) AS total_estoque
    FROM produtos
  `;
    const [estoqueRows] = await database_1.db.query(sqlEstoque);
    const totalEstoque = estoqueRows[0]?.total_estoque || 0;
    if (totalEstoque === 0)
        return 0; // evita divisão por zero
    // 2. Custo das mercadorias vendidas (CMV)
    const sqlCMV = `
    SELECT SUM(iv.quantidade * p.preco_custo) AS cmv
    FROM itens_venda iv
    JOIN produtos p ON iv.produto_id = p.id
    JOIN vendas v ON iv.venda_id = v.id
    WHERE v.status != 'cancelado'
  `;
    const [cmvRows] = await database_1.db.query(sqlCMV);
    const cmv = cmvRows[0]?.cmv || 0;
    // 3. Calcula o giro do estoque em porcentagem
    const giro = (cmv / totalEstoque) * 100;
    return parseFloat(giro.toFixed(2)); // retorna com 2 casas decimais
};
exports.calcularGiroEstoque = calcularGiroEstoque;
const getProdutosMaisVendidos = async (limit = 5 // retorna top 5 por padrão
) => {
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
    const [rows] = await database_1.db.query(sql, [limit]);
    return rows.map((row) => ({
        produto_id: row.produto_id,
        nome: row.nome,
        total_vendido: Number(row.total_vendido),
    }));
};
exports.getProdutosMaisVendidos = getProdutosMaisVendidos;
const contarProdutosQuantidadeBaixa = async () => {
    const sql = `
    SELECT COUNT(*) AS total
    FROM produtos
    WHERE quantidade <= 4
  `;
    const [rows] = await database_1.db.query(sql);
    const total = rows[0]?.total || 0;
    return total;
};
exports.contarProdutosQuantidadeBaixa = contarProdutosQuantidadeBaixa;
const getProdutosMelhorMargemLucro = async (limit = 5) => {
    const sql = `
    SELECT 
      id,
      nome,
      categoria,
      preco_custo,
      preco_venda,
      ROUND(((preco_venda - preco_custo) / preco_venda) * 100, 2) AS margem_lucro,
      ROUND(preco_venda - preco_custo, 2) AS lucro_unitario
    FROM produtos
    WHERE preco_venda > 0 AND preco_custo > 0
    ORDER BY margem_lucro DESC
    LIMIT ?
  `;
    const [rows] = await database_1.db.query(sql, [limit]);
    return rows.map((row) => ({
        id: row.id,
        nome: row.nome,
        categoria: row.categoria,
        preco_custo: Number(row.preco_custo),
        preco_venda: Number(row.preco_venda),
        margem_lucro: Number(row.margem_lucro),
        lucro_unitario: Number(row.lucro_unitario),
    }));
};
exports.getProdutosMelhorMargemLucro = getProdutosMelhorMargemLucro;
const getMargemLucroTotal = async () => {
    const sql = `
    SELECT 
      SUM(preco_venda * quantidade) AS receita_total,
      SUM(preco_custo * quantidade) AS custo_total,
      SUM((preco_venda - preco_custo) * quantidade) AS lucro_total,
      ROUND(
        (SUM((preco_venda - preco_custo) * quantidade) / SUM(preco_venda * quantidade)) * 100, 
        2
      ) AS margem_lucro_total
    FROM produtos
    WHERE preco_venda > 0 AND preco_custo > 0
  `;
    const [rows] = await database_1.db.query(sql);
    const row = rows[0];
    return {
        receita_total: Number(row.receita_total) || 0,
        custo_total: Number(row.custo_total) || 0,
        lucro_total: Number(row.lucro_total) || 0,
        margem_lucro_total: Number(row.margem_lucro_total) || 0,
    };
};
exports.getMargemLucroTotal = getMargemLucroTotal;
const getEvolucaoLucroMensal = async (meses = 12) => {
    const sql = `
    SELECT 
      DATE_FORMAT(v.data_venda, '%Y-%m') AS mes_ano,
      YEAR(v.data_venda) AS ano,
      MONTH(v.data_venda) AS mes,
      SUM(iv.quantidade * iv.preco_unitario) AS receita_mensal,
      SUM(iv.quantidade * p.preco_custo) AS custo_mensal,
      SUM(iv.quantidade * (iv.preco_unitario - p.preco_custo)) AS lucro_mensal,
      COUNT(DISTINCT v.id) AS quantidade_vendas,
      ROUND(
        (SUM(iv.quantidade * (iv.preco_unitario - p.preco_custo)) / SUM(iv.quantidade * iv.preco_unitario)) * 100,
        2
      ) AS margem_lucro_mensal
    FROM vendas v
    INNER JOIN itens_venda iv ON v.id = iv.venda_id
    INNER JOIN produtos p ON iv.produto_id = p.id
    WHERE v.status != 'cancelado'
      AND v.data_venda >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
    GROUP BY DATE_FORMAT(v.data_venda, '%Y-%m'), YEAR(v.data_venda), MONTH(v.data_venda)
    ORDER BY ano DESC, mes DESC
  `;
    const [rows] = await database_1.db.query(sql, [meses]);
    return rows.map((row) => ({
        mes: `${row.mes.toString().padStart(2, "0")}/${row.ano}`,
        ano: row.ano,
        lucro_mensal: Number(row.lucro_mensal) || 0,
        receita_mensal: Number(row.receita_mensal) || 0,
        custo_mensal: Number(row.custo_mensal) || 0,
        margem_lucro_mensal: Number(row.margem_lucro_mensal) || 0,
        quantidade_vendas: Number(row.quantidade_vendas) || 0,
    }));
};
exports.getEvolucaoLucroMensal = getEvolucaoLucroMensal;
const getValorInvestidoPorCategoria = async () => {
    const sql = `
    SELECT 
      COALESCE(categoria, 'Sem Categoria') AS categoria,
      SUM(preco_custo * quantidade) AS valor_investido,
      COUNT(*) AS quantidade_produtos,
      ROUND(AVG(preco_custo), 2) AS preco_medio_custo,
      ROUND(
        (SUM(preco_custo * quantidade) / (SELECT SUM(preco_custo * quantidade) FROM produtos WHERE preco_custo > 0)) * 100,
        2
      ) AS percentual_total
    FROM produtos
    WHERE preco_custo > 0
    GROUP BY categoria
    ORDER BY valor_investido DESC
  `;
    const [rows] = await database_1.db.query(sql);
    return rows.map((row) => ({
        categoria: row.categoria,
        valor_investido: Number(row.valor_investido) || 0,
        quantidade_produtos: Number(row.quantidade_produtos) || 0,
        percentual_total: Number(row.percentual_total) || 0,
        preco_medio_custo: Number(row.preco_medio_custo) || 0,
    }));
};
exports.getValorInvestidoPorCategoria = getValorInvestidoPorCategoria;
const getDistribuicaoMargemLucro = async () => {
    const sql = `
    SELECT 
      CASE 
        WHEN margem_lucro < 20 THEN '0-20%'
        WHEN margem_lucro < 40 THEN '20-40%'
        WHEN margem_lucro < 60 THEN '40-60%'
        WHEN margem_lucro < 80 THEN '60-80%'
        ELSE '80-100%'
      END AS faixa,
      COUNT(*) AS qtd,
      ROUND(AVG(margem_lucro), 2) AS margem_media
    FROM (
      SELECT 
        ROUND(((preco_venda - preco_custo) / preco_venda) * 100, 2) AS margem_lucro
      FROM produtos
      WHERE preco_venda > 0 AND preco_custo > 0
    ) AS margens
    GROUP BY 
      CASE 
        WHEN margem_lucro < 20 THEN '0-20%'
        WHEN margem_lucro < 40 THEN '20-40%'
        WHEN margem_lucro < 60 THEN '40-60%'
        WHEN margem_lucro < 80 THEN '60-80%'
        ELSE '80-100%'
      END
    ORDER BY 
      CASE faixa
        WHEN '0-20%' THEN 1
        WHEN '20-40%' THEN 2
        WHEN '40-60%' THEN 3
        WHEN '60-80%' THEN 4
        WHEN '80-100%' THEN 5
      END
  `;
    const [rows] = await database_1.db.query(sql);
    // Calcular total de produtos e margem média geral
    const totalProdutos = rows.reduce((total, row) => total + Number(row.qtd), 0);
    const margemMediaGeral = rows.reduce((total, row) => total + Number(row.margem_media) * Number(row.qtd), 0) / totalProdutos;
    const distribuicao = rows.map((row) => ({
        faixa: row.faixa,
        qtd: Number(row.qtd) || 0,
        percentual: totalProdutos > 0
            ? Number(((Number(row.qtd) / totalProdutos) * 100).toFixed(1))
            : 0,
        margem_media: Number(row.margem_media) || 0,
    }));
    return {
        distribuicao,
        total_produtos: totalProdutos,
        margem_media_geral: Number(margemMediaGeral.toFixed(2)),
    };
};
exports.getDistribuicaoMargemLucro = getDistribuicaoMargemLucro;
