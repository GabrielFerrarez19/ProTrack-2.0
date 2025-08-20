"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllClientesDb = exports.getTotalClientesDb = exports.updateClienteDb = exports.createClienteDb = void 0;
const connection_1 = require("../db/connection");
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
    return new Promise((resolve, reject) => {
        connection_1.db.query(sql, values, (err, results) => {
            if (err)
                return reject(err);
            resolve(results.insertId);
        });
    });
};
exports.createClienteDb = createClienteDb;
const updateClienteDb = async (id, cliente) => {
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
        connection_1.db.query(sql, values, (err, results) => {
            if (err)
                return reject(err);
            if (results.affectedRows === 0)
                return reject(new Error("Cliente não encontrado"));
            resolve();
        });
    });
};
exports.updateClienteDb = updateClienteDb;
const getTotalClientesDb = async () => {
    const sql = "SELECT COUNT(*) AS totalClientes FROM clientes";
    return new Promise((resolve, reject) => {
        connection_1.db.query(sql, (err, results) => {
            if (err)
                return reject(err);
            resolve(results[0].totalClientes || 0);
        });
    });
};
exports.getTotalClientesDb = getTotalClientesDb;
const getAllClientesDb = async () => {
    const sql = "SELECT * FROM clientes";
    return new Promise((resolve, reject) => {
        connection_1.db.query(sql, (err, results) => {
            if (err)
                return reject(err);
            resolve(results);
        });
    });
};
exports.getAllClientesDb = getAllClientesDb;
