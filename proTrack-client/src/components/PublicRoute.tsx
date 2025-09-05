import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se estiver autenticado, redireciona para a página que tentou acessar ou para status
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/status";
    return <Navigate to={from} replace />;
  }

  // Se não estiver autenticado, renderiza o componente (login, etc.)
  return <>{children}</>;
};
