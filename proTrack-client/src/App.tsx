import { BrowserRouter } from "react-router-dom";
import { Router } from "./Router";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./contexts/auth/AuthProvider";
import "./index.css";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Router />
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </BrowserRouter>
  );
}
