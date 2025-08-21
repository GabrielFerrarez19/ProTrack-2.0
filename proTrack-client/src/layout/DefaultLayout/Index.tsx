import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import {
  ShoppingCart,
  TrendingUp,
  Calculator,
  ChartPie,
  PackagePlus,
  PackageSearch,
  UserPlus,
  UserSearch,
  Store,
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
          icon={<PackagePlus size={20} />}
          text="Cadastro de produtos"
          router="/cadastroprodutos"
          active={currentPath === "/cadastroprodutos"}
        />
        <SidebarItem
          icon={<PackageSearch size={20} />}
          text="Produtos"
          router="/produtos"
          active={currentPath === "/produtos"}
        />
        <SidebarItem
          icon={<UserPlus size={20} />}
          text="Cadastro de clientes"
          router="/cadastrodeclientes"
          active={currentPath === "/cadastrodeclientes"}
        />
        <SidebarItem
          icon={<UserSearch size={20} />}
          text="Clientes"
          router="/clientes"
          active={currentPath === "/clientes"}
        />
        <SidebarItem
          icon={<Store size={20} />}
          text="Venda"
          router="/venda"
          active={currentPath === "/venda"}
        />
        <SidebarItem
          icon={<ShoppingCart size={20} />}
          text="Vendas"
          router="/totalVendas"
          active={currentPath === "/totalVendas"}
        />
        <SidebarItem
          icon={<TrendingUp size={20} />}
          text="Relatórios"
          router="/relatorio"
          alert
          active={currentPath === "/relatorio"}
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
