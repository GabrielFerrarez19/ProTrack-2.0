import { createContext } from "react";

export interface AuthContextData {
  hasCompany: boolean;
  setHasCompany: (value: boolean) => void;
}

export const AuthContext = createContext<AuthContextData | null>(null);
