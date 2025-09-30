import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { findUserById } from "../services/user.service";
import { User } from "../@types/user.types";

// Estender a interface Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        username?: string;
        role: string;
        status: string;
        empresa_id?: string;
        departamento_id?: string;
        ultimo_login?: Date;
        criado_por?: string;
        atualizado_por?: string;
        created_at: Date;
        updated_at: Date;
      };
    }
  }
}

const JWT_SECRET =
  process.env.JWT_SECRET || "sua_chave_secreta_super_segura_aqui";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: "Token de acesso necessário" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = (await findUserById(BigInt(decoded.userId))) as User | null;

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    if (user.status !== "ativo") {
      return res.status(401).json({ error: "Usuário inativo" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Erro na autenticação:", error);
    return res.status(403).json({ error: "Token inválido" });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Acesso negado. Permissão insuficiente." });
    }

    next();
  };
};

export const generateToken = (userId: bigint): string => {
  return jwt.sign({ userId: userId.toString() }, JWT_SECRET, {
    expiresIn: "24h",
  });
};
