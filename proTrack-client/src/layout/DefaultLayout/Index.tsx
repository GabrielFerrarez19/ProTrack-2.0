import { Outlet } from "react-router-dom";
import { AppSidebar } from "../../components/Sidebar";
import { SidebarProvider } from "../../components/ui/sidebar";

export function DefaultLayout() {
  return (
    <div>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <div className="flex-1 bg-background">
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
