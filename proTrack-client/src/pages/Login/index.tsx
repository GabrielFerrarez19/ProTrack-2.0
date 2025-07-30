import { useState } from "react";
import img from "../../assets/mesh-gradient.svg";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { Checkbox } from "../../components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./../../../services/api";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();

  const handleCheckboxChange = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const handleClickLogin = async () => {
    try {
      const emailDigitado = "gabriel@example.com"; // pegando do input
      const senhaDigitada = "123456"; // pegando do input
      const result = await loginUser(emailDigitado, senhaDigitada);
      console.log("Login sucesso:", result);
    } catch (error) {
      console.error("Erro no login", error);
    }
  };

  return (
    <div className="flex justify-center gap-9">
      <div
        className="bg-no-repeat bg-cover bg-center h-screen w-133 flex items-center justify-center"
        style={{ backgroundImage: `url(${img})` }}
      >
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
          <Input
            TextLabel="Email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            TextLabel="Senha"
            type={mostrarSenha ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-between">
            <label className="inline-flex items-center space-x-2 cursor-pointer">
              <Checkbox
                className="border-2 rounded-sm"
                checked={mostrarSenha}
                onCheckedChange={handleCheckboxChange}
              />
              <span className="text-[#16164D] font-semibold">
                Mostrar senha
              </span>
            </label>
            <span
              className="text-[#3571FD] font-semibold cursor-pointer"
              onClick={() => navigate("/redefinirsenha")}
            >
              Esqueceu a senha?
            </span>
          </div>
          <Button action={handleClickLogin} Text="Entrar" />
        </div>
      </div>
    </div>
  );
}
