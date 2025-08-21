import { ResultSetHeader } from "mysql2";
import { db } from "../config/database";
import {
  CriarVendaData,
  FormaPagamentoCount,
  VendasDashboard,
} from "../@types/types.controller";

export const atualizarVendaDb = async (
  vendaId: number,
  dados: any,
  connection: any
) => {
  const updateFields: string[] = [];
  const updateValues: any[] = [];

  // Atualizar dados básicos da venda
  if (dados.clienteId != null) {
    updateFields.push("cliente_id = ?");
    updateValues.push(dados.clienteId);
  }
  if (dados.dataVenda) {
    updateFields.push("data_venda = ?");
    updateValues.push(dados.dataVenda);
  }
  if (dados.status) {
    updateFields.push("status = ?");
    updateValues.push(dados.status);
  }

  if (updateFields.length > 0) {
    const sql = `UPDATE vendas SET ${updateFields.join(", ")} WHERE id = ?`;
    updateValues.push(vendaId);
    await connection.query(sql, updateValues);
  }

  let novoTotal = 0;
  let totalComDesconto = 0;
  let clienteIdAtual: number | null = null;
  let statusAnterior = "";

  // Buscar dados da venda atual
  const [vendaAtualRows] = await connection.query(
    `SELECT cliente_id, status, total_com_desconto, total FROM vendas WHERE id = ?`,
    [vendaId]
  );
  const vendaAtual = (vendaAtualRows as any[])[0];
  clienteIdAtual = dados.clienteId || vendaAtual?.cliente_id;
  statusAnterior = vendaAtual?.status || "";
  const totalAnteriorComDesconto = vendaAtual?.total_com_desconto || 0;

  // Se houver produtos para atualizar
  if (Array.isArray(dados.produtos) && dados.produtos.length > 0) {
    // Restaurar estoque dos itens antigos
    const [itensAntigos] = await connection.query(
      `SELECT produto_id, quantidade FROM itens_venda WHERE venda_id = ?`,
      [vendaId]
    );

    for (const item of itensAntigos as any[]) {
      await connection.query(
        `UPDATE produtos SET quantidade = quantidade + ? WHERE id = ?`,
        [item.quantidade, item.produto_id]
      );
    }

    // Deletar itens antigos
    await connection.query(`DELETE FROM itens_venda WHERE venda_id = ?`, [
      vendaId,
    ]);

    // Verificar estoque dos novos itens antes de inserir
    for (const item of dados.produtos) {
      const [rows] = await connection.query(
        `SELECT quantidade FROM produtos WHERE id = ?`,
        [item.produtoId]
      );
      const produto = (rows as any[])[0];
      if (
        !produto ||
        produto.quantidade < item.quantidade ||
        item.quantidade <= 0
      ) {
        throw new Error(`Produto ${item.produtoId} sem estoque suficiente.`);
      }
    }

    // Inserir novos itens e atualizar estoque
    for (const item of dados.produtos) {
      const { produtoId, quantidade, precoUnitario, desconto = 0 } = item;
      const subtotal = quantidade * precoUnitario - desconto;
      novoTotal += subtotal;

      await connection.query(
        `INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario, desconto)
         VALUES (?, ?, ?, ?, ?)`,
        [vendaId, produtoId, quantidade, precoUnitario, Number(desconto)]
      );

      await connection.query(
        `UPDATE produtos SET quantidade = quantidade - ? WHERE id = ?`,
        [quantidade, produtoId]
      );
    }
  } else {
    novoTotal = vendaAtual?.total || 0;
    totalComDesconto = totalAnteriorComDesconto;
  }

  // Aplicar desconto geral, se houver
  totalComDesconto = novoTotal;
  if (dados.desconto && Number(dados.desconto) > 0) {
    totalComDesconto = novoTotal - Number(dados.desconto);
  }

  // Atualizar tabela vendas com os novos valores
  await connection.query(
    `UPDATE vendas SET total = ?, total_com_desconto = ? WHERE id = ?`,
    [novoTotal, totalComDesconto, vendaId]
  );

  // Atualizar valor a pagar do cliente
  if (clienteIdAtual) {
    if (
      (dados.status === "Pago" && statusAnterior !== "Pago") ||
      (dados.status === "Cancelado" && statusAnterior !== "Cancelado")
    ) {
      // Subtrai do valor a pagar se status mudar para Pago ou Cancelado
      await connection.query(
        `UPDATE clientes SET valor_a_pagar = valor_a_pagar - ? WHERE id = ?`,
        [totalComDesconto, clienteIdAtual]
      );
    } else {
      // Recalcula valor a pagar considerando apenas vendas não Pagas e não Canceladas
      const [soma] = await connection.query(
        `SELECT SUM(total_com_desconto) as total_a_pagar 
         FROM vendas 
         WHERE cliente_id = ? AND status NOT IN ('Pago', 'Cancelado')`,
        [clienteIdAtual]
      );
      const valorAPagar = (soma as any[])[0]?.total_a_pagar || 0;

      await connection.query(
        `UPDATE clientes SET valor_a_pagar = ? WHERE id = ?`,
        [valorAPagar, clienteIdAtual]
      );
    }
  }
};

// Função que retorna todas as vendas com os itens
export const getAllVendasDb = async () => {
  const sql = `
    SELECT 
      v.id AS venda_id,
      v.cliente_id,
      c.nome AS cliente_nome,
      v.data_venda,
      v.desconto AS venda_desconto,
      v.total,
      v.total_com_desconto,
      v.status,
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

  const [results]: any[] = await db.query(sql);
  return results;
};

// Função que organiza os dados em vendas com itens
export const mapVendasComItens = (rows: any[]) => {
  const vendasMap: Record<number, any> = {};

  rows.forEach((row: any) => {
    if (!vendasMap[row.venda_id]) {
      vendasMap[row.venda_id] = {
        id: row.venda_id,
        cliente_id: row.cliente_id,
        cliente_nome: row.cliente_nome,
        data_venda: row.data_venda,
        desconto: row.venda_desconto,
        total: row.total,
        total_com_desconto: row.total_com_desconto,
        status: row.status,
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

  return Object.values(vendasMap);
};

export const getTotalVendasDb = async (): Promise<number> => {
  const [rows] = await db.query("SELECT COUNT(*) AS totalVendas FROM vendas");
  return (rows as any)[0]?.totalVendas || 0;
};

export const criarVendaDb = async (dados: CriarVendaData): Promise<number> => {
  if (!dados.produtos || dados.produtos.length === 0) {
    throw new Error("A venda precisa ter ao menos um produto.");
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Verificar estoque antes de inserir a venda
    for (const item of dados.produtos) {
      const [rows] = await connection.query(
        `SELECT quantidade FROM produtos WHERE id = ?`,
        [item.produtoId]
      );
      const produto = (rows as any[])[0];
      if (
        !produto ||
        produto.quantidade < item.quantidade ||
        item.quantidade <= 0
      ) {
        throw new Error(`Produto ${item.produtoId} sem estoque suficiente.`);
      }
    }

    // 1. Inserir a venda
    const [vendaResult] = await connection.execute<ResultSetHeader>(
      `
      INSERT INTO vendas (cliente_id, data_venda, desconto, total, total_com_desconto, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [
        dados.clienteId,
        dados.dataVenda,
        dados.desconto || 0,
        dados.total,
        dados.totalComDesconto,
        dados.status || "pendente",
      ]
    );

    const vendaId = vendaResult.insertId;

    // 2. Inserir itens da venda e atualizar estoque
    for (const item of dados.produtos) {
      await connection.query(
        `INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario, desconto)
         VALUES (?, ?, ?, ?, ?)`,
        [
          vendaId,
          item.produtoId,
          item.quantidade,
          item.precoUnitario,
          item.desconto ?? 0,
        ]
      );

      await connection.query(
        `UPDATE produtos SET quantidade = quantidade - ? WHERE id = ?`,
        [item.quantidade, item.produtoId]
      );
    }

    // 3. Atualizar o valor_a_pagar do cliente
    const totalItens = dados.produtos.reduce((acc, item) => {
      const precoComDesconto =
        item.precoUnitario * item.quantidade * (1 - (item.desconto ?? 0) / 100);
      return acc + precoComDesconto;
    }, 0);

    await connection.query(
      `UPDATE clientes
       SET valor_a_pagar = IFNULL(valor_a_pagar, 0) + ?
       WHERE id = ?`,
      [totalItens, dados.clienteId]
    );

    await connection.commit();
    return vendaId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const getVendasDashboard = async (): Promise<VendasDashboard> => {
  const sqlMesAtual = `
    SELECT COALESCE(SUM(total_com_desconto), 0) AS total
    FROM vendas
    WHERE MONTH(data_venda) = MONTH(CURRENT_DATE())
      AND YEAR(data_venda) = YEAR(CURRENT_DATE())
      AND status != 'cancelado'
  `;

  const sqlMesAnterior = `
    SELECT COALESCE(SUM(total_com_desconto), 0) AS total
    FROM vendas
    WHERE MONTH(data_venda) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH)
      AND YEAR(data_venda) = YEAR(CURRENT_DATE() - INTERVAL 1 MONTH)
      AND status != 'cancelado'
  `;

  const [resMesAtual]: any = await db.query(sqlMesAtual);
  const [resMesAnterior]: any = await db.query(sqlMesAnterior);

  const mesAtual = resMesAtual[0]?.total || 0;
  const mesAnterior = resMesAnterior[0]?.total || 0;

  const crescimento =
    mesAnterior === 0 ? 100 : ((mesAtual - mesAnterior) / mesAnterior) * 100;

  return {
    mesAtual,
    mesAnterior,
    crescimento: parseFloat(crescimento.toFixed(2)), // arredonda para 2 casas decimais
  };
};

export const getFormasPagamento = async (): Promise<FormaPagamentoCount[]> => {
  const sql = `
    SELECT 
      forma_pagamento,
      COUNT(*) AS total
    FROM vendas
    WHERE status != 'cancelado'
    GROUP BY forma_pagamento
    ORDER BY total DESC
  `;

  const [rows]: any = await db.query(sql);

  return rows.map((row: any) => ({
    forma_pagamento: row.forma_pagamento,
    total: Number(row.total),
  }));
};
