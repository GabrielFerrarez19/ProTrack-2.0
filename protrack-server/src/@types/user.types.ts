// ===== TIPOS PARA USUÁRIOS =====

export interface User {
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
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  username?: string;
  role?: string;
  empresa_id?: bigint;
  departamento_id?: bigint;
  criado_por?: bigint;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  username?: string;
  role?: string;
  empresa_id?: bigint;
  departamento_id?: bigint;
}

export interface UserResponse {
  success: boolean;
  user: User;
}

export interface UsersResponse {
  success: boolean;
  users: User[];
  total: number;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}
