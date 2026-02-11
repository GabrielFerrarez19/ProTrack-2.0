import { createContext } from "react";
import type { User } from "@/@types/types.api";
import type { UpdateUserData } from "@/@types/types.api";

export interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  hasCompany: boolean;
  role: string;
  companyID: string;
  setHasCompany: (value: boolean) => void;
  logout: () => Promise<void>;
  updateUser: (data: UpdateUserData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextData | null>(null);
