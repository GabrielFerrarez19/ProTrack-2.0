import { useState, useEffect, useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { getMe, updateCurrentUser } from "@/services/auth";
import type { User } from "@/@types/types.api";
import type { UpdateUserData } from "@/@types/types.api";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasCompany, setHasCompanyState] = useState<boolean>(() => {
    return localStorage.getItem("has_company") === "true";
  });

  const setHasCompany = useCallback((value: boolean) => {
    setHasCompanyState(value);
    localStorage.setItem("has_company", String(value));
  }, []);

  const isAuthenticated = !!localStorage.getItem("access_token");
  const role = user?.role ?? "";
  const companyID = user?.empresa_id ?? "";

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const userData = await getMe();
      setUser(userData);
      const storedHasCompany = localStorage.getItem("has_company");
      if (storedHasCompany !== null) {
        setHasCompanyState(storedHasCompany === "true");
      }
    } catch {
      setError("Erro ao carregar dados do usuário");
      setUser(null);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("has_company");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchUser]);

  const logout = useCallback(async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("has_company");
    setUser(null);
    setHasCompanyState(false);
    setError(null);
    navigate("/login");
  }, [navigate]);

  const updateUser = useCallback(
    async (data: UpdateUserData) => {
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      try {
        setIsLoading(true);
        setError(null);
        const payload: Parameters<typeof updateCurrentUser>[1] = {};
        if (data.name !== undefined) payload.name = data.name;
        if (data.email !== undefined) payload.email = data.email;
        if (data.username !== undefined) payload.username = data.username;
        if (data.role !== undefined) payload.role = data.role;
        if (data.departamento_id !== undefined)
          payload.department_id = String(data.departamento_id);

        const updatedUser = await updateCurrentUser(user.id, payload);
        setUser(updatedUser);
      } catch (err) {
        setError("Erro ao atualizar perfil");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [user],
  );

  const value = {
    user,
    isAuthenticated,
    hasCompany,
    role,
    companyID,
    setHasCompany,
    logout,
    updateUser,
    isLoading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
