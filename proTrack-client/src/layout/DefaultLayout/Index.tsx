import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import {
  Users,
  ShoppingCart,
  TrendingUp,
  Calculator,
  ChartPie,
  UserPlus,
} from "lucide-react";
import { SidebarItem } from "../../components/Sidebar/SidebarItem";

export function DefaultLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex h-screen">
      <Sidebar>
        <SidebarItem
          icon={<ChartPie size={20} />}
          text="Status"
          router="/status"
          active={currentPath === "/status"}
        />
        <SidebarItem
          icon={<UserPlus size={20} />}
          text="Cadastro de usuarios"
          router="/cadastrousuarios"
          active={currentPath === "/cadastrousuarios"}
        />
        <SidebarItem
          icon={<Users size={20} />}
          text="Usuários"
          router="/usuarios"
          active={currentPath === "/usuarios"}
        />
        <SidebarItem
          icon={<ShoppingCart size={20} />}
          text="Pedidos"
          router="/pedidos"
          active={currentPath === "/pedidos"}
        />
        <SidebarItem
          icon={<TrendingUp size={20} />}
          text="Relatórios"
          router="/relatorios"
          alert
          active={currentPath === "/relatorios"}
        />
        <SidebarItem
          icon={<Calculator size={20} />}
          text="Financeiro"
          router="/financeiro"
          active={currentPath === "/financeiro"}
        />
      </Sidebar>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
