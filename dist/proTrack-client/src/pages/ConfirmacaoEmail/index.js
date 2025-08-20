"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmacaoEmail = ConfirmacaoEmail;
const react_1 = require("react");
const mesh_gradient_svg_1 = __importDefault(require("../../assets/mesh-gradient.svg"));
const button_1 = require("../../components/button");
const input_1 = require("../../components/input");
const react_router_dom_1 = require("react-router-dom");
function ConfirmacaoEmail() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [email1, setEmail1] = (0, react_1.useState)();
    const [email2, setEmail2] = (0, react_1.useState)();
    const handleEntrar = () => {
        setEmail1(email1);
        setEmail2(email2);
        if (email1 === email2) {
            navigate("/redefinirsenha");
        }
        else {
            console.log("Email não são iguais");
        }
    };
    return (<div className="bg-no-repeat bg-cover bg-center h-screen w-full flex items-center justify-center" style={{ backgroundImage: `url(${mesh_gradient_svg_1.default})` }}>
      <div className="flex w-117 h-96 bg-zinc-300/50 rounded-2xl justify-center items-center gap-3">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <strong className="text-3xl text-[var(--blue-800)]">
              Recupere sua senha!
            </strong>
            <span className="text-sm w-80 font-semibold text-[var(--zinc-input)]">
              Insira o e-mail cadastrado para receber link de recuperação!
            </span>
          </div>
          <input_1.Input TextLabel="E-mail" type="text" value={email1}/>
          <input_1.Input TextLabel="Confirmar e-mail" type="text" value={email2}/>
          <button_1.Button onClick={handleEntrar} Text="Enviar" type="submit"></button_1.Button>
        </div>
      </div>
    </div>);
}
