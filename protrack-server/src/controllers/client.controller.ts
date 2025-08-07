import { Request, Response } from "express";
import { db } from "../db/connection";

export const createCliente = (req: Request, res: Response) => {
  const {
    nome,
    dataNascimento,
    cpf,
    rg,
    estadoCivil,
    sexo,
    telefoneWhatsapp,
    telefoneCelular,
    telefoneResidencial,
    email,
    cep,
    endereco,
    numero,
    complemento,
    bairro,
    cidade,
  } = req.body;

  // Validação mínima dos campos obrigatórios
  if (!nome || !dataNascimento || !cpf || !email) {
    return res.status(400).json({
      error: "Nome, data de nascimento, CPF e e-mail são obrigatórios.",
    });
  }

  const sql = `
    INSERT INTO clientes (
      nome, data_nascimento, cpf, rg, estado_civil, sexo,
      telefone_whatsapp, telefone_celular, telefone_residencial,
      email, cep, endereco, numero, complemento, bairro, cidade
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    nome,
    dataNascimento,
    cpf,
    rg || null,
    estadoCivil || null,
    sexo || null,
    telefoneWhatsapp || null,
    telefoneCelular || null,
    telefoneResidencial || null,
    email,
    cep || null,
    endereco || null,
    numero || null,
    complemento || null,
    bairro || null,
    cidade || null,
  ];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Erro ao inserir cliente:", err);
      return res
        .status(500)
        .json({ error: "Erro interno ao cadastrar cliente" });
    }

    res.status(201).json({
      message: "Cliente cadastrado com sucesso!",
      id: results.insertId,
    });
  });
};

export const getTotalClientes = (req: Request, res: Response) => {
  const sql = "SELECT COUNT(*) AS totalClientes FROM clientes";

  db.query(sql, (err: any, results: any) => {
    if (err) {
      console.error("Erro ao buscar o total de clientes cadastrados:", err);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }

    const total = results[0].totalClientes || 0;

    res.status(200).json({ totalClientes: total });
  });
};

export const getAllClientes = (req: Request, res: Response) => {
  const sql = "SELECT * FROM clientes";

  db.query(sql, (err: any, results: any) => {
    if (err) {
      console.error("Erro ao buscar clientes cadastrados:", err);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }

    res.status(200).json({ clientes: results });
  });
};
