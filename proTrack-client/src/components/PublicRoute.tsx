import React from "react";

interface PublicRouteProps {
  children: React.ReactNode;
}

/** Renderiza sempre o conteúdo (sem redirecionamento). Permite acessar login e todas as páginas públicas. */
export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  return <>{children}</>;
};
