import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { ConfirmacaoEmail } from "./pages/ConfirmacaoEmail";
import { Status } from "./pages/Status";
import { RedefinirSenha } from "./pages/RedefirirSenha";
import { DefaultLayout } from "./layout/DefaultLayout/Index";
import { CadProduct } from "./pages/CadProduct";
import { CacUsers } from "./pages/CadClient";
import Estoque from "./pages/Estoque";
import { Cliente } from "./pages/Clientes";
import { Vendas } from "./pages/Vendas";
import { TotalVendas } from "./pages/TotalVenda";
import { DashboardFinanceiro } from "./pages/Financeiro";
import { RelatoriosFinanceiros } from "./pages/RelatoriosFinanceiros";
import { ConfiguracoesFinanceiras } from "./pages/ConfigFinanceiro";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/confirmacaoemail" element={<ConfirmacaoEmail />} />
      <Route path="/redefinirsenha" element={<RedefinirSenha />} />
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/status" element={<Status />} />
        <Route path="/cadastroprodutos" element={<CadProduct />} />
        <Route path="/cadastrodeclientes" element={<CacUsers />} />
        <Route path="/produtos" element={<Estoque />} />
        <Route path="/clientes" element={<Cliente />} />
        <Route path="/venda" element={<Vendas />} />
        <Route path="/totalVendas" element={<TotalVendas />} />
        <Route path="/financeiro" element={<DashboardFinanceiro />} />
        <Route path="/relatorio" element={<RelatoriosFinanceiros />} />
        <Route
          path="/configfinanceiro"
          element={<ConfiguracoesFinanceiras />}
        />
      </Route>
    </Routes>
  );
}
