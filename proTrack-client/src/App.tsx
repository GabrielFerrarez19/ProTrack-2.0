import { BrowserRouter } from "react-router-dom";
import { Router } from "./Router";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./contexts/auth/AuthProvider";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Desative o retry para ver o erro real no console
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Router />
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
