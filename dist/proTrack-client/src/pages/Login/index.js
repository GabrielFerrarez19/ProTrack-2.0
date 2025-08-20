"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = Login;
const react_1 = require("react");
const mesh_gradient_svg_1 = __importDefault(require("../../assets/mesh-gradient.svg"));
const button_1 = require("../../components/button");
const input_1 = require("../../components/input");
const checkbox_1 = require("../../components/ui/checkbox");
const react_router_dom_1 = require("react-router-dom");
const api_1 = require("../../services/api");
function Login() {
    const [email, setEmail] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [mostrarSenha, setMostrarSenha] = (0, react_1.useState)(false);
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleCheckboxChange = () => {
        setMostrarSenha(!mostrarSenha);
    };
    const handleClickLogin = async () => {
        try {
            const emailDigitado = email; // pegando do input
            const senhaDigitada = password; // pegando do input
            const result = await (0, api_1.loginUser)(emailDigitado, senhaDigitada);
            console.log("Login sucesso:", result);
            navigate("/status");
        }
        catch (error) {
            console.error("Erro no login", error);
        }
    };
    return (<div className="flex justify-center gap-9">
      <div className="bg-no-repeat bg-cover bg-center h-screen w-133 flex items-center justify-center" style={{ backgroundImage: `url(${mesh_gradient_svg_1.default})` }}>
        <div className="flex w-100 h-90 bg-zinc-300/50 rounded-2xl justify-center items-center gap-3">
          <div className="flex flex-col w-87 h-48">
            <strong className="text-3xl text-[var(--blue-800)]">
              Sistema de gestão empresarial
            </strong>
            <strong className="text-3xl bg-gradient-to-r from-[var(--blue-500)] to-[var(--purple-300)] bg-clip-text text-transparent">
              Pro Track
            </strong>
            <span className="text-[var(--zinc-300)] font-semibold">
              Otimize sua empresa com nosso sistema de gestão: eficiência,
              controle e crescimento garantidos!
            </span>
          </div>
        </div>
      </div>
      <div className="bg-transparent w-133 flex justify-center items-center">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <strong className="text-3xl text-[var(--blue-800)]">
              Bem vindo!
            </strong>
            <span className="text-sm text-[var(--zinc-input)]">
              Insira suas credenciais para acessar sua conta.
            </span>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleClickLogin();
        }}>
            <input_1.Input TextLabel="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input_1.Input TextLabel="Senha" type={mostrarSenha ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}/>
            <div className="flex justify-between">
              <label className="inline-flex items-center space-x-2 cursor-pointer">
                <checkbox_1.Checkbox className="border-2 rounded-sm" checked={mostrarSenha} onCheckedChange={handleCheckboxChange}/>
                <span className="text-[#16164D] font-semibold">
                  Mostrar senha
                </span>
              </label>

              <span className="text-[#3571FD] font-semibold cursor-pointer" onClick={() => navigate("/confirmacaoemail")}>
                Esqueceu a senha?
              </span>
            </div>
            <button_1.Button type="submit" Text="Entrar"/>
          </form>
        </div>
      </div>
    </div>);
}
