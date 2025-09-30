// userService.ts
import bcrypt from "bcrypt";
import { db } from "../config/database";
import { CreateUserData, User } from "../@types/user.types";

export const createUser = async (userData: CreateUserData) => {
  const {
    name,
    email,
    password,
    username,
    role = "user",
    empresa_id,
    departamento_id,
    criado_por,
  } = userData;

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `
    INSERT INTO users (
      name, email, password_hash, username, role, 
      empresa_id, departamento_id, criado_por
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  await db.execute(query, [
    name,
    email,
    hashedPassword,
    username || null,
    role,
    empresa_id || null,
    departamento_id || null,
    criado_por || null,
  ]);

  return { message: "Usuário criado com sucesso!" };
};

export const findUserByEmailAndPassword = async (
  email: string,
  password: string
) => {
  const [rows]: any = await db.execute(
    "SELECT * FROM users WHERE email = ? AND status = 'ativo' LIMIT 1",
    [email]
  );

  if (rows.length === 0) return null;

  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) return null;

  // Atualizar último login
  await updateLastLogin(user.id);

  // Remover password_hash da resposta e converter bigint para string
  const { password_hash, ...userWithoutPassword } = user;

  // Converter bigint para string para compatibilidade com frontend
  return {
    ...userWithoutPassword,
    id: userWithoutPassword.id.toString(),
    empresa_id: userWithoutPassword.empresa_id?.toString(),
    departamento_id: userWithoutPassword.departamento_id?.toString(),
    criado_por: userWithoutPassword.criado_por?.toString(),
    atualizado_por: userWithoutPassword.atualizado_por?.toString(),
  };
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const [rows]: any = await db.execute(
    "SELECT * FROM users WHERE email = ? AND status = 'ativo' LIMIT 1",
    [email]
  );

  if (rows.length === 0) return null;

  const { password_hash, ...user } = rows[0];

  // Converter bigint para string para compatibilidade com frontend
  return {
    ...user,
    id: user.id.toString(),
    empresa_id: user.empresa_id?.toString(),
    departamento_id: user.departamento_id?.toString(),
    criado_por: user.criado_por?.toString(),
    atualizado_por: user.atualizado_por?.toString(),
  };
};

export const findUserById = async (id: bigint): Promise<User | null> => {
  const [rows]: any = await db.execute(
    "SELECT * FROM users WHERE id = ? AND status = 'ativo' LIMIT 1",
    [id]
  );

  if (rows.length === 0) return null;

  const { password_hash, ...user } = rows[0];

  // Converter bigint para string para compatibilidade com frontend
  return {
    ...user,
    id: user.id.toString(),
    empresa_id: user.empresa_id?.toString(),
    departamento_id: user.departamento_id?.toString(),
    criado_por: user.criado_por?.toString(),
    atualizado_por: user.atualizado_por?.toString(),
  };
};

export const updateLastLogin = async (userId: bigint) => {
  await db.execute("UPDATE users SET ultimo_login = NOW() WHERE id = ?", [
    userId,
  ]);
};

export const updateUserStatus = async (
  userId: bigint,
  status: "ativo" | "inativo" | "bloqueado",
  atualizado_por?: bigint
) => {
  await db.execute(
    "UPDATE users SET status = ?, atualizado_por = ?, updated_at = NOW() WHERE id = ?",
    [status, atualizado_por || null, userId]
  );

  return { message: "Status do usuário atualizado com sucesso!" };
};

export const getAllUsers = async (): Promise<User[]> => {
  const [rows]: any = await db.execute(
    "SELECT id, name, email, username, role, status, empresa_id, departamento_id, ultimo_login, criado_por, atualizado_por, created_at, updated_at FROM users ORDER BY created_at DESC"
  );

  // Converter bigint para string para compatibilidade com frontend
  return rows.map((user: any) => ({
    ...user,
    id: user.id.toString(),
    empresa_id: user.empresa_id?.toString(),
    departamento_id: user.departamento_id?.toString(),
    criado_por: user.criado_por?.toString(),
    atualizado_por: user.atualizado_por?.toString(),
  }));
};

export const updateUser = async (
  userId: bigint,
  updateData: Partial<CreateUserData>,
  atualizado_por?: bigint
) => {
  const allowedFields = [
    "name",
    "email",
    "username",
    "role",
    "empresa_id",
    "departamento_id",
  ];
  const updates: string[] = [];
  const values: any[] = [];

  for (const [key, value] of Object.entries(updateData)) {
    if (allowedFields.includes(key) && value !== undefined) {
      updates.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (updates.length === 0) {
    throw new Error("Nenhum campo válido para atualização");
  }

  updates.push("atualizado_por = ?", "updated_at = NOW()");
  values.push(atualizado_por || null, userId);

  const query = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;

  await db.execute(query, values);

  return { message: "Usuário atualizado com sucesso!" };
};

export const deleteUser = async (userId: bigint, deletado_por?: bigint) => {
  // Verificar se o usuário existe
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  // Soft delete - marcar como inativo em vez de deletar fisicamente
  await db.execute(
    "UPDATE users SET status = 'inativo', atualizado_por = ?, updated_at = NOW() WHERE id = ?",
    [deletado_por || null, userId]
  );

  return { message: "Usuário removido com sucesso!" };
};

export const searchUsers = async (searchTerm: string): Promise<User[]> => {
  const searchPattern = `%${searchTerm}%`;

  const [rows]: any = await db.execute(
    `SELECT id, name, email, username, role, status, empresa_id, departamento_id, ultimo_login, criado_por, atualizado_por, created_at, updated_at 
     FROM users 
     WHERE (name LIKE ? OR email LIKE ? OR username LIKE ?) 
     ORDER BY created_at DESC`,
    [searchPattern, searchPattern, searchPattern]
  );

  return rows.map((user: any) => ({
    ...user,
    id: user.id.toString(),
    empresa_id: user.empresa_id?.toString(),
    departamento_id: user.departamento_id?.toString(),
    criado_por: user.criado_por?.toString(),
    atualizado_por: user.atualizado_por?.toString(),
  }));
};

export const getUsersByStatus = async (status: string): Promise<User[]> => {
  const [rows]: any = await db.execute(
    `SELECT id, name, email, username, role, status, empresa_id, departamento_id, ultimo_login, criado_por, atualizado_por, created_at, updated_at 
     FROM users 
     WHERE status = ? 
     ORDER BY created_at DESC`,
    [status]
  );

  return rows.map((user: any) => ({
    ...user,
    id: user.id.toString(),
    empresa_id: user.empresa_id?.toString(),
    departamento_id: user.departamento_id?.toString(),
    criado_por: user.criado_por?.toString(),
    atualizado_por: user.atualizado_por?.toString(),
  }));
};

export const getUsersByRole = async (role: string): Promise<User[]> => {
  const [rows]: any = await db.execute(
    `SELECT id, name, email, username, role, status, empresa_id, departamento_id, ultimo_login, criado_por, atualizado_por, created_at, updated_at 
     FROM users 
     WHERE role = ? 
     ORDER BY created_at DESC`,
    [role]
  );

  return rows.map((user: any) => ({
    ...user,
    id: user.id.toString(),
    empresa_id: user.empresa_id?.toString(),
    departamento_id: user.departamento_id?.toString(),
    criado_por: user.criado_por?.toString(),
    atualizado_por: user.atualizado_por?.toString(),
  }));
};

export const getUsersByDepartment = async (
  departamento_id: bigint
): Promise<User[]> => {
  const [rows]: any = await db.execute(
    `SELECT id, name, email, username, role, status, empresa_id, departamento_id, ultimo_login, criado_por, atualizado_por, created_at, updated_at 
     FROM users 
     WHERE departamento_id = ? 
     ORDER BY created_at DESC`,
    [departamento_id]
  );

  return rows.map((user: any) => ({
    ...user,
    id: user.id.toString(),
    empresa_id: user.empresa_id?.toString(),
    departamento_id: user.departamento_id?.toString(),
    criado_por: user.criado_por?.toString(),
    atualizado_por: user.atualizado_por?.toString(),
  }));
};
