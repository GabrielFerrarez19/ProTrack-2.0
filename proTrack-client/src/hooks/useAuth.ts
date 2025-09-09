import { useState, useEffect, useCallback } from "react";
import {
  getCurrentUser,
  updateCurrentUser,
  logoutUser,
  loginUser,
} from "../services/api";
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

export const useAuth = (): AuthState & AuthActions => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Função para carregar dados do usuário do localStorage
  const loadUserFromStorage = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("authToken");

      if (storedUser && token) {
        const user = JSON.parse(storedUser);
        setState((prev) => ({
          ...prev,
          user,
          isAuthenticated: true,
          isLoading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error("Erro ao carregar usuário do localStorage:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Erro ao carregar dados do usuário",
      }));
    }
  }, []);

  // Função para salvar dados do usuário no localStorage
  const saveUserToStorage = useCallback((user: User, token: string) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("authToken", token);
  }, []);

  // Função para limpar dados do localStorage
  const clearUserFromStorage = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  }, []);

  // Função de login
  const login = useCallback(
    async (email: string, password: string): Promise<LoginResponse> => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const response = await loginUser(email, password);

        if (response.user && response.token) {
          saveUserToStorage(response.user, response.token);
          setState((prev) => ({
            ...prev,
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          }));
        }

        return response;
      } catch (error: any) {
        console.error("Erro no login:", error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.error || "Erro ao fazer login",
        }));
        throw error;
      }
    },
    [saveUserToStorage]
  );

  // Função de logout
  const logout = useCallback(async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      // Chama a API de logout
      await logoutUser();

      // Limpa o localStorage
      clearUserFromStorage();

      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Mesmo com erro, limpa os dados locais
      clearUserFromStorage();
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    }
  }, [clearUserFromStorage]);

  // Função para atualizar dados do usuário
  const updateUser = useCallback(
    async (userData: UpdateUserData): Promise<void> => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const response = await updateCurrentUser(userData);

        if (response.success) {
          setState((prev) => {
            if (!prev.user) return prev;

            // Atualiza o usuário no estado
            const updatedUser = { ...prev.user, ...userData } as User;

            // Atualiza o localStorage
            const token = localStorage.getItem("authToken");
            if (token) {
              saveUserToStorage(updatedUser, token);
            }

            return {
              ...prev,
              user: updatedUser,
              isLoading: false,
              error: null,
            };
          });
        }
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.error || "Erro ao atualizar usuário",
        }));
        throw error;
      }
    },
    [saveUserToStorage]
  );

  // Função para atualizar dados do usuário do servidor
  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await getCurrentUser();

      if (response.success && response.user) {
        setState((prev) => ({
          ...prev,
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }));

        // Atualiza o localStorage
        const token = localStorage.getItem("authToken");
        if (token) {
          saveUserToStorage(response.user, token);
        }
      }
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.error || "Erro ao carregar dados do usuário",
      }));

      // Se o erro for de autenticação, faz logout
      if (
        error.error?.includes("Token") ||
        error.error?.includes("autenticado")
      ) {
        clearUserFromStorage();
        setState((prev) => ({
          ...prev,
          user: null,
          isAuthenticated: false,
        }));
      }
    }
  }, [saveUserToStorage, clearUserFromStorage]);

  // Função para limpar erros
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Carrega dados do usuário na inicialização
  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  // Removido auto-refresh periódico para evitar atualizações desnecessárias
  // O refreshUser pode ser chamado manualmente quando necessário

  return {
    ...state,
    login,
    logout,
    updateUser,
    refreshUser,
    clearError,
  };
};
