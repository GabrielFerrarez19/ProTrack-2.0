import { ArrowLeft, Users } from "lucide-react";
import {
  CreditCard,
  User,
  Settings,
  Shield,
  Database,
  Mail,
  Palette,
  Globe,
  Package,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { usePermissions, type UserRole } from "../../hooks/usePermissions";

interface MenuItem {
  id: string;
  titulo: string;
  icone: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  descricao: string;
  path: string;
  requiredRoles?: UserRole[]; // Roles necessárias para acessar este item
}

export const DefaultConfigLayout = () => {
  const navigate = useNavigate();
  const { hasRole } = usePermissions();

  const menuConfiguracoes: MenuItem[] = [
    // Configurações de usuário – todos os usuários autenticados
    {
      id: "user",
      titulo: "Usuário",
      icone: User,
      descricao: "Perfil, preferências e dados pessoais",
      path: "/config/user",
      requiredRoles: ["admin", "financeiro", "vendedor", "operador"],
    },

    // Configurações financeiras – apenas admin e financeiro
    {
      id: "financeiras",
      titulo: "Financeiras",
      icone: CreditCard,
      descricao: "Contas, métodos de pagamento e categorias",
      path: "/config/financeiro",
      requiredRoles: ["admin", "financeiro"],
    },
    // Categorias de produto – admin, financeiro, vendedor, operador
    {
      id: "categorias-produto",
      titulo: "Categorias de Produto",
      icone: Package,
      descricao: "Cadastre e gerencie categorias dos produtos",
      path: "/config/categorias-produto",
      requiredRoles: ["admin", "financeiro", "vendedor", "operador"],
    },

    // Sistema e segurança – apenas admin
    {
      id: "sistema",
      titulo: "Sistema",
      icone: Settings,
      descricao: "Configurações gerais do sistema",
      path: "/config/sistema",
      requiredRoles: ["admin"],
    },
    {
      id: "seguranca",
      titulo: "Segurança",
      icone: Shield,
      descricao: "Senhas, autenticação e permissões",
      path: "/config/seguranca",
      requiredRoles: ["admin"],
    },
    {
      id: "usuarios",
      titulo: "Usuarios",
      icone: Users,
      descricao: "Gerenciar usuários do sistema",
      path: "/config/usuarios",
      requiredRoles: ["admin"],
    },

    // Backup e integrações – apenas admin
    {
      id: "backup",
      titulo: "Backup",
      icone: Database,
      descricao: "Backup automático e exportação de dados",
      path: "/config/backup",
      requiredRoles: ["admin"],
    },
    {
      id: "integracao",
      titulo: "Integrações",
      icone: Globe,
      descricao: "APIs externas e conectores",
      path: "/config/integracao",
      requiredRoles: ["admin"],
    },

    // Aparência e notificações – todos os usuários autenticados
    {
      id: "aparencia",
      titulo: "Aparência",
      icone: Palette,
      descricao: "Tema, cores e personalização",
      path: "/config/aparencia",
      requiredRoles: ["admin", "financeiro", "vendedor", "operador"],
    },
    {
      id: "notificacoes",
      titulo: "Notificações",
      icone: Mail,
      descricao: "E-mail, alertas e comunicações",
      path: "/config/notificacoes",
      requiredRoles: ["admin", "financeiro", "vendedor", "operador"],
    },
  ];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-80 border-r bg-background p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/financeiro")}
            className="shrink-0 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Configurações
            </h1>
            <p className="text-sm text-muted-foreground">
              Gerencie todas as configurações do sistema
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {menuConfiguracoes
            .filter((item) => {
              // Se o item não tem roles específicas, permite acesso
              if (!item.requiredRoles || item.requiredRoles.length === 0) {
                return true;
              }
              // Verifica se o usuário tem uma das roles necessárias
              return hasRole(item.requiredRoles);
            })
            .map((item) => {
              const IconeComponente = item.icone;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) =>
                    `w-full block text-left p-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-gradient-to-r from-[#628DFD] to-[#6F31FF] text-white"
                        : "hover:bg-muted text-foreground"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <div className="flex items-center gap-3">
                      <IconeComponente className="h-5 w-5" />
                      <div className="flex-1">
                        <p className="font-medium">{item.titulo}</p>
                        <p
                          className={`text-xs ${
                            isActive ? "text-white" : "text-muted-foreground"
                          }`}
                        >
                          {item.descricao}
                        </p>
                      </div>
                    </div>
                  )}
                </NavLink>
              );
            })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};
