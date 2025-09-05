import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { ConfirmacaoEmail } from "./pages/ConfirmacaoEmail";
import { Status } from "./pages/Status";
import { RedefinirSenha } from "./pages/RedefirirSenha";
import { DefaultLayout } from "./layout/DefaultLayout/Index";
import { CadProduct } from "./pages/CadProduct";
import { CacUsers } from "./pages/CadClient";
import { Estoque } from "./pages/Estoque";
import { Cliente } from "./pages/Clientes";
import { Vendas } from "./pages/Vendas";
import { TotalVendas } from "./pages/TotalVenda";
import { DashboardFinanceiro } from "./pages/Financeiro";
import { RelatoriosFinanceiros } from "./pages/RelatoriosFinanceiros";
import { ConfiguracoesFinanceiras } from "./pages/ConfigFinanceiro";
import { ContasPagar } from "./pages/ContasPagar";
import { ContasReceber } from "./pages/ContasReceber";
import { FluxoCaixa } from "./pages/FluxoCaixa";
import { CadastroContasPagar } from "./pages/CadastroContasPagar";
import { ConfigUsers } from "./pages/ConfigUsers";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";

export function Router() {
  return (
    <Routes>
      {/* Rotas públicas - apenas para usuários não autenticados */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/confirmacaoemail"
        element={
          <PublicRoute>
            <ConfirmacaoEmail />
          </PublicRoute>
        }
      />
      <Route
        path="/redefinirsenha"
        element={
          <PublicRoute>
            <RedefinirSenha />
          </PublicRoute>
        }
      />

      {/* Redirecionamento da rota raiz */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Rotas protegidas - apenas para usuários autenticados */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DefaultLayout />
          </ProtectedRoute>
        }
      >
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
        <Route path="/contasPagar" element={<ContasPagar />} />
        <Route path="/contasReceber" element={<ContasReceber />} />
        <Route path="/flucoCaixa" element={<FluxoCaixa />} />
        <Route path="/cadastrocontaspagar" element={<CadastroContasPagar />} />

        {/* Rota de configuração de usuário - apenas para admins */}
        <Route path="/user" element={<ConfigUsers />} />
      </Route>
    </Routes>
  );
}
