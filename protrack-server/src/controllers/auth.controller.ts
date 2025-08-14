import { Request, Response } from "express";
import { findUserByEmailAndPassword } from "../services/user.service";

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
