import { useState, useCallback } from "react";
import type { User, UpdateUserData } from "../@types/types.api";

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
    status: "ativo" | "inativo" | "bloqueado",
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

const emptyUser: User = {
  id: "",
  name: "",
  email: "",
  role: "",
  status: "ativo",
  created_at: "",
  updated_at: "",
};

export const useUsers = (): UsersState & UsersActions => {
  const [state, setState] = useState<UsersState>({
    users: [],
    total: 0,
    isLoading: false,
    error: null,
  });

  const fetchUsers = useCallback(async (): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    setState((prev) => ({ ...prev, users: [], total: 0, isLoading: false }));
  }, []);

  const fetchUserById = useCallback(async (id: string): Promise<User> => {
    setState((prev) => ({ ...prev, isLoading: true }));
    setState((prev) => ({ ...prev, isLoading: false }));
    return { ...emptyUser, id };
  }, []);

  const updateUser = useCallback(
    async (_id: string, userData: UpdateUserData): Promise<void> => {
      setState((prev) => ({ ...prev, isLoading: true }));
      setState((prev) => ({ ...prev, isLoading: false }));
    },
    [],
  );

  const changeStatus = useCallback(
    async (
      _id: string,
      _status: "ativo" | "inativo" | "bloqueado",
    ): Promise<void> => {
      setState((prev) => ({ ...prev, isLoading: true }));
      setState((prev) => ({ ...prev, isLoading: false }));
    },
    [],
  );

  const createNewUser = useCallback(
    async (_userData: {
      name: string;
      email: string;
      password: string;
      username?: string;
      role?: string;
      departamento_id?: string;
    }): Promise<void> => {
      setState((prev) => ({ ...prev, isLoading: true }));
      setState((prev) => ({ ...prev, isLoading: false }));
    },
    [],
  );

  const removeUser = useCallback(async (_id: string): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));
    setState((prev) => ({ ...prev, isLoading: false }));
  }, []);

  const searchUsersByTerm = useCallback(
    async (_searchTerm: string): Promise<User[]> => {
      return [];
    },
    [],
  );

  const filterUsersByStatus = useCallback(
    async (_status: string): Promise<User[]> => {
      return [];
    },
    [],
  );

  const filterUsersByRole = useCallback(
    async (_role: string): Promise<User[]> => {
      return [];
    },
    [],
  );

  const filterUsersByDepartment = useCallback(
    async (_departamento_id: string): Promise<User[]> => [],
    [],
  );

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
