import { useState } from "react";
import { Header } from "@/components/header";
import { StatusSeguranca } from "./components/StatusSeguranca";
import { AlterarSenha } from "./components/AlterarSenha";
import { Autenticacao2FA } from "./components/Autenticacao2FA";
import { ConfiguracoesSistema } from "./components/ConfiguracoesSistema";
import { SessoesAtivas } from "./components/SessoesAtivas";

export function Seguranca() {
  const [config2FA, setConfig2FA] = useState({
    ativo: false,
    emailBackup: true,
    codigoRecuperacao: true,
  });

  const [configSistema, setConfigSistema] = useState({
    loginAutomatico: false,
    notificacoesSeguranca: true,
    logAtividades: true,
    bloqueioTentativas: true,
  });

  const [sessoes] = useState([
    {
      id: "1",
      dispositivo: "Chrome - Windows",
      localizacao: "SP",
      ultimoAcesso: "Agora",
      atual: true,
    },
    {
      id: "2",
      dispositivo: "Safari - iPhone",
      localizacao: "SP",
      ultimoAcesso: "2h atrás",
      atual: false,
    },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-6xl">
        <Header
          title="Bem vindo a página de segurança!"
          text="Aqui você pode configurar suas opções de segurança e controle de acesso"
        />

        <div className="grid gap-6 lg:grid-cols-2 mt-8">
          <div className="space-y-6">
            <StatusSeguranca senhaForte={true} doisFA={config2FA.ativo} />
            <AlterarSenha />
            <Autenticacao2FA config={config2FA} setConfig={setConfig2FA} />
          </div>

          <div className="space-y-6">
            <ConfiguracoesSistema
              config={configSistema}
              setConfig={setConfigSistema}
            />
            <SessoesAtivas sessoes={sessoes} />
          </div>
        </div>
      </div>
    </div>
  );
}
