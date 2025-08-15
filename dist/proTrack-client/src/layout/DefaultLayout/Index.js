"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultLayout = DefaultLayout;
const react_router_dom_1 = require("react-router-dom");
const Sidebar_1 = require("../../components/Sidebar/Sidebar");
const lucide_react_1 = require("lucide-react");
const SidebarItem_1 = require("../../components/Sidebar/SidebarItem");
function DefaultLayout() {
    const location = (0, react_router_dom_1.useLocation)();
    const currentPath = location.pathname;
    return (<div className="flex h-screen">
      <Sidebar_1.Sidebar>
        <SidebarItem_1.SidebarItem icon={<lucide_react_1.ChartPie size={20}/>} text="Status" router="/status" active={currentPath === "/status"}/>
        <SidebarItem_1.SidebarItem icon={<lucide_react_1.PackagePlus size={20}/>} text="Cadastro de produtos" router="/cadastroprodutos" active={currentPath === "/cadastroprodutos"}/>
        <SidebarItem_1.SidebarItem icon={<lucide_react_1.PackageSearch size={20}/>} text="Produtos" router="/produtos" active={currentPath === "/produtos"}/>
        <SidebarItem_1.SidebarItem icon={<lucide_react_1.UserPlus size={20}/>} text="Cadastro de clientes" router="/cadastrodeclientes" active={currentPath === "/cadastrodeclientes"}/>
        <SidebarItem_1.SidebarItem icon={<lucide_react_1.UserSearch size={20}/>} text="Clientes" router="/clientes" active={currentPath === "/clientes"}/>
        <SidebarItem_1.SidebarItem icon={<lucide_react_1.Store size={20}/>} text="Venda" router="/venda" active={currentPath === "/venda"}/>
        <SidebarItem_1.SidebarItem icon={<lucide_react_1.ShoppingCart size={20}/>} text="Total vendas" router="/totalVendas" active={currentPath === "/totalVendas"}/>
        <SidebarItem_1.SidebarItem icon={<lucide_react_1.TrendingUp size={20}/>} text="Relatórios" router="/relatorios" alert active={currentPath === "/relatorios"}/>
        <SidebarItem_1.SidebarItem icon={<lucide_react_1.Calculator size={20}/>} text="Financeiro" router="/financeiro" active={currentPath === "/financeiro"}/>
      </Sidebar_1.Sidebar>
      <main className="flex-1 overflow-auto">
        <react_router_dom_1.Outlet />
      </main>
    </div>);
}
