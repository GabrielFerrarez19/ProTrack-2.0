import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { ConfirmacaoEmail } from "./pages/ConfirmacaoEmail";
import { Status } from "./pages/Status";
import { RedefinirSenha } from "./pages/RedefirirSenha";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/confirmacaoemail" element={<ConfirmacaoEmail />}></Route>
      <Route path="/redefinirsenha" element={<RedefinirSenha />}></Route>
      <Route path="/status" element={<Status />}></Route>
    </Routes>
  );
}
