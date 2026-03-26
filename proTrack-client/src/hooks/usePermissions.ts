import { useAuth } from "./useAuth";

// Definição das permissões por rota
export const ROUTE_PERMISSIONS = {
  // Rotas básicas - todos os usuários autenticados
  "/cadastroprodutos": ["ADMIN", "operador"],
  "/cadastrodeclientes": ["ADMIN", "operador"],
  "/produtos": ["ADMIN", "financeiro", "vendedor", "operador"],
  "/clientes": ["ADMIN", "financeiro", "vendedor", "operador"],
  "/venda": ["ADMIN", "vendedor"],
  "/totalVendas": ["ADMIN", "financeiro", "vendedor"],

  // Rotas financeiras - apenas ADMIN e financeiro
  "/relatorio": ["ADMIN", "financeiro"],
  "/financeiro": ["ADMIN", "financeiro"],
  "/configfinanceiro": ["ADMIN", "financeiro", "vendedor", "operador"],
  "/config/categorias-produto": ["ADMIN", "financeiro", "vendedor", "operador"],
  "/contasPagar": ["ADMIN", "financeiro"],
  "/contasReceber": ["ADMIN", "financeiro"],
  "/flucoCaixa": ["ADMIN", "financeiro"],
  "/cadastrocontaspagar": ["ADMIN", "financeiro"],
} as const;

export type RoutePath = keyof typeof ROUTE_PERMISSIONS;
export type UserRole = "admin" | "financeiro" | "vendedor" | "operador";

export const usePermissions = () => {
  const { user, isAuthenticated } = useAuth();

  // Normaliza role para comparação (backend pode retornar ADMIN, frontend usa admin)
  const normalizedUserRole = user?.role?.toLowerCase() as UserRole | undefined;

  // Verifica se o usuário tem permissão para acessar uma rota específica
  const hasPermission = (route: string): boolean => {
    if (!isAuthenticated || !user || !normalizedUserRole) {
      return false;
    }

    const allowedRoles = ROUTE_PERMISSIONS[route as RoutePath];
    if (!allowedRoles) {
      // Se a rota não estiver definida nas permissões, permite acesso
      return true;
    }

    const normalizedAllowed = (allowedRoles as readonly string[]).map((r) =>
      r.toLowerCase(),
    );
    return normalizedAllowed.includes(normalizedUserRole);
  };

  // Verifica se o usuário tem uma das roles especificadas
  const hasRole = (roles: UserRole[]): boolean => {
    if (!isAuthenticated || !user || !normalizedUserRole) {
      return false;
    }

    const normalizedRequired = roles.map((r) => r.toLowerCase());
    return normalizedRequired.includes(normalizedUserRole);
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
      hasPermission(route),
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
