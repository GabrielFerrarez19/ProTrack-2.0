import { db } from "../config/database";

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
  const sql = `
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
    cliente.valorAPagar ?? 0,
    id,
  ];

  const [result]: any = await db.query(sql, values);

  if (result.affectedRows === 0) {
    throw new Error("Cliente não encontrado");
  }
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
