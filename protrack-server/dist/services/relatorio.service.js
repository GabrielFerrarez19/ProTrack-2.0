"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelatorioCompleto = exports.getRelatorioEstoqueInvestimento = exports.getRelatorioLucroPeriodo = exports.getRelatorioLucroCategoria = exports.getRelatorioLucroProduto = void 0;
const database_1 = require("../config/database");
// Relatório de Lucro por Produto
const getRelatorioLucroProduto = async () => {
    const sql = `
    SELECT 
      p.id AS produto_id,
      p.nome,
      COALESCE(p.categoria, 'Sem Categoria') AS categoria,
      p.preco_custo,
      p.preco_venda,
      ROUND(p.preco_venda - p.preco_custo, 2) AS lucro_unitario,
      ROUND(((p.preco_venda - p.preco_custo) / p.preco_venda) * 100, 2) AS margem_lucro,
      p.quantidade AS quantidade_estoque,
      ROUND(p.preco_custo * p.quantidade, 2) AS valor_total_estoque,
      ROUND((p.preco_venda - p.preco_custo) * p.quantidade, 2) AS lucro_total_potencial
    FROM produtos p
    WHERE p.preco_venda > 0 AND p.preco_custo > 0
    ORDER BY margem_lucro DESC
  `;
    const [rows] = await database_1.db.query(sql);
    return rows.map((row) => ({
        produto_id: row.produto_id,
        nome: row.nome,
        categoria: row.categoria,
        preco_custo: Number(row.preco_custo),
        preco_venda: Number(row.preco_venda),
        lucro_unitario: Number(row.lucro_unitario),
        margem_lucro: Number(row.margem_lucro),
        quantidade_estoque: Number(row.quantidade_estoque),
        valor_total_estoque: Number(row.valor_total_estoque),
        lucro_total_potencial: Number(row.lucro_total_potencial),
    }));
};
exports.getRelatorioLucroProduto = getRelatorioLucroProduto;
// Relatório de Lucro por Categoria
const getRelatorioLucroCategoria = async () => {
    const sql = `
    SELECT 
      COALESCE(p.categoria, 'Sem Categoria') AS categoria,
      COUNT(*) AS quantidade_produtos,
      SUM(p.preco_custo * p.quantidade) AS valor_total_investido,
      SUM(p.preco_venda * p.quantidade) AS valor_total_venda,
      SUM((p.preco_venda - p.preco_custo) * p.quantidade) AS lucro_total,
      ROUND(AVG(((p.preco_venda - p.preco_custo) / p.preco_venda) * 100), 2) AS margem_lucro_media,
      ROUND(
        (SUM(p.preco_custo * p.quantidade) / (SELECT SUM(preco_custo * quantidade) FROM produtos WHERE preco_custo > 0)) * 100,
        2
      ) AS percentual_participacao
    FROM produtos p
    WHERE p.preco_venda > 0 AND p.preco_custo > 0
    GROUP BY p.categoria
    ORDER BY lucro_total DESC
  `;
    const [rows] = await database_1.db.query(sql);
    return rows.map((row) => ({
        categoria: row.categoria,
        quantidade_produtos: Number(row.quantidade_produtos),
        valor_total_investido: Number(row.valor_total_investido),
        valor_total_venda: Number(row.valor_total_venda),
        lucro_total: Number(row.lucro_total),
        margem_lucro_media: Number(row.margem_lucro_media),
        percentual_participacao: Number(row.percentual_participacao),
    }));
};
exports.getRelatorioLucroCategoria = getRelatorioLucroCategoria;
// Relatório de Lucro por Período
const getRelatorioLucroPeriodo = async (dataInicio, dataFim) => {
    const sql = `
    SELECT 
      DATE_FORMAT(v.data_venda, '%Y-%m') AS periodo,
      SUM(iv.quantidade * iv.preco_unitario) AS receita_total,
      SUM(iv.quantidade * p.preco_custo) AS custo_total,
      SUM(iv.quantidade * (iv.preco_unitario - p.preco_custo)) AS lucro_total,
      ROUND(
        (SUM(iv.quantidade * (iv.preco_unitario - p.preco_custo)) / SUM(iv.quantidade * iv.preco_unitario)) * 100,
        2
      ) AS margem_lucro,
      COUNT(DISTINCT v.id) AS quantidade_vendas,
      SUM(iv.quantidade) AS quantidade_produtos_vendidos
    FROM vendas v
    INNER JOIN itens_venda iv ON v.id = iv.venda_id
    INNER JOIN produtos p ON iv.produto_id = p.id
    WHERE v.status != 'cancelado'
      AND v.data_venda BETWEEN ? AND ?
    GROUP BY DATE_FORMAT(v.data_venda, '%Y-%m')
    ORDER BY periodo DESC
  `;
    const [rows] = await database_1.db.query(sql, [dataInicio, dataFim]);
    return rows.map((row) => ({
        periodo: row.periodo,
        receita_total: Number(row.receita_total) || 0,
        custo_total: Number(row.custo_total) || 0,
        lucro_total: Number(row.lucro_total) || 0,
        margem_lucro: Number(row.margem_lucro) || 0,
        quantidade_vendas: Number(row.quantidade_vendas) || 0,
        quantidade_produtos_vendidos: Number(row.quantidade_produtos_vendidos) || 0,
    }));
};
exports.getRelatorioLucroPeriodo = getRelatorioLucroPeriodo;
// Relatório de Estoque x Investimento
const getRelatorioEstoqueInvestimento = async () => {
    const sql = `
    SELECT 
      COALESCE(categoria, 'Sem Categoria') AS categoria,
      COUNT(*) AS quantidade_produtos,
      SUM(preco_custo * quantidade) AS valor_investido,
      SUM(preco_venda * quantidade) AS valor_potencial_venda,
      SUM((preco_venda - preco_custo) * quantidade) AS lucro_potencial,
      ROUND(AVG(((preco_venda - preco_custo) / preco_venda) * 100), 2) AS margem_lucro_media,
      ROUND(
        (SUM(preco_custo * quantidade) / (SELECT SUM(preco_custo * quantidade) FROM produtos WHERE preco_custo > 0)) * 100,
        2
      ) AS percentual_estoque
    FROM produtos
    WHERE preco_venda > 0 AND preco_custo > 0
    GROUP BY categoria
    ORDER BY valor_investido DESC
  `;
    const [rows] = await database_1.db.query(sql);
    return rows.map((row) => ({
        categoria: row.categoria,
        quantidade_produtos: Number(row.quantidade_produtos),
        valor_investido: Number(row.valor_investido),
        valor_potencial_venda: Number(row.valor_potencial_venda),
        lucro_potencial: Number(row.lucro_potencial),
        margem_lucro_media: Number(row.margem_lucro_media),
        percentual_estoque: Number(row.percentual_estoque),
    }));
};
exports.getRelatorioEstoqueInvestimento = getRelatorioEstoqueInvestimento;
// Relatório Completo
const getRelatorioCompleto = async (dataInicio, dataFim) => {
    // Buscar todos os dados necessários
    const [produtosMelhorMargem, categoriasLucro, evolucaoMensal, distribuicaoMargem, estoqueInvestimento,] = await Promise.all([
        (0, exports.getRelatorioLucroProduto)(),
        (0, exports.getRelatorioLucroCategoria)(),
        (0, exports.getRelatorioLucroPeriodo)(dataInicio, dataFim),
        getDistribuicaoMargemLucro(),
        (0, exports.getRelatorioEstoqueInvestimento)(),
    ]);
    // Calcular resumo geral
    const receitaTotal = categoriasLucro.reduce((total, cat) => total + cat.valor_total_venda, 0);
    const custoTotal = categoriasLucro.reduce((total, cat) => total + cat.valor_total_investido, 0);
    const lucroTotal = receitaTotal - custoTotal;
    const margemLucroGeral = receitaTotal > 0 ? (lucroTotal / receitaTotal) * 100 : 0;
    const quantidadeVendas = evolucaoMensal.reduce((total, periodo) => total + periodo.quantidade_vendas, 0);
    const quantidadeProdutos = produtosMelhorMargem.length;
    return {
        periodo: {
            inicio: dataInicio,
            fim: dataFim,
        },
        resumo: {
            receita_total: receitaTotal,
            custo_total: custoTotal,
            lucro_total: lucroTotal,
            margem_lucro_geral: Number(margemLucroGeral.toFixed(2)),
            quantidade_vendas: quantidadeVendas,
            quantidade_produtos: quantidadeProdutos,
        },
        produtos_melhor_margem: produtosMelhorMargem.slice(0, 10), // Top 10
        categorias_lucro: categoriasLucro,
        evolucao_mensal: evolucaoMensal,
        distribuicao_margem: distribuicaoMargem.distribuicao,
        estoque_investimento: estoqueInvestimento,
        contas_detalhadas: [], // Será implementado quando houver tabela de contas
    };
};
exports.getRelatorioCompleto = getRelatorioCompleto;
// Função auxiliar para buscar distribuição de margem (já existe no product.service.ts)
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
