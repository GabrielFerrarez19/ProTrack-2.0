import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { ConfirmacaoEmail } from "./pages/ConfirmacaoEmail";
import { Status } from "./pages/Status";
import { RedefinirSenha } from "./pages/RedefirirSenha";
import { DefaultLayout } from "./layout/DefaultLayout/Index";
import { CadProduct } from "./pages/CadProduct";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/confirmacaoemail" element={<ConfirmacaoEmail />} />
        <Route path="/redefinirsenha" element={<RedefinirSenha />} />
        <Route path="/status" element={<Status />} />
        <Route path="/cadastroprodutos" element={<CadProduct />} />
      </Route>
    </Routes>
  );
}
