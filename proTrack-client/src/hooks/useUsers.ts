import { useState, useCallback } from "react";
import {
  getAllUsers,
  getUserById,
  updateUserById,
  changeUserStatus,
  createUser,
  deleteUser,
  searchUsers,
  getUsersByStatus,
  getUsersByRole,
  getUsersByDepartment,
} from "../services/api";
import type {
  User,
  UsersResponse,
  UserResponse,
  UpdateUserData,
} from "../@types/types.api";

interface UsersState {
  users: User[];
  total: number;
  isLoading: boolean;
  error: string | null;
}

interface UsersActions {
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: string) => Promise<User>;
  updateUser: (id: string, userData: UpdateUserData) => Promise<void>;
  changeStatus: (
    id: string,
    status: "ativo" | "inativo" | "bloqueado"
  ) => Promise<void>;
  createNewUser: (userData: {
    name: string;
    email: string;
    password: string;
    username?: string;
    role?: string;
    departamento_id?: string;
  }) => Promise<void>;
  removeUser: (id: string) => Promise<void>;
  searchUsersByTerm: (searchTerm: string) => Promise<User[]>;
  filterUsersByStatus: (status: string) => Promise<User[]>;
  filterUsersByRole: (role: string) => Promise<User[]>;
  filterUsersByDepartment: (departamento_id: string) => Promise<User[]>;
  clearError: () => void;
}

export const useUsers = (): UsersState & UsersActions => {
  const [state, setState] = useState<UsersState>({
    users: [],
    total: 0,
    isLoading: false,
    error: null,
  });

  // Função para buscar todos os usuários
  const fetchUsers = useCallback(async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response: UsersResponse = await getAllUsers();

      setState((prev) => ({
        ...prev,
        users: response.users,
        total: response.total,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.error || "Erro ao carregar usuários",
      }));
      throw error;
    }
  }, []);

  // Função para buscar usuário por ID
  const fetchUserById = useCallback(async (id: string): Promise<User> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response: UserResponse = await getUserById(id);

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: null,
      }));

      return response.user;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.error || "Erro ao carregar usuário",
      }));
      throw error;
    }
  }, []);

  // Função para atualizar usuário
  const updateUser = useCallback(
    async (id: string, userData: UpdateUserData): Promise<void> => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        await updateUserById(id, userData);

        // Atualiza o usuário na lista local
        setState((prev) => ({
          ...prev,
          users: prev.users.map((user) =>
            user.id === id ? { ...user, ...userData } : user
          ),
          isLoading: false,
          error: null,
        }));
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.error || "Erro ao atualizar usuário",
        }));
        throw error;
      }
    },
    []
  );

  // Função para alterar status do usuário
  const changeStatus = useCallback(
    async (
      id: string,
      status: "ativo" | "inativo" | "bloqueado"
    ): Promise<void> => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        await changeUserStatus(id, status);

        // Atualiza o status do usuário na lista local
        setState((prev) => ({
          ...prev,
          users: prev.users.map((user) =>
            user.id === id ? { ...user, status } : user
          ),
          isLoading: false,
          error: null,
        }));
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.error || "Erro ao alterar status do usuário",
        }));
        throw error;
      }
    },
    []
  );

  // Função para criar novo usuário
  const createNewUser = useCallback(
    async (userData: {
      name: string;
      email: string;
      password: string;
      username?: string;
      role?: string;
      departamento_id?: string;
    }): Promise<void> => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        await createUser(userData);

        // Recarrega a lista de usuários
        await fetchUsers();
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.error || "Erro ao criar usuário",
        }));
        throw error;
      }
    },
    [fetchUsers]
  );

  // Função para remover usuário
  const removeUser = useCallback(async (id: string): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      await deleteUser(id);

      // Remove o usuário da lista local
      setState((prev) => ({
        ...prev,
        users: prev.users.filter((user) => user.id !== id),
        total: prev.total - 1,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.error || "Erro ao remover usuário",
      }));
      throw error;
    }
  }, []);

  // Função para buscar usuários por termo
  const searchUsersByTerm = useCallback(
    async (searchTerm: string): Promise<User[]> => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const response = await searchUsers(searchTerm);

        setState((prev) => ({
          ...prev,
          users: response.users,
          total: response.total,
          isLoading: false,
          error: null,
        }));

        return response.users;
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.error || "Erro ao buscar usuários",
        }));
        throw error;
      }
    },
    []
  );

  // Função para filtrar usuários por status
  const filterUsersByStatus = useCallback(
    async (status: string): Promise<User[]> => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const response = await getUsersByStatus(status);

        setState((prev) => ({
          ...prev,
          users: response.users,
          total: response.total,
          isLoading: false,
          error: null,
        }));

        return response.users;
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.error || "Erro ao filtrar usuários por status",
        }));
        throw error;
      }
    },
    []
  );

  // Função para filtrar usuários por role
  const filterUsersByRole = useCallback(
    async (role: string): Promise<User[]> => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const response = await getUsersByRole(role);

        setState((prev) => ({
          ...prev,
          users: response.users,
          total: response.total,
          isLoading: false,
          error: null,
        }));

        return response.users;
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.error || "Erro ao filtrar usuários por role",
        }));
        throw error;
      }
    },
    []
  );

  // Função para filtrar usuários por departamento
  const filterUsersByDepartment = useCallback(
    async (departamento_id: string): Promise<User[]> => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const response = await getUsersByDepartment(departamento_id);

        setState((prev) => ({
          ...prev,
          users: response.users,
          total: response.total,
          isLoading: false,
          error: null,
        }));

        return response.users;
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.error || "Erro ao filtrar usuários por departamento",
        }));
        throw error;
      }
    },
    []
  );

  // Função para limpar erros
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    fetchUsers,
    fetchUserById,
    updateUser,
    changeStatus,
    createNewUser,
    removeUser,
    searchUsersByTerm,
    filterUsersByStatus,
    filterUsersByRole,
    filterUsersByDepartment,
    clearError,
  };
};
