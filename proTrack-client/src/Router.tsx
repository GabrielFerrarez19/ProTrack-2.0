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
import { DefaultConfigLayout } from "./layout/DefaultConfigLayout";
import Usuarios from "./pages/Usuarios";
import { NotFound } from "./pages/NotFound";

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

      <Route
        path="cadastrocontaspagar"
        element={
          <ProtectedRoute requiredRoute="/cadastrocontaspagar">
            <CadastroContasPagar />
          </ProtectedRoute>
        }
      />

      {/* Rotas protegidas - apenas para usuários autenticados */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DefaultLayout />
          </ProtectedRoute>
        }
      >
        <Route path="status" element={<Status />} />
        <Route
          path="cadastroprodutos"
          element={
            <ProtectedRoute requiredRoute="/cadastroprodutos">
              <CadProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="cadastrodeclientes"
          element={
            <ProtectedRoute requiredRoute="/cadastrodeclientes">
              <CacUsers />
            </ProtectedRoute>
          }
        />
        <Route path="produtos" element={<Estoque />} />
        <Route path="clientes" element={<Cliente />} />
        <Route
          path="venda"
          element={
            <ProtectedRoute requiredRoute="/venda">
              <Vendas />
            </ProtectedRoute>
          }
        />
        <Route
          path="totalVendas"
          element={
            <ProtectedRoute requiredRoute="/totalVendas">
              <TotalVendas />
            </ProtectedRoute>
          }
        />

        {/* Rotas de financeiro */}
        <Route
          path="financeiro"
          element={
            <ProtectedRoute requiredRoute="/financeiro">
              <DashboardFinanceiro />
            </ProtectedRoute>
          }
        />
        <Route
          path="relatorio"
          element={
            <ProtectedRoute requiredRoute="/relatorio">
              <RelatoriosFinanceiros />
            </ProtectedRoute>
          }
        />
        <Route
          path="contasPagar"
          element={
            <ProtectedRoute requiredRoute="/contasPagar">
              <ContasPagar />
            </ProtectedRoute>
          }
        />
        <Route
          path="contasReceber"
          element={
            <ProtectedRoute requiredRoute="/contasReceber">
              <ContasReceber />
            </ProtectedRoute>
          }
        />
        <Route
          path="flucoCaixa"
          element={
            <ProtectedRoute requiredRoute="/flucoCaixa">
              <FluxoCaixa />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Rotas de configurações com layout próprio */}
      <Route
        path="/config"
        element={
          <ProtectedRoute>
            <DefaultConfigLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="financeiro"
          element={
            <ProtectedRoute requiredRoute="/config/financeiro">
              <ConfiguracoesFinanceiras />
            </ProtectedRoute>
          }
        />
        <Route
          path="user"
          element={
            <ProtectedRoute requiredRoute="/config/user">
              <ConfigUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="usuarios"
          element={
            <ProtectedRoute requiredRoute="/config/usuarios">
              <Usuarios />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Rota 404 - deve ser a última */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
