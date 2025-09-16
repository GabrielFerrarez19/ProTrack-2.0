import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";

import { TemaSelector } from "./components/TemaSelector";
import { CorPrincipal } from "./components/CorPrincipal";
import { Tipografia } from "./components/Tipografia";
import { LayoutConfig } from "./components/LayoutConfig";
import { EfeitosVisuais } from "./components/EfeitosVisuais";
import { Acessibilidade } from "./components/Acessibilidade";

interface CorPersonalizada {
  nome: string;
  valor: string;
  ativa: boolean;
}

export function Aparencia() {
  const [tema, setTema] = useState("sistema");
  const [tamanhoFonte, setTamanhoFonte] = useState([16]);
  const [layoutCompacto, setLayoutCompacto] = useState(false);
  const [animacoes, setAnimacoes] = useState(true);
  const [bordaArredondada, setBordaArredondada] = useState(true);
  const [contrasteAlto, setContrasteAlto] = useState(false);

  const [coresPersonalizadas, setCoresPersonalizadas] = useState<
    CorPersonalizada[]
  >([
    { nome: "Azul Corporativo", valor: "#0066cc", ativa: true },
    { nome: "Verde Natureza", valor: "#22c55e", ativa: false },
    { nome: "Roxo Moderno", valor: "#8b5cf6", ativa: false },
    { nome: "Laranja Energia", valor: "#f97316", ativa: false },
    { nome: "Rosa Criativo", valor: "#ec4899", ativa: false },
  ]);

  const handleSalvarConfiguracoes = () => {
    console.log("Aparência atualizada");
  };

  const handleSelecionarCor = (index: number) => {
    setCoresPersonalizadas((cores) =>
      cores.map((cor, i) => ({ ...cor, ativa: i === index }))
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-4xl">
        <Header
          title="Bem vindo a página de aparência!"
          text="Aqui você pode configurar suas opções de aparência"
        />

        <div className="space-y-6">
          <TemaSelector tema={tema} setTema={setTema} />
          <CorPrincipal
            cores={coresPersonalizadas}
            handleSelecionarCor={handleSelecionarCor}
          />
          <Tipografia
            tamanhoFonte={tamanhoFonte}
            setTamanhoFonte={setTamanhoFonte}
          />
          <LayoutConfig
            layoutCompacto={layoutCompacto}
            setLayoutCompacto={setLayoutCompacto}
            bordaArredondada={bordaArredondada}
            setBordaArredondada={setBordaArredondada}
          />
          <EfeitosVisuais animacoes={animacoes} setAnimacoes={setAnimacoes} />
          <Acessibilidade
            contrasteAlto={contrasteAlto}
            setContrasteAlto={setContrasteAlto}
          />

          <div className="flex justify-end">
            <Button onClick={handleSalvarConfiguracoes} size="lg">
              Salvar Configurações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
