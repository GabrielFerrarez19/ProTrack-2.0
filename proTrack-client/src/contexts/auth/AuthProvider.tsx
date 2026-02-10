import { useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [hasCompany, setHasCompany] = useState<boolean>(() => {
    return localStorage.getItem("has_company") === "true";
  });

  return (
    <AuthContext.Provider value={{ hasCompany, setHasCompany }}>
      {children}
    </AuthContext.Provider>
  );
}
