import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { ConfirmacaoEmail } from "./pages/ConfirmacaoEmail";
import { Status } from "./pages/Status";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/confirmacaoemail" element={<ConfirmacaoEmail />}></Route>
      <Route path="/status" element={<Status />}></Route>
    </Routes>
  );
}
