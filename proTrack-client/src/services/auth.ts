import { api } from "./api";

import type { LoginRequest, LoginResponse } from "@/@types/auth";
import type { User } from "@/@types/types.api";

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data;
}

interface MeResponse {
  user: {
    id: string;
    name: string;
    email: string;
    username?: string;
    role: string;
    status: string;
    company_id: string;
    department_id?: string;
    last_login_at?: string;
    created_at: string;
    updated_at: string;
  };
}

function mapMeUserToUser(apiUser: MeResponse["user"]): User {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    username: apiUser.username,
    role: apiUser.role,
    status: String(apiUser.status),
    empresa_id: apiUser.company_id,
    departamento_id: apiUser.department_id,
    ultimo_login: apiUser.last_login_at,
    created_at: apiUser.created_at,
    updated_at: apiUser.updated_at,
  };
}

export async function getMe(): Promise<User> {
  const response = await api.get<MeResponse>("/me");
  return mapMeUserToUser(response.data.user);
}

interface UpdateUserPayload {
  name?: string;
  email?: string;
  username?: string;
  role?: string;
  department_id?: string;
}

interface UpdateUserResponse {
  user: MeResponse["user"];
}

export async function updateCurrentUser(
  userId: string,
  data: UpdateUserPayload,
): Promise<User> {
  const response = await api.put<UpdateUserResponse>(`/${userId}`, data);
  return mapMeUserToUser(response.data.user);
}
