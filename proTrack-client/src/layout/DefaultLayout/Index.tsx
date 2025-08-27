import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import {
  ShoppingCart,
  Calculator,
  ChartPie,
  PackagePlus,
  PackageSearch,
  UserPlus,
  UserSearch,
  Store,
  FileText,
} from "lucide-react";
import { SidebarItem } from "../../components/Sidebar/SidebarItem";

export function DefaultLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex h-screen">
      <Sidebar>
        {/* Área de visão geral */}
        <SidebarItem
          icon={<ChartPie size={20} />}
          text="Status"
          router="/status"
          active={currentPath === "/status"}
        />

        {/* Área de cadastros */}
        <SidebarItem
          icon={<PackagePlus size={20} />}
          text="Cadastrar produto"
          router="/cadastroprodutos"
          active={currentPath === "/cadastroprodutos"}
        />
        <SidebarItem
          icon={<UserPlus size={20} />}
          text="Cadastrar cliente"
          router="/cadastrodeclientes"
          active={currentPath === "/cadastrodeclientes"}
        />

        {/* Área de gestão */}
        <SidebarItem
          icon={<PackageSearch size={20} />}
          text="Produtos"
          router="/produtos"
          active={currentPath === "/produtos"}
        />
        <SidebarItem
          icon={<UserSearch size={20} />}
          text="Clientes"
          router="/clientes"
          active={currentPath === "/clientes"}
        />

        {/* Área de vendas */}
        <SidebarItem
          icon={<Store size={20} />}
          text="Nova venda"
          router="/venda"
          active={currentPath === "/venda"}
        />
        <SidebarItem
          icon={<ShoppingCart size={20} />}
          text="Histórico de vendas"
          router="/totalVendas"
          active={currentPath === "/totalVendas"}
        />

        {/* Área de análise e gestão financeira */}
        <SidebarItem
          icon={<FileText size={20} />}
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
