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
  BarChart3,
  BanknoteArrowUp,
  BanknoteArrowDown,
  TrendingUp,
} from "lucide-react";
import { SidebarItem } from "../../components/Sidebar/SidebarItem";

export function DefaultLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex h-screen">
      <Sidebar>
        {/* 📊 Visão Geral */}
        <SidebarItem
          icon={<ChartPie size={20} />}
          text="Status"
          router="/status"
          active={currentPath === "/status"}
        />

        {/* 🗂️ Cadastros */}
        <SidebarItem
          icon={<PackagePlus size={20} />}
          text="Novo Produto"
          router="/cadastroprodutos"
          active={currentPath === "/cadastroprodutos"}
          requiredRoles={["admin", "operador"]}
        />
        <SidebarItem
          icon={<UserPlus size={20} />}
          text="Novo Cliente"
          router="/cadastrodeclientes"
          active={currentPath === "/cadastrodeclientes"}
          requiredRoles={["admin", "operador"]}
        />

        {/* 📦 Gestão */}
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

        {/* 🛒 Vendas */}
        <SidebarItem
          icon={<Store size={20} />}
          text="Nova Venda"
          router="/venda"
          active={currentPath === "/venda"}
          requiredRoles={["admin", "vendedor"]}
        />
        <SidebarItem
          icon={<ShoppingCart size={20} />}
          text="Histórico de Vendas"
          router="/totalVendas"
          active={currentPath === "/totalVendas"}
          requiredRoles={["admin", "financeiro", "vendedor"]}
        />

        {/* 💰 Financeiro */}
        <SidebarItem
          icon={<Calculator size={20} />}
          text="Financeiro"
          router="/financeiro"
          active={currentPath === "/financeiro"}
          requiredRoles={["admin", "financeiro"]}
        />
        <SidebarItem
          icon={<BanknoteArrowUp size={20} />}
          text="Contas a Pagar"
          router="/contasPagar"
          active={currentPath === "/contasPagar"}
          requiredRoles={["admin", "financeiro"]}
        />
        <SidebarItem
          icon={<BanknoteArrowDown size={20} />}
          text="Contas a Receber"
          router="/contasReceber"
          active={currentPath === "/contasReceber"}
          requiredRoles={["admin", "financeiro"]}
        />
        <SidebarItem
          icon={<TrendingUp size={20} />}
          text="Fluxo de Caixa"
          router="/flucoCaixa"
          active={currentPath === "/flucoCaixa"}
          requiredRoles={["admin", "financeiro"]}
        />
        <SidebarItem
          icon={<BarChart3 size={20} />}
          text="Relatórios"
          router="/relatorio"
          alert
          active={currentPath === "/relatorio"}
          requiredRoles={["admin", "financeiro"]}
        />
      </Sidebar>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
