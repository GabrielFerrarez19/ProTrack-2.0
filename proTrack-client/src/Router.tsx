import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { ConfirmacaoEmail } from "./pages/ConfirmacaoEmail";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/confirmacaoemail" element={<ConfirmacaoEmail />}></Route>
    </Routes>
  );
}
