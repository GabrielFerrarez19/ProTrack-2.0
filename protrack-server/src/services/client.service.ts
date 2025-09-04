import { db } from "../config/database";
import {
  registrarPagamento,
  getVendasPendentesComPagamento,
  getTotalPagoVenda,
} from "./pagamento.service";

export interface ClienteData {
  nome: string;
  dataNascimento: string; // YYYY-MM-DD
  cpf: string;
  rg?: string;
  estadoCivil?: string;
  sexo?: string;
  telefoneWhatsapp?: string;
  telefoneCelular?: string;
  telefoneResidencial?: string;
  email: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  valorAPagar?: number;
}

export const createClienteDb = async (
  cliente: ClienteData
): Promise<number> => {
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

  const [result]: any = await db.query(sql, values);
  return result.insertId;
};

export const updateClienteDb = async (
  id: number,
  cliente: ClienteData
): Promise<void> => {
  console.log("Iniciando updateClienteDb para cliente id:", id);

  // 1️⃣ Pega o valor atual do cliente antes de atualizar
  const [clienteAtualResult]: any = await db.query(
    "SELECT valor_a_pagar FROM clientes WHERE id = ?",
    [id]
  );

  if (!clienteAtualResult[0]) {
    console.log("Cliente não encontrado!");
    throw new Error("Cliente não encontrado");
  }

  const valorAtual = parseFloat(
    String(clienteAtualResult[0].valor_a_pagar ?? 0)
  );
  const valorFinalEnviado = parseFloat(String(cliente.valorAPagar ?? 0));

  // LÓGICA CORRIGIDA: O frontend envia o valor final calculado
  // Calculamos a diferença para saber quanto foi pago
  const valorPago = Math.round((valorAtual - valorFinalEnviado) * 100) / 100;

  console.log("Valor atual do cliente:", valorAtual);
  console.log("Valor final enviado pelo frontend:", valorFinalEnviado);
  console.log("Valor pago calculado:", valorPago);

  // 2️⃣ Atualiza os dados do cliente (SEM o valor_a_pagar - será atualizado depois)
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
      cidade = ?
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
    id,
  ];
  const [result]: any = await db.query(sqlUpdateCliente, values);
  console.log("Cliente atualizado com sucesso.");

  // 3️⃣ Busca vendas pendentes com histórico de pagamentos
  const vendasComPagamento = await getVendasPendentesComPagamento(id);
  console.log("Vendas pendentes encontradas:", vendasComPagamento.length);

  // 4️⃣ LÓGICA DE STATUS: Processa vendas pendentes baseado no valor pago
  let valorRestante = valorFinalEnviado;
  let valorPagoRestante = valorPago;

  console.log("=== INICIANDO SISTEMA DE PAGAMENTO POR PARTES ===");
  console.log(`Valor pago total: R$ ${valorPago.toFixed(2)}`);
  console.log(`Vendas pendentes encontradas: ${vendasComPagamento.length}`);

  if (vendasComPagamento.length > 0 && valorPago > 0) {
    // 1. Registra o pagamento no histórico
    const pagamentoId = await registrarPagamento({
      cliente_id: id,
      valor_pago: valorPago,
      observacoes: `Pagamento parcial - Valor total pago: R$ ${valorPago.toFixed(
        2
      )}`,
    });
    console.log(`✅ Pagamento registrado no histórico (ID: ${pagamentoId})`);

    // 2. Processa vendas em ordem cronológica (mais antigas primeiro)
    for (let i = 0; i < vendasComPagamento.length; i++) {
      const venda = vendasComPagamento[i];
      const valorVenda = parseFloat(String(venda.total_com_desconto));
      const totalPagoVenda = parseFloat(String(venda.total_pago));
      const valorRestanteVenda = parseFloat(String(venda.valor_restante));

      console.log(`\n--- Processando Venda ID: ${venda.id} ---`);
      console.log(`Valor total da venda: R$ ${valorVenda.toFixed(2)}`);
      console.log(`Total já pago: R$ ${totalPagoVenda.toFixed(2)}`);
      console.log(`Valor restante: R$ ${valorRestanteVenda.toFixed(2)}`);
      console.log(`Valor pago disponível: R$ ${valorPagoRestante.toFixed(2)}`);

      if (valorPagoRestante > 0) {
        // Calcula quanto pode ser aplicado nesta venda
        const valorAplicar = Math.min(valorPagoRestante, valorRestanteVenda);

        if (valorAplicar > 0) {
          // Registra pagamento específico para esta venda
          await registrarPagamento({
            cliente_id: id,
            venda_id: venda.id,
            valor_pago: valorAplicar,
            observacoes: `Pagamento aplicado à venda ID ${venda.id}`,
          });

          console.log(
            `✅ R$ ${valorAplicar.toFixed(2)} aplicado à venda ID ${venda.id}`
          );
          valorPagoRestante =
            Math.round((valorPagoRestante - valorAplicar) * 100) / 100;

          // Verifica se a venda foi totalmente paga
          const novoTotalPago = totalPagoVenda + valorAplicar;
          if (novoTotalPago >= valorVenda) {
            // Marca a venda como paga
            const sqlUpdateVenda = `
              UPDATE vendas SET status = 'pago'
              WHERE id = ?
            `;
            const [updateResult]: any = await db.query(sqlUpdateVenda, [
              venda.id,
            ]);

            if (updateResult.affectedRows > 0) {
              console.log(`🎉 VENDA ID ${venda.id} TOTALMENTE PAGA!`);
            }
          } else {
            console.log(
              `📝 Venda ID ${
                venda.id
              } parcialmente paga (R$ ${novoTotalPago.toFixed(
                2
              )}/${valorVenda.toFixed(2)})`
            );
          }
        }
      } else {
        console.log(`💰 Valor pago esgotado`);
        break;
      }
    }

    console.log(`\n=== RESUMO DO PROCESSAMENTO ===`);
    console.log(`Valor pago inicial: R$ ${valorPago.toFixed(2)}`);
    console.log(`Valor pago restante: R$ ${valorPagoRestante.toFixed(2)}`);
    console.log(`Valor a pagar final: R$ ${valorFinalEnviado.toFixed(2)}`);
  } else if (valorPago <= 0) {
    console.log("Nenhum pagamento realizado (valor pago <= 0)");
    console.log("Todas as vendas permanecem com status atual");
  } else {
    console.log("Nenhuma venda pendente encontrada");
  }

  // 5️⃣ Atualiza o valor_a_pagar do cliente após aplicar os pagamentos
  const valorFinal = Math.round(valorRestante * 100) / 100;
  console.log("Valor final calculado:", valorFinal);
  console.log("Valor restante original:", valorRestante);
  const sqlAtualizaSaldo = `
    UPDATE clientes SET valor_a_pagar = ?
    WHERE id = ?
  `;
  console.log("Executando query SQL:", sqlAtualizaSaldo);
  console.log("Parâmetros:", [valorFinal, id]);
  const [updateResult]: any = await db.query(sqlAtualizaSaldo, [
    valorFinal,
    id,
  ]);
  console.log("Resultado da atualização:", updateResult);
  console.log("Valor a pagar do cliente atualizado para:", valorFinal);

  // Verifica se a atualização foi bem-sucedida
  if (updateResult.affectedRows > 0) {
    console.log(
      "✅ Atualização bem-sucedida! Linhas afetadas:",
      updateResult.affectedRows
    );
  } else {
    console.log("❌ ERRO: Nenhuma linha foi atualizada!");
  }

  // Verifica o valor atual no banco após a atualização
  const [verificacao]: any = await db.query(
    "SELECT valor_a_pagar FROM clientes WHERE id = ?",
    [id]
  );
  console.log(
    "Valor atual no banco após atualização:",
    verificacao[0]?.valor_a_pagar
  );

  console.log("Processamento concluído para cliente id:", id); // Corrigido: precisão decimal e concatenação
};

export const getTotalClientesDb = async (): Promise<number> => {
  const sql = "SELECT COUNT(*) AS totalClientes FROM clientes";
  const [rows]: any = await db.query(sql);

  return rows[0].totalClientes || 0;
};

export const getAllClientesDb = async (): Promise<any[]> => {
  const sql = "SELECT * FROM clientes";
  const [rows]: any = await db.query(sql);

  return rows;
};

export const getVendasByClienteId = async (
  idCliente: number
): Promise<any[]> => {
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

  const [rows]: any = await db.query(sql, [idCliente]);
  return rows;
};

// Retorna a soma do total_a_pagar de todos os clientes
export const getTotalAPagarGeral = async (): Promise<number> => {
  const sql = `
    SELECT SUM(c.valor_a_pagar) AS total_geral
    FROM clientes c;
  `;
  const [rows]: any = await db.query(sql);
  return rows[0]?.total_geral || 0;
};

// Conta quantos clientes possuem valor_a_pagar em aberto (> 0)
export const getClientesEmAbertoCountDb = async (): Promise<number> => {
  const sql = `
    SELECT COUNT(*) AS total
    FROM clientes
    WHERE COALESCE(valor_a_pagar, 0) > 0;
  `;
  const [rows]: any = await db.query(sql);
  return rows[0]?.total || 0;
};
