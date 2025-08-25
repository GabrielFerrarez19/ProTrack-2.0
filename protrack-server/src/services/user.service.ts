// userService.ts
import bcrypt from "bcrypt";
import { db } from "../config/database";

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  await db.execute(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword]
  );

  return { message: "Usuário criado com sucesso!" };
};

export const findUserByEmailAndPassword = async (
  email: string,
  password: string
) => {
  const [rows]: any = await db.execute(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  if (rows.length === 0) return null;

  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return null;

  return user;
};
