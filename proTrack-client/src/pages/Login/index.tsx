import { useState } from "react";
import img from "../../assets/mesh-gradient.svg";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { Checkbox } from "../../components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { login } from "@/services/auth";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [aud] = useState("protrack");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCheckboxChange = () => {
    setMostrarSenha(!mostrarSenha);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const { access_token } = await login({
        email,
        password,
        aud,
      });

      localStorage.setItem("access_token", access_token);

      navigate("/status");
    } catch {
      setError("Email ou senha inválidos");
    } finally {
      setIsLoading(false);
    }
  }

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
          <form onSubmit={handleSubmit}>
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
                onClick={() => navigate("/confirmacaoemail")}
              >
                Esqueceu a senha?
              </span>
            </div>
            <Button
              type="submit"
              Text={isLoading ? "Entrando..." : "Entrar"}
              disabled={isLoading}
            />
            {error && (
              <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
