import { useState } from "react";
import img from "../../assets/mesh-gradient.svg";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { useNavigate } from "react-router-dom";

export function RedefinirSenha() {
  const navigate = useNavigate();

  const [password1, setEmail1] = useState();

  const [password2, setEmail2] = useState();

  const handleEntrar = () => {
    setEmail1(password1);

    setEmail2(password2);

    if (password1 === password2) {
      navigate("/");
    } else {
      console.log("As senhas não são iguais");
    }
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
              Insira a sua nova senha!
            </span>
          </div>
          <Input TextLabel="Senha" type="text" value={password1} />
          <Input TextLabel="Confirmar senha" type="text" value={password2} />
          <Button onClick={handleEntrar} Text="Enviar" type="submit"></Button>
        </div>
      </div>
    </div>
  );
}
