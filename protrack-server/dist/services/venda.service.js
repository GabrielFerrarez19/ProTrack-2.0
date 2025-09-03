"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalVendasVencidasDb = exports.getVendasVencidasDb = exports.getFormasPagamento = exports.getVendasDashboard = exports.criarVendaDb = exports.getTotalVendasDb = exports.mapVendasComItens = exports.getAllVendasDb = exports.atualizarVendaDb = void 0;
const database_1 = require("../config/database");
const atualizarVendaDb = async (vendaId, dados, // ideal tipar com sua interface VendaForm
connection) => {
    await connection.beginTransaction();
    try {
        const updateFields = [];
        const updateValues = [];
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
            updateValues.push(dados.status.toLowerCase());
        }
        if (dados.formaPagamento) {
            updateFields.push("forma_pagamento = ?");
            updateValues.push(dados.formaPagamento);
        }
        // Atualiza dias_vencimento e data_vencimento (se existir coluna)
        if (dados.diasVencimento != null) {
            updateFields.push("dias_vencimento = ?");
            updateValues.push(Number(dados.diasVencimento));
            // calcula data_vencimento com base na data_venda (nova ou atual)
            const dataBase = dados.dataVenda || null;
            if (dataBase) {
                updateFields.push("data_vencimento = DATE_ADD(?, INTERVAL ? DAY)");
                updateValues.push(dataBase, Number(dados.diasVencimento));
            }
            else {
                // usar a data_venda atual da venda
                updateFields.push("data_vencimento = DATE_ADD(data_venda, INTERVAL ? DAY)");
                updateValues.push(Number(dados.diasVencimento));
            }
        }
        if (updateFields.length > 0) {
            const sql = `UPDATE vendas SET ${updateFields.join(", ")} WHERE id = ?`;
            updateValues.push(vendaId);
            await connection.query(sql, updateValues);
        }
        let novoTotal = 0;
        let totalComDesconto = 0;
        let clienteIdAtual = null;
        let statusAnterior = "";
        // Buscar dados da venda atual
        const [vendaAtualRows] = await connection.query(`SELECT cliente_id, status, total_com_desconto, total FROM vendas WHERE id = ?`, [vendaId]);
        const vendaAtual = vendaAtualRows[0];
        clienteIdAtual = dados.clienteId || vendaAtual?.cliente_id;
        statusAnterior = vendaAtual?.status || "";
        const totalAnteriorComDesconto = vendaAtual?.total_com_desconto || 0;
        // Atualizar produtos
        if (Array.isArray(dados.produtos) && dados.produtos.length > 0) {
            // Restaurar estoque dos itens antigos
            const [itensAntigos] = await connection.query(`SELECT produto_id, quantidade FROM itens_venda WHERE venda_id = ?`, [vendaId]);
            for (const item of itensAntigos) {
                await connection.query(`UPDATE produtos SET quantidade = quantidade + ? WHERE id = ?`, [item.quantidade, item.produto_id]);
            }
            // Deletar itens antigos
            await connection.query(`DELETE FROM itens_venda WHERE venda_id = ?`, [
                vendaId,
            ]);
            // Verificar estoque dos novos itens
            for (const item of dados.produtos) {
                const [rows] = await connection.query(`SELECT quantidade FROM produtos WHERE id = ?`, [item.produtoId]);
                const produto = rows[0];
                if (!produto ||
                    produto.quantidade < item.quantidade ||
                    item.quantidade <= 0) {
                    throw new Error(`Produto ${item.produtoId} sem estoque suficiente.`);
                }
            }
            // Inserir novos itens e atualizar estoque
            for (const item of dados.produtos) {
                const { produtoId, quantidade, precoUnitario, desconto = 0 } = item;
                const subtotal = quantidade * precoUnitario - desconto;
                novoTotal += subtotal;
                await connection.query(`INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario, desconto)
           VALUES (?, ?, ?, ?, ?)`, [vendaId, produtoId, quantidade, precoUnitario, Number(desconto)]);
                await connection.query(`UPDATE produtos SET quantidade = quantidade - ? WHERE id = ?`, [quantidade, produtoId]);
            }
        }
        else {
            novoTotal = vendaAtual?.total || 0;
            totalComDesconto = totalAnteriorComDesconto;
        }
        // Aplicar desconto percentual
        totalComDesconto = novoTotal;
        if (dados.desconto && Number(dados.desconto) > 0) {
            totalComDesconto = novoTotal * (1 - Number(dados.desconto) / 100);
        }
        // Atualizar valores na tabela vendas
        await connection.query(`UPDATE vendas SET total = ?, total_com_desconto = ? WHERE id = ?`, [novoTotal, totalComDesconto, vendaId]);
        // Atualizar valor a pagar do cliente
        if (clienteIdAtual) {
            const statusLower = (dados.status || "").toLowerCase();
            const statusAnteriorLower = statusAnterior.toLowerCase();
            if ((statusLower === "pago" && statusAnteriorLower !== "pago") ||
                (statusLower === "cancelado" && statusAnteriorLower !== "cancelado")) {
                await connection.query(`UPDATE clientes SET valor_a_pagar = valor_a_pagar - ? WHERE id = ?`, [totalComDesconto, clienteIdAtual]);
            }
            else {
                const [soma] = await connection.query(`SELECT SUM(total_com_desconto) as total_a_pagar 
           FROM vendas 
           WHERE cliente_id = ? AND status NOT IN ('pago', 'cancelado')`, [clienteIdAtual]);
                const valorAPagar = soma[0]?.total_a_pagar || 0;
                await connection.query(`UPDATE clientes SET valor_a_pagar = ? WHERE id = ?`, [valorAPagar, clienteIdAtual]);
            }
        }
        await connection.commit();
    }
    catch (error) {
        await connection.rollback();
        throw error;
    }
};
exports.atualizarVendaDb = atualizarVendaDb;
// Função que retorna todas as vendas com os itens
const getAllVendasDb = async () => {
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
      v.forma_pagamento, 
      v.dias_vencimento,
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
    WHERE v.status = 'pendente'
    ORDER BY v.id, iv.id;
  `;
    const [results] = await database_1.db.query(sql);
    return results;
};
exports.getAllVendasDb = getAllVendasDb;
// Função que organiza os dados em vendas com itens
const mapVendasComItens = (rows) => {
    const vendasMap = {};
    rows.forEach((row) => {
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
                forma_pagamento: row.forma_pagamento,
                dias_vencimento: row.dias_vencimento,
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
exports.mapVendasComItens = mapVendasComItens;
const getTotalVendasDb = async () => {
    const [rows] = await database_1.db.query("SELECT COUNT(*) AS totalVendas FROM vendas");
    return rows[0]?.totalVendas || 0;
};
exports.getTotalVendasDb = getTotalVendasDb;
const criarVendaDb = async (dados) => {
    if (!dados.produtos || dados.produtos.length === 0) {
        throw new Error("A venda precisa ter ao menos um produto.");
    }
    const connection = await database_1.db.getConnection();
    try {
        await connection.beginTransaction();
        // 1. Verificar estoque antes de inserir a venda
        for (const item of dados.produtos) {
            const [rows] = await connection.query(`SELECT quantidade FROM produtos WHERE id = ?`, [item.produtoId]);
            const produto = rows[0];
            if (!produto ||
                produto.quantidade < item.quantidade ||
                item.quantidade <= 0) {
                throw new Error(`Produto ${item.produtoId} sem estoque suficiente.`);
            }
        }
        // 2. Determinar forma de pagamento e status
        const formaPagamento = dados.formaPagamento?.toString().trim() || null;
        // Se for "aprazo", status será "pendente", caso contrário usa o status informado ou "pago"
        const statusVenda = formaPagamento === "aprazo" ? "pendente" : dados.status || "pago";
        // 3. Determinar dias_vencimento corretamente
        const diasVencimento = formaPagamento === "aprazo" ? dados.diasVencimento ?? null : null;
        // 4. Inserir a venda
        const [vendaResult] = await connection.execute(`
      INSERT INTO vendas 
      (cliente_id, data_venda, desconto, total, total_com_desconto, status, forma_pagamento, dias_vencimento)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
            dados.clienteId,
            dados.dataVenda,
            dados.desconto || 0,
            dados.total,
            dados.totalComDesconto,
            statusVenda,
            formaPagamento,
            diasVencimento, // <-- agora vai gravar corretamente
        ]);
        const vendaId = vendaResult.insertId;
        // 5. Inserir itens da venda e atualizar estoque
        for (const item of dados.produtos) {
            await connection.query(`INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario, desconto)
         VALUES (?, ?, ?, ?, ?)`, [
                vendaId,
                item.produtoId,
                item.quantidade,
                item.precoUnitario,
                item.desconto ?? 0,
            ]);
            await connection.query(`UPDATE produtos SET quantidade = quantidade - ? WHERE id = ?`, [item.quantidade, item.produtoId]);
        }
        // 6. Atualizar valor_a_pagar do cliente apenas se status não for "pago"
        if (statusVenda !== "pago") {
            const totalItens = dados.produtos.reduce((acc, item) => {
                const precoComDesconto = item.precoUnitario *
                    item.quantidade *
                    (1 - (item.desconto ?? 0) / 100);
                return acc + precoComDesconto;
            }, 0);
            await connection.query(`UPDATE clientes
         SET valor_a_pagar = IFNULL(valor_a_pagar, 0) + ?
         WHERE id = ?`, [totalItens, dados.clienteId]);
        }
        await connection.commit();
        return vendaId;
    }
    catch (error) {
        await connection.rollback();
        throw error;
    }
    finally {
        connection.release();
    }
};
exports.criarVendaDb = criarVendaDb;
const getVendasDashboard = async () => {
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
    const [resMesAtual] = await database_1.db.query(sqlMesAtual);
    const [resMesAnterior] = await database_1.db.query(sqlMesAnterior);
    const mesAtual = resMesAtual[0]?.total || 0;
    const mesAnterior = resMesAnterior[0]?.total || 0;
    const crescimento = mesAnterior === 0 ? 100 : ((mesAtual - mesAnterior) / mesAnterior) * 100;
    return {
        mesAtual,
        mesAnterior,
        crescimento: parseFloat(crescimento.toFixed(2)), // arredonda para 2 casas decimais
    };
};
exports.getVendasDashboard = getVendasDashboard;
const getFormasPagamento = async () => {
    const sql = `
    SELECT 
      forma_pagamento,
      COUNT(*) AS total
    FROM vendas
    WHERE status != 'cancelado'
    GROUP BY forma_pagamento
    ORDER BY total DESC
  `;
    const [rows] = await database_1.db.query(sql);
    return rows.map((row) => ({
        forma_pagamento: row.forma_pagamento,
        total: Number(row.total),
    }));
};
exports.getFormasPagamento = getFormasPagamento;
// Função que retorna todas as vendas vencidas
const getVendasVencidasDb = async () => {
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
      v.forma_pagamento, 
      v.dias_vencimento,
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
    WHERE v.status IN ('pendente', 'vencido')
    ORDER BY v.data_venda ASC, v.id, iv.id;
  `;
    const [results] = await database_1.db.query(sql);
    return results;
};
exports.getVendasVencidasDb = getVendasVencidasDb;
const getTotalVendasVencidasDb = async () => {
    const sql = `
    SELECT COALESCE(SUM(v.total_com_desconto), 0) AS total_vencido
    FROM vendas v
    WHERE v.status = 'vencido'
  `;
    const [rows] = await database_1.db.query(sql);
    return rows[0]?.total_vencido || 0;
};
exports.getTotalVendasVencidasDb = getTotalVendasVencidasDb;
