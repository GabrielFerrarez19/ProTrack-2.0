import { useState, useCallback } from "react";
import type { User, LoginResponse, UpdateUserData } from "../@types/types.api";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  updateUser: (userData: UpdateUserData) => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const fakeUser: User = {
  id: "1",
  name: "Usuário",
  email: "usuario@local",
  username: "usuario",
  role: "admin",
  status: "ativo",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const useAuth = (): AuthState & AuthActions => {
  const [state, setState] = useState<AuthState>({
    user: fakeUser,
    isLoading: false,
    isAuthenticated: true,
    error: null,
  });

  const login = useCallback(
    async (_email: string, _password: string): Promise<LoginResponse> => {
      setState((prev) => ({
        ...prev,
        user: fakeUser,
        isAuthenticated: true,
        error: null,
      }));
      return { user: fakeUser, token: "fake", message: "OK" };
    },
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
    });
  }, []);

  const updateUser = useCallback(
    async (userData: UpdateUserData): Promise<void> => {
      setState((prev) =>
        prev.user
          ? { ...prev, user: { ...prev.user, ...userData } as User }
          : prev,
      );
    },
    [],
  );

  const refreshUser = useCallback(async (): Promise<void> => {
    setState((prev) => ({
      ...prev,
      user: fakeUser,
      isAuthenticated: true,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    login,
    logout,
    updateUser,
    refreshUser,
    clearError,
  };
};
