import { Request, Response } from "express";
import {
  createUser,
  findUserByEmailAndPassword,
} from "../services/user.service";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmailAndPassword(email, password);

    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    return res.status(200).json({ message: "Login bem-sucedido", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const createUserController = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      username,
      role,
      empresa_id,
      departamento_id,
      criado_por,
    } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Nome, email e senha são obrigatórios." });
    }

    const userData = {
      name,
      email,
      password,
      username,
      role,
      empresa_id,
      departamento_id,
      criado_por,
    };

    const result = await createUser(userData);

    return res.status(201).json(result);
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};
