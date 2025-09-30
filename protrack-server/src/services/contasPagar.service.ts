import { db } from "../config/database";
import {
  ContaPagarCreateRequest,
  ContaPagarUpdateRequest,
  ContaPagarFiltros,
  FornecedorCreateRequest,
  FornecedorUpdateRequest,
  ContaPagarResponse,
  FornecedorResponse,
  ContaPagarResumoResponse,
} from "../@types/contasPagar.types";

// ===== UTILITÁRIOS =====

const gerarUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const formatarContaPagarResponse = (conta: any): ContaPagarResponse => {
  const hoje = new Date();
  const dataVencimento = new Date(conta.data_vencimento);
  const diasAtraso = Math.max(
    0,
    Math.floor(
      (hoje.getTime() - dataVencimento.getTime()) / (1000 * 60 * 60 * 24)
    )
  );

  return {
    id: conta.id,
    fornecedor_id: conta.fornecedor_id,
    fornecedor_nome: conta.fornecedor_nome,
    valor: Number(conta.valor),
    data_vencimento: conta.data_vencimento,
    status: conta.status || "pendente",
    categoria_id: conta.categoria_id || "",
    categoria_nome: conta.categoria_nome || "Sem categoria",
    descricao: conta.descricao,
    data_agendamento: conta.data_agendamento,
    data_pagamento: conta.data_pagamento,
    valor_pago: conta.valor_pago ? Number(conta.valor_pago) : 0,
    forma_pagamento: conta.forma_pagamento,
    observacoes: conta.observacoes,
    dias_atraso: diasAtraso,
    criado_em: conta.criado_em
      ? conta.criado_em.toISOString()
      : new Date().toISOString(),
    atualizado_em: conta.atualizado_em
      ? conta.atualizado_em.toISOString()
      : new Date().toISOString(),
  };
};

const formatarFornecedorResponse = (fornecedor: any): FornecedorResponse => {
  return {
    id: fornecedor.id,
    nome: fornecedor.nome,
    cnpj: fornecedor.cnpj,
    email: fornecedor.email,
    telefone: fornecedor.telefone,
    endereco: fornecedor.endereco,
    ativo: fornecedor.ativo,
    criado_em: fornecedor.criado_em,
    atualizado_em: fornecedor.atualizado_em,
  };
};

// ===== CONTAS A PAGAR =====

export const criarConta = async (
  data: ContaPagarCreateRequest
): Promise<ContaPagarResponse> => {
  try {
    const id = gerarUUID();
    const hoje = new Date();

    const query = `
      INSERT INTO contas_pagar (
        id, fornecedor_id, fornecedor_nome, valor, data_vencimento,
        status, categoria_id, descricao, observacoes, criado_em, atualizado_em
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      id,
      data.fornecedor_id || null,
      data.fornecedor_nome,
      data.valor,
      data.data_vencimento,
      "pendente", // Status padrão
      data.categoria_id || null,
      data.descricao,
      data.observacoes || null,
      hoje,
      hoje,
    ];

    await db.execute(query, params);

    // Buscar a conta criada
    const conta = await buscarContaPorId(id);
    if (!conta) {
      throw new Error("Erro ao criar conta");
    }
    return conta;
  } catch (error) {
    console.error("Erro ao criar conta:", error);
    throw error;
  }
};

export const listarContas = async (
  filtros: ContaPagarFiltros = {}
): Promise<ContaPagarResponse[]> => {
  try {
    let query = `
      SELECT 
        cp.*,
        COALESCE(c.nome, 'Sem categoria') as categoria_nome
      FROM contas_pagar cp
      LEFT JOIN categorias c ON cp.categoria_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];

    // Filtro padrão: excluir apenas contas pagas, canceladas e arquivadas
    // Contas vencidas devem aparecer por padrão (são parte do total pendente)
    if (!filtros.status || filtros.status === "todos") {
      query += " AND cp.status NOT IN ('pago', 'cancelado', 'arquivado')";
    }

    if (filtros.search) {
      query +=
        " AND (cp.fornecedor_nome LIKE ? OR cp.descricao LIKE ? OR cp.observacoes LIKE ?)";
      const searchTerm = `%${filtros.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filtros.status && filtros.status !== "todos") {
      query += " AND cp.status = ?";
      params.push(filtros.status);
    }

    if (filtros.categoria_id && filtros.categoria_id !== "todas") {
      query += " AND cp.categoria_id = ?";
      params.push(filtros.categoria_id);
    }

    if (filtros.data_inicio) {
      query += " AND cp.data_vencimento >= ?";
      params.push(filtros.data_inicio);
    }

    if (filtros.data_fim) {
      query += " AND cp.data_vencimento <= ?";
      params.push(filtros.data_fim);
    }

    if (filtros.fornecedor_id) {
      query += " AND cp.fornecedor_id = ?";
      params.push(filtros.fornecedor_id);
    }

    query += " ORDER BY cp.data_vencimento ASC";

    const [rows] = await db.execute(query, params);
    return (rows as any[]).map((conta) => formatarContaPagarResponse(conta));
  } catch (error) {
    console.error("Erro ao listar contas:", error);
    throw error;
  }
};

export const buscarContaPorId = async (
  id: string
): Promise<ContaPagarResponse | null> => {
  try {
    const query = `
      SELECT 
        cp.*,
        COALESCE(c.nome, 'Sem categoria') as categoria_nome
      FROM contas_pagar cp
      LEFT JOIN categorias c ON cp.categoria_id = c.id
      WHERE cp.id = ?
    `;
    const [rows] = await db.execute(query, [id]);
    const contas = rows as any[];

    if (contas.length === 0) {
      return null;
    }

    return formatarContaPagarResponse(contas[0]);
  } catch (error) {
    console.error("Erro ao buscar conta por ID:", error);
    throw error;
  }
};

export const atualizarConta = async (
  id: string,
  data: ContaPagarUpdateRequest
): Promise<ContaPagarResponse> => {
  try {
    const hoje = new Date();
    const updates: string[] = [];
    const params: any[] = [];

    if (data.fornecedor_id !== undefined) {
      updates.push("fornecedor_id = ?");
      params.push(data.fornecedor_id);
    }

    if (data.fornecedor_nome !== undefined) {
      updates.push("fornecedor_nome = ?");
      params.push(data.fornecedor_nome);
    }

    if (data.valor !== undefined) {
      updates.push("valor = ?");
      params.push(data.valor);
    }

    if (data.data_vencimento !== undefined) {
      updates.push("data_vencimento = ?");
      params.push(data.data_vencimento);
    }

    // Status não é editável via update - apenas via marcarComoPaga

    if (data.categoria_id !== undefined) {
      updates.push("categoria_id = ?");
      params.push(data.categoria_id);
    }

    if (data.descricao !== undefined) {
      updates.push("descricao = ?");
      params.push(data.descricao);
    }

    if (data.observacoes !== undefined) {
      updates.push("observacoes = ?");
      params.push(data.observacoes);
    }

    updates.push("atualizado_em = ?");
    params.push(hoje);

    if (updates.length === 1) {
      throw new Error("Nenhum campo para atualizar");
    }

    params.push(id);

    const query = `
      UPDATE contas_pagar 
      SET ${updates.join(", ")} 
      WHERE id = ?
    `;

    await db.execute(query, params);

    // Buscar a conta atualizada
    const conta = await buscarContaPorId(id);
    if (!conta) {
      throw new Error("Erro ao atualizar conta");
    }
    return conta;
  } catch (error) {
    console.error("Erro ao atualizar conta:", error);
    throw error;
  }
};

export const excluirConta = async (id: string): Promise<boolean> => {
  try {
    const query = "DELETE FROM contas_pagar WHERE id = ?";
    const [result] = await db.execute(query, [id]);
    return (result as any).affectedRows > 0;
  } catch (error) {
    console.error("Erro ao excluir conta:", error);
    throw error;
  }
};

export const marcarComoPaga = async (
  id: string,
  data: { valor_pago: number; forma_pagamento: string }
): Promise<ContaPagarResponse> => {
  try {
    const hoje = new Date();

    const query = `
      UPDATE contas_pagar 
      SET status = 'pago', valor_pago = ?, data_pagamento = ?, 
          forma_pagamento = ?, atualizado_em = ? 
      WHERE id = ?
    `;

    await db.execute(query, [
      data.valor_pago,
      hoje,
      data.forma_pagamento,
      hoje,
      id,
    ]);

    // Buscar a conta atualizada
    const conta = await buscarContaPorId(id);
    if (!conta) {
      throw new Error("Erro ao marcar conta como paga");
    }
    return conta;
  } catch (error) {
    console.error("Erro ao marcar conta como paga:", error);
    throw error;
  }
};

export const obterResumo = async (): Promise<ContaPagarResumoResponse> => {
  try {
    // Total pendente deve incluir contas pendentes, vencidas E agendadas (todas precisam ser pagas)
    const [pendentesResult] = await db.execute(
      "SELECT COALESCE(SUM(valor), 0) as total FROM contas_pagar WHERE status IN ('pendente', 'vencido', 'agendado')"
    );

    const [vencidasResult] = await db.execute(
      "SELECT COALESCE(SUM(valor), 0) as total FROM contas_pagar WHERE status = 'vencido'"
    );

    const [agendadasResult] = await db.execute(
      "SELECT COALESCE(SUM(valor), 0) as total FROM contas_pagar WHERE status = 'agendado'"
    );

    const [pagasResult] = await db.execute(
      "SELECT COALESCE(SUM(valor), 0) as total FROM contas_pagar WHERE status = 'pago'"
    );

    const [totalContasResult] = await db.execute(
      "SELECT COUNT(*) as total FROM contas_pagar"
    );

    const [contasVencidasResult] = await db.execute(
      "SELECT COUNT(*) as total FROM contas_pagar WHERE status = 'vencido'"
    );

    // Calcular contas que vencem hoje
    const hoje = new Date();
    const hojeStr = hoje.toISOString().split("T")[0];

    const [contasVencemHojeResult] = await db.execute(
      "SELECT COALESCE(SUM(valor), 0) as total FROM contas_pagar WHERE DATE(data_vencimento) = ? AND status IN ('pendente', 'agendado', 'vencido')",
      [hojeStr]
    );

    // Calcular contas que vencem nos próximos 7 dias
    const proximos7Dias = new Date();
    proximos7Dias.setDate(hoje.getDate() + 7);
    const proximos7DiasStr = proximos7Dias.toISOString().split("T")[0];

    const [contasProximos7DiasResult] = await db.execute(
      "SELECT COALESCE(SUM(valor), 0) as total FROM contas_pagar WHERE DATE(data_vencimento) BETWEEN ? AND ? AND status IN ('pendente', 'agendado', 'vencido')",
      [hojeStr, proximos7DiasStr]
    );

    const pendentes = (pendentesResult as any[])[0];
    const vencidas = (vencidasResult as any[])[0];
    const agendadas = (agendadasResult as any[])[0];
    const pagas = (pagasResult as any[])[0];
    const totalContas = (totalContasResult as any[])[0];
    const contasVencidas = (contasVencidasResult as any[])[0];
    const contasVencemHoje = (contasVencemHojeResult as any[])[0];
    const contasProximos7Dias = (contasProximos7DiasResult as any[])[0];

    const resumo = {
      total_pendente: Number(pendentes?.total || 0),
      total_vencido: Number(vencidas?.total || 0),
      total_agendado: Number(agendadas?.total || 0),
      total_pago: Number(pagas?.total || 0),
      total_contas: Number(totalContas?.total || 0),
      contas_vencidas_count: Number(contasVencidas?.total || 0),
      total_vence_hoje: Number(contasVencemHoje?.total || 0),
      total_proximos_7_dias: Number(contasProximos7Dias?.total || 0),
    };

    return resumo;
  } catch (error) {
    console.error("Erro ao obter resumo:", error);
    throw error;
  }
};

export const atualizarStatusContas = async (): Promise<void> => {
  try {
    const hoje = new Date();
    const hojeStr = hoje.toISOString().split("T")[0];

    // Atualizar contas vencidas
    await db.execute(
      "UPDATE contas_pagar SET status = 'vencido' WHERE data_vencimento < ? AND status = 'pendente'",
      [hojeStr]
    );

    console.log("Status das contas atualizado com sucesso");
  } catch (error) {
    console.error("Erro ao atualizar status das contas:", error);
    throw error;
  }
};

export const buscarContasVencimento = async (): Promise<{
  contasVencemHoje: ContaPagarResponse[];
  contasProximos7Dias: ContaPagarResponse[];
}> => {
  try {
    const hoje = new Date();
    const hojeStr = hoje.toISOString().split("T")[0];

    // Contas que vencem hoje
    const [contasVencemHojeResult] = await db.execute(
      `
      SELECT 
        cp.*,
        COALESCE(c.nome, 'Sem categoria') as categoria_nome
      FROM contas_pagar cp
      LEFT JOIN categorias c ON cp.categoria_id = c.id
      WHERE DATE(cp.data_vencimento) = ? 
      AND cp.status IN ('pendente', 'agendado', 'vencido')
      ORDER BY cp.valor DESC
    `,
      [hojeStr]
    );

    // Contas que vencem nos próximos 7 dias
    const proximos7Dias = new Date();
    proximos7Dias.setDate(hoje.getDate() + 7);
    const proximos7DiasStr = proximos7Dias.toISOString().split("T")[0];

    const [contasProximos7DiasResult] = await db.execute(
      `
      SELECT 
        cp.*,
        COALESCE(c.nome, 'Sem categoria') as categoria_nome
      FROM contas_pagar cp
      LEFT JOIN categorias c ON cp.categoria_id = c.id
      WHERE DATE(cp.data_vencimento) BETWEEN ? AND ? 
      AND cp.status IN ('pendente', 'agendado', 'vencido')
      ORDER BY cp.data_vencimento ASC, cp.valor DESC
    `,
      [hojeStr, proximos7DiasStr]
    );

    const contasVencemHoje = (contasVencemHojeResult as any[]).map((conta) =>
      formatarContaPagarResponse(conta)
    );

    const contasProximos7Dias = (contasProximos7DiasResult as any[]).map(
      (conta) => formatarContaPagarResponse(conta)
    );

    return {
      contasVencemHoje,
      contasProximos7Dias,
    };
  } catch (error) {
    console.error("Erro ao buscar contas por vencimento:", error);
    throw error;
  }
};

// ===== FORNECEDORES =====

export const criarFornecedor = async (
  data: FornecedorCreateRequest
): Promise<FornecedorResponse> => {
  try {
    const id = gerarUUID();
    const hoje = new Date();

    const query = `
      INSERT INTO fornecedores (
        id, nome, cnpj, email, telefone, endereco, ativo, 
        criado_em, atualizado_em
      ) VALUES (?, ?, ?, ?, ?, ?, true, ?, ?)
    `;

    const params = [
      id,
      data.nome,
      data.cnpj || null,
      data.email || null,
      data.telefone || null,
      data.endereco || null,
      hoje,
      hoje,
    ];

    await db.execute(query, params);

    // Buscar o fornecedor criado
    const fornecedor = await buscarFornecedorPorId(id);
    if (!fornecedor) {
      throw new Error("Erro ao criar fornecedor");
    }
    return fornecedor;
  } catch (error) {
    console.error("Erro ao criar fornecedor:", error);
    throw error;
  }
};

export const listarFornecedores = async (): Promise<FornecedorResponse[]> => {
  try {
    const query = `
      SELECT * FROM fornecedores 
      WHERE ativo = true 
      ORDER BY nome ASC
    `;

    const [rows] = await db.execute(query);
    return (rows as any[]).map((fornecedor) =>
      formatarFornecedorResponse(fornecedor)
    );
  } catch (error) {
    console.error("Erro ao listar fornecedores:", error);
    throw error;
  }
};

export const buscarFornecedorPorId = async (
  id: string
): Promise<FornecedorResponse | null> => {
  try {
    const query = "SELECT * FROM fornecedores WHERE id = ?";
    const [rows] = await db.execute(query, [id]);
    const fornecedores = rows as any[];

    if (fornecedores.length === 0) {
      return null;
    }

    return formatarFornecedorResponse(fornecedores[0]);
  } catch (error) {
    console.error("Erro ao buscar fornecedor por ID:", error);
    throw error;
  }
};

export const atualizarFornecedor = async (
  id: string,
  data: FornecedorUpdateRequest
): Promise<FornecedorResponse> => {
  try {
    const hoje = new Date();
    const updates: string[] = [];
    const params: any[] = [];

    if (data.nome !== undefined) {
      updates.push("nome = ?");
      params.push(data.nome);
    }

    if (data.cnpj !== undefined) {
      updates.push("cnpj = ?");
      params.push(data.cnpj);
    }

    if (data.email !== undefined) {
      updates.push("email = ?");
      params.push(data.email);
    }

    if (data.telefone !== undefined) {
      updates.push("telefone = ?");
      params.push(data.telefone);
    }

    if (data.endereco !== undefined) {
      updates.push("endereco = ?");
      params.push(data.endereco);
    }

    updates.push("atualizado_em = ?");
    params.push(hoje);

    if (updates.length === 1) {
      throw new Error("Nenhum campo para atualizar");
    }

    params.push(id);

    const query = `
      UPDATE fornecedores 
      SET ${updates.join(", ")} 
      WHERE id = ?
    `;

    await db.execute(query, params);

    // Buscar o fornecedor atualizado
    const fornecedor = await buscarFornecedorPorId(id);
    if (!fornecedor) {
      throw new Error("Erro ao atualizar fornecedor");
    }
    return fornecedor;
  } catch (error) {
    console.error("Erro ao atualizar fornecedor:", error);
    throw error;
  }
};

export const excluirFornecedor = async (id: string): Promise<boolean> => {
  try {
    // Soft delete - apenas marca como inativo
    const query =
      "UPDATE fornecedores SET ativo = false, atualizado_em = ? WHERE id = ?";
    const [result] = await db.execute(query, [new Date(), id]);
    return (result as any).affectedRows > 0;
  } catch (error) {
    console.error("Erro ao excluir fornecedor:", error);
    throw error;
  }
};
