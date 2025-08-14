import { db } from "../db/connection";

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

  return new Promise((resolve, reject) => {
    db.query(sql, values, (err: any, results: any) => {
      if (err) return reject(err);
      resolve(results.insertId);
    });
  });
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

  return new Promise((resolve, reject) => {
    db.query(sql, values, (err: any, results: any) => {
      if (err) return reject(err);
      if (results.affectedRows === 0)
        return reject(new Error("Cliente não encontrado"));
      resolve();
    });
  });
};

export const getTotalClientesDb = async (): Promise<number> => {
  const sql = "SELECT COUNT(*) AS totalClientes FROM clientes";

  return new Promise((resolve, reject) => {
    db.query(sql, (err: any, results: any) => {
      if (err) return reject(err);
      resolve(results[0].totalClientes || 0);
    });
  });
};

export const getAllClientesDb = async (): Promise<any[]> => {
  const sql = "SELECT * FROM clientes";

  return new Promise((resolve, reject) => {
    db.query(sql, (err: any, results: any) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};
