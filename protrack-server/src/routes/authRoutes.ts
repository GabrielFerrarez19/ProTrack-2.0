import { Router } from "express";
import { db } from "../config/database";
import bcrypt from "bcrypt";
import { RowDataPacket } from "mysql2";

type User = RowDataPacket & {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
};

const router = Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  console.log("Requisição login:", { email, password });

  try {
    const [rows] = await db.execute<User[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    const user = rows.length > 0 ? rows[0] : null;

    console.log("Usuário encontrado:", user);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Comparação direta sem bcrypt
    if (password !== user.password) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    return res.json({
      message: "Login realizado com sucesso",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Erro ao autenticar:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
