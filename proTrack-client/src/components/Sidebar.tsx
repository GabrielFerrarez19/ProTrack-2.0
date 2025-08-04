import {
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  Monitor,
  FileText,
  Calculator,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "./ui/sidebar";

const items = [
  { title: "Dashboard", url: "/status", icon: BarChart3 },
  { title: "Produtos", url: "/", icon: Package },
  { title: "Vendas", url: "/vendas", icon: ShoppingCart },
  { title: "Clientes", url: "/clientes", icon: Users },
  { title: "Relatórios", url: "/relatorios", icon: FileText },
  { title: "Configurações", url: "/config", icon: Monitor },
  { title: "Calculadora", url: "/calc", icon: Calculator },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar className="bg-primary">
      <SidebarContent>
        <SidebarGroup>
          <div>
            <img src="" alt="" />
            <SidebarTrigger className="ml-4" />
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 p-4">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center p-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <SidebarMenuItem className="mt-8">
                <SidebarMenuButton asChild>
                  <button className="flex items-center p-3 rounded-lg text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors w-full">
                    <LogOut className="h-5 w-5" />
                    {!collapsed && <span className="ml-3">Sair</span>}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
