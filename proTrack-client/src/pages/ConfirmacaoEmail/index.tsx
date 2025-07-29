import img from "../../assets/mesh-gradient.svg";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { useNavigate } from "react-router-dom";

export function ConfirmacaoEmail() {
  const navigate = useNavigate();

  const handleEntrar = () => {
    navigate("/recuperarsenha");
  };
  return (
    <div
      className="bg-no-repeat bg-cover bg-center h-screen w-full flex items-center justify-center"
      style={{ backgroundImage: `url(${img})` }}
    >
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
          <Input TextLabel="E-mail" type="text" />
          <Input TextLabel="Confirmar e-mail" type="text" />
          <Button action={handleEntrar} Text="Entrar"></Button>
        </div>
      </div>
    </div>
  );
}
