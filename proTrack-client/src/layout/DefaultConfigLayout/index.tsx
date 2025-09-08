import { ArrowLeft } from "lucide-react";
import {
  CreditCard,
  User,
  Settings,
  Shield,
  Database,
  Mail,
  Palette,
  Globe,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

interface MenuItem {
  id: string;
  titulo: string;
  icone: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  descricao: string;
  path: string;
}

export const DefaultConfigLayout = () => {
  const navigate = useNavigate();
  const menuConfiguracoes: MenuItem[] = [
    {
      id: "financeiras",
      titulo: "Financeiras",
      icone: CreditCard,
      descricao: "Contas, métodos de pagamento e categorias",
      path: "/config/financeiro",
    },
    {
      id: "user",
      titulo: "Usuário",
      icone: User,
      descricao: "Perfil, preferências e dados pessoais",
      path: "/config/user",
    },
    {
      id: "sistema",
      titulo: "Sistema",
      icone: Settings,
      descricao: "Configurações gerais do sistema",
      path: "/config/sistema",
    },
    {
      id: "seguranca",
      titulo: "Segurança",
      icone: Shield,
      descricao: "Senhas, autenticação e permissões",
      path: "/config/seguranca",
    },
    {
      id: "backup",
      titulo: "Backup",
      icone: Database,
      descricao: "Backup automático e exportação de dados",
      path: "/config/backup",
    },
    {
      id: "notificacoes",
      titulo: "Notificações",
      icone: Mail,
      descricao: "E-mail, alertas e comunicações",
      path: "/config/notificacoes",
    },
    {
      id: "aparencia",
      titulo: "Aparência",
      icone: Palette,
      descricao: "Tema, cores e personalização",
      path: "/config/aparencia",
    },
    {
      id: "integracao",
      titulo: "Integrações",
      icone: Globe,
      descricao: "APIs externas e conectores",
      path: "/config/integracao",
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
            onClick={() => navigate("/")}
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
          {menuConfiguracoes.map((item) => {
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
