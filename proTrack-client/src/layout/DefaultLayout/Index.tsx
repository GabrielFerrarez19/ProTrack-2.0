import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import {
  Monitor,
  Users,
  ShoppingCart,
  TrendingUp,
  Calculator,
} from "lucide-react";
import { SidebarItem } from "../../components/Sidebar/SidebarItem";

export function DefaultLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex h-screen">
      <Sidebar>
        <SidebarItem
          icon={<Monitor size={20} />}
          text="Dashboard"
          router="/status"
          active={currentPath === "/status"}
        />
        <SidebarItem
          icon={<Users size={20} />}
          text="Usuários"
          router="/cadastrousuarios"
          active={currentPath === "/cadastrousuarios"}
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
