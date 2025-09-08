import { useAuth } from "./useAuth";

// Definição das permissões por rota
export const ROUTE_PERMISSIONS = {
  // Rotas básicas - todos os usuários autenticados
  "/status": ["admin", "financeiro", "vendedor", "operador"],
  "/cadastroprodutos": ["admin", "operador"],
  "/cadastrodeclientes": ["admin", "operador"],
  "/produtos": ["admin", "financeiro", "vendedor", "operador"],
  "/clientes": ["admin", "financeiro", "vendedor", "operador"],
  "/venda": ["admin", "vendedor"],
  "/totalVendas": ["admin", "financeiro", "vendedor"],

  // Rotas financeiras - apenas admin e financeiro
  "/relatorio": ["admin", "financeiro"],
  "/financeiro": ["admin", "financeiro"],
  "/configfinanceiro": ["admin", "financeiro"],
  "/contasPagar": ["admin", "financeiro"],
  "/contasReceber": ["admin", "financeiro"],
  "/flucoCaixa": ["admin", "financeiro"],
  "/cadastrocontaspagar": ["admin", "financeiro"],
} as const;

export type RoutePath = keyof typeof ROUTE_PERMISSIONS;
export type UserRole = "admin" | "financeiro" | "vendedor" | "operador";

export const usePermissions = () => {
  const { user, isAuthenticated } = useAuth();

  // Verifica se o usuário tem permissão para acessar uma rota específica
  const hasPermission = (route: string): boolean => {
    if (!isAuthenticated || !user) {
      return false;
    }

    const allowedRoles = ROUTE_PERMISSIONS[route as RoutePath];
    if (!allowedRoles) {
      // Se a rota não estiver definida nas permissões, permite acesso
      return true;
    }

    return (allowedRoles as readonly UserRole[]).includes(
      user.role as UserRole
    );
  };

  // Verifica se o usuário tem uma das roles especificadas
  const hasRole = (roles: UserRole[]): boolean => {
    if (!isAuthenticated || !user) {
      return false;
    }

    return roles.includes(user.role as UserRole);
  };

  // Verifica se o usuário é admin
  const isAdmin = (): boolean => {
    return hasRole(["admin"]);
  };

  // Verifica se o usuário tem acesso financeiro
  const hasFinancialAccess = (): boolean => {
    return hasRole(["admin", "financeiro"]);
  };

  // Verifica se o usuário pode vender
  const canSell = (): boolean => {
    return hasRole(["admin", "vendedor"]);
  };

  // Retorna todas as rotas que o usuário pode acessar
  const getAccessibleRoutes = (): string[] => {
    if (!isAuthenticated || !user) {
      return [];
    }

    return Object.keys(ROUTE_PERMISSIONS).filter((route) =>
      hasPermission(route)
    );
  };

  return {
    hasPermission,
    hasRole,
    isAdmin,
    hasFinancialAccess,
    canSell,
    getAccessibleRoutes,
    userRole: user?.role as UserRole | undefined,
  };
};
