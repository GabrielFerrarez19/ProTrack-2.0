"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientesEmAbertoCountDb = exports.getTotalAPagarGeral = exports.getVendasByClienteId = exports.getAllClientesDb = exports.getTotalClientesDb = exports.updateClienteDb = exports.createClienteDb = void 0;
const database_1 = require("../config/database");
const createClienteDb = async (cliente) => {
    const sql = `
    INSERT INTO clientes (
      nome, data_nascimento, cpf, rg, estado_civil, sexo,
      telefone_whatsapp, telefone_celular, telefone_residencial,
      email, cep, endereco, numero, complemento, bairro, cidade
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
    const values = [
        cliente.nome,
        cliente.dataNascimento,
        cliente.cpf,
        cliente.rg || null,
        cliente.estadoCivil || null,
        cliente.sexo || null,
        cliente.telefoneWhatsapp || null,
        cliente.telefoneCelular || null,
        cliente.telefoneResidencial || null,
        cliente.email,
        cliente.cep || null,
        cliente.endereco || null,
        cliente.numero || null,
        cliente.complemento || null,
        cliente.bairro || null,
        cliente.cidade || null,
    ];
    const [result] = await database_1.db.query(sql, values);
    return result.insertId;
};
exports.createClienteDb = createClienteDb;
const updateClienteDb = async (id, cliente) => {
    console.log("Iniciando updateClienteDb para cliente id:", id);
    // 1️⃣ Pega o valor atual do cliente antes de atualizar
    const [clienteAtualResult] = await database_1.db.query("SELECT valor_a_pagar FROM clientes WHERE id = ?", [id]);
    if (!clienteAtualResult[0]) {
        console.log("Cliente não encontrado!");
        throw new Error("Cliente não encontrado");
    }
    const valorAtual = clienteAtualResult[0].valor_a_pagar ?? 0;
    const valorNovoPagamento = cliente.valorAPagar ?? 0;
    const novoValorAPagar = valorAtual + valorNovoPagamento;
    console.log("Valor atual do cliente:", valorAtual);
    console.log("Novo pagamento recebido:", valorNovoPagamento);
    console.log("Valor total disponível após pagamento:", novoValorAPagar);
    // 2️⃣ Atualiza os dados do cliente com o valor acumulado
    const sqlUpdateCliente = `
    UPDATE clientes SET 
      nome = ?, 
      data_nascimento = ?, 
      cpf = ?, 
      rg = ?, 
      estado_civil = ?, 
      sexo = ?, 
      telefone_whatsapp = ?, 
      telefone_celular = ?, 
      telefone_residencial = ?, 
      email = ?, 
      cep = ?, 
      endereco = ?, 
      numero = ?, 
      complemento = ?, 
      bairro = ?, 
      cidade = ?,
      valor_a_pagar = ?
    WHERE id = ?
  `;
    const values = [
        cliente.nome,
        cliente.dataNascimento,
        cliente.cpf,
        cliente.rg || null,
        cliente.estadoCivil || null,
        cliente.sexo || null,
        cliente.telefoneWhatsapp || null,
        cliente.telefoneCelular || null,
        cliente.telefoneResidencial || null,
        cliente.email,
        cliente.cep || null,
        cliente.endereco || null,
        cliente.numero || null,
        cliente.complemento || null,
        cliente.bairro || null,
        cliente.cidade || null,
        novoValorAPagar,
        id,
    ];
    const [result] = await database_1.db.query(sqlUpdateCliente, values);
    console.log("Cliente atualizado com sucesso.");
    // 3️⃣ Busca todas as vendas pendentes/aprazo/vencidas
    const sqlGetVendas = `
    SELECT id, total_com_desconto, status
    FROM vendas
    WHERE cliente_id = ? AND status IN ('pendente', 'aprazo', 'vencido')
    ORDER BY data_venda ASC
  `;
    const [vendas] = await database_1.db.query(sqlGetVendas, [id]);
    console.log("Vendas pendentes encontradas:", vendas.length);
    // 4️⃣ Itera pelas vendas e marca como 'pago' se houver saldo suficiente
    let valorRestante = novoValorAPagar;
    for (const venda of vendas) {
        console.log(`Verificando venda id: ${venda.id}, total: ${venda.total_com_desconto}, status: ${venda.status}`);
        if (valorRestante >= venda.total_com_desconto) {
            const sqlUpdateVenda = `
        UPDATE vendas SET status = 'pago'
        WHERE id = ?
      `;
            const [updateResult] = await database_1.db.query(sqlUpdateVenda, [venda.id]);
            console.log(`Venda id ${venda.id} atualizada para 'pago'. AffectedRows:`, updateResult.affectedRows);
            valorRestante -= venda.total_com_desconto;
            console.log("Valor restante após pagar venda:", valorRestante);
        }
        else {
            console.log(`Saldo insuficiente para venda id ${venda.id}. Parando atualização.`);
            break;
        }
    }
    // 5️⃣ Atualiza o valor_a_pagar do cliente após aplicar os pagamentos
    const sqlAtualizaSaldo = `
    UPDATE clientes SET valor_a_pagar = ?
    WHERE id = ?
  `;
    await database_1.db.query(sqlAtualizaSaldo, [valorRestante, id]);
    console.log("Valor a pagar do cliente atualizado para:", valorRestante);
    console.log("Processamento concluído para cliente id:", id);
};
exports.updateClienteDb = updateClienteDb;
const getTotalClientesDb = async () => {
    const sql = "SELECT COUNT(*) AS totalClientes FROM clientes";
    const [rows] = await database_1.db.query(sql);
    return rows[0].totalClientes || 0;
};
exports.getTotalClientesDb = getTotalClientesDb;
const getAllClientesDb = async () => {
    const sql = "SELECT * FROM clientes";
    const [rows] = await database_1.db.query(sql);
    return rows;
};
exports.getAllClientesDb = getAllClientesDb;
const getVendasByClienteId = async (idCliente) => {
    const sql = `
    SELECT v.id,
           v.data_venda,
           v.total,
           v.total_com_desconto,
           (v.total - v.total_com_desconto) AS desconto,
           v.status,
           c.nome AS cliente_nome
    FROM vendas v
    INNER JOIN clientes c ON v.cliente_id = c.id
    WHERE v.cliente_id = ?;
  `;
    const [rows] = await database_1.db.query(sql, [idCliente]);
    return rows;
};
exports.getVendasByClienteId = getVendasByClienteId;
// Retorna a soma do total_a_pagar de todos os clientes
const getTotalAPagarGeral = async () => {
    const sql = `
    SELECT SUM(c.valor_a_pagar) AS total_geral
    FROM clientes c;
  `;
    const [rows] = await database_1.db.query(sql);
    return rows[0]?.total_geral || 0;
};
exports.getTotalAPagarGeral = getTotalAPagarGeral;
// Conta quantos clientes possuem valor_a_pagar em aberto (> 0)
const getClientesEmAbertoCountDb = async () => {
    const sql = `
    SELECT COUNT(*) AS total
    FROM clientes
    WHERE COALESCE(valor_a_pagar, 0) > 0;
  `;
    const [rows] = await database_1.db.query(sql);
    return rows[0]?.total || 0;
};
exports.getClientesEmAbertoCountDb = getClientesEmAbertoCountDb;
