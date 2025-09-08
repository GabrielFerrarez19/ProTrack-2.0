import { useState } from "react";
import { SidebarContext } from "./SidebarContext";
import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";
import img from "../../assets/Logo.svg";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../components/ui/dropdown-menu"; // shadcn/ui
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

type SidebarProps = {
  children: React.ReactNode;
};

export function Sidebar({ children }: SidebarProps) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Mesmo com erro, redireciona para login
      navigate("/login", { replace: true });
    }
  };

  return (
    <aside className="h-screen sidebar relative z-1 overflow-y-auto overflow-x-hidden">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        {/* Header */}
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src={img}
            className={`overflow-hidden transition-all ${
              expanded ? "w-22" : "w-0"
            }`}
            alt="Logo"
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        {/* Items */}
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        {/* Footer */}
        <div className="border-t flex p-3 relative">
          <img
            src={`https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${encodeURIComponent(
              user?.name || "User"
            )}`}
            alt="Avatar"
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`flex justify-between items-center overflow-hidden transition-all ${
              expanded ? "w-52 ml-3" : "w-0"
            }`}
          >
            <div className="leading-4">
              <h4 className="font-semibold">{user?.name || "Usuário"}</h4>
              <span className="text-xs text-gray-600">
                {user?.email || "email@exemplo.com"}
              </span>
            </div>

            {/* Dropdown de Configurações */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-2 p-1 rounded hover:bg-gray-100">
                  <MoreVertical size={20} className="cursor-pointer" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => navigate("/configfinanceiro")}
                  className="cursor-pointer"
                >
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/user")}
                  className="cursor-pointer"
                >
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 cursor-pointer"
                >
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </aside>
  );
}
