import React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
  requiredRoute?: string;
}

/** Casca: sem autenticação, sempre renderiza o conteúdo. */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return <>{children}</>;
};
