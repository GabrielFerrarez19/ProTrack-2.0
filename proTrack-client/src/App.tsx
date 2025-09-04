import { BrowserRouter } from "react-router-dom";
import { Router } from "./Router";
import { Toaster } from "./components/ui/sonner";
import "./index.css";

export function App() {
  return (
    <BrowserRouter>
      <Router />
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}
