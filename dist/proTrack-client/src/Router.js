"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = Router;
const react_router_dom_1 = require("react-router-dom");
const Login_1 = require("./pages/Login");
const ConfirmacaoEmail_1 = require("./pages/ConfirmacaoEmail");
const Status_1 = require("./pages/Status");
const RedefirirSenha_1 = require("./pages/RedefirirSenha");
const Index_1 = require("./layout/DefaultLayout/Index");
const CadProduct_1 = require("./pages/CadProduct");
const CadClient_1 = require("./pages/CadClient");
const Estoque_1 = __importDefault(require("./pages/Estoque"));
const Clientes_1 = require("./pages/Clientes");
const Vendas_1 = require("./pages/Vendas");
const TotalVenda_1 = require("./pages/TotalVenda");
function Router() {
    return (<react_router_dom_1.Routes>
      <react_router_dom_1.Route path="/" element={<Login_1.Login />}/>
      <react_router_dom_1.Route path="/confirmacaoemail" element={<ConfirmacaoEmail_1.ConfirmacaoEmail />}/>
      <react_router_dom_1.Route path="/redefinirsenha" element={<RedefirirSenha_1.RedefinirSenha />}/>
      <react_router_dom_1.Route path="/" element={<Index_1.DefaultLayout />}>
        <react_router_dom_1.Route path="/status" element={<Status_1.Status />}/>
        <react_router_dom_1.Route path="/cadastroprodutos" element={<CadProduct_1.CadProduct />}/>
        <react_router_dom_1.Route path="/cadastrodeclientes" element={<CadClient_1.CacUsers />}/>
        <react_router_dom_1.Route path="/produtos" element={<Estoque_1.default />}/>
        <react_router_dom_1.Route path="/clientes" element={<Clientes_1.Cliente />}/>
        <react_router_dom_1.Route path="/venda" element={<Vendas_1.Vendas />}/>
        <react_router_dom_1.Route path="/totalVendas" element={<TotalVenda_1.TotalVendas />}/>
      </react_router_dom_1.Route>
    </react_router_dom_1.Routes>);
}
