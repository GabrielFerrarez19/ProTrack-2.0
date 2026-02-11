import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Save } from "lucide-react";

import { Alertas } from "./components/Alertas";
import { Categorias } from "./components/Categorias";
import { CategoriasProduto } from "../CategoriasProduto";
import { ContasBancarias } from "./components/ContasBancarias";
import { MetodosPagamento } from "./components/MetodosPagamento";
import { LimitesFluxo } from "./components/LimitesFluxoCaixa";

import type {
  ContaBancaria,
  MetodoPagamento,
  Categoria,
} from "../../@types/types.components";
import { Header } from "../../components/header";
// service que criamos

export function ConfiguracoesFinanceiras() {
  const [contasBancarias, setContasBancarias] = useState<ContaBancaria[]>([
    {
      id: "1",
      nome: "Conta Principal",
      banco: "Banco do Brasil",
      agencia: "1234-5",
      conta: "12345-6",
      saldo: 45200.3,
      ativa: true,
    },
    {
      id: "2",
      nome: "Conta Reserva",
      banco: "Banco Itaú",
      agencia: "5678-9",
      conta: "67890-1",
      saldo: 18500.5,
      ativa: true,
    },
  ]);

  const [metodosPagamento, setMetodosPagamento] = useState<MetodoPagamento[]>(
    [],
  );
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [alertas, setAlertas] = useState({
    contasVencidas: true,
    estoqueMinimo: true,
    fluxoCaixaNegativo: true,
    metaVendas: false,
    limiteCredito: true,
  });

  const [limites, setLimites] = useState({
    limiteDiario: 5000,
    limiteSemanal: 25000,
    limiteMensal: 100000,
    alertaFluxoCaixa: 10000,
  });

  useEffect(() => {
    setMetodosPagamento([]);
  }, []);

  useEffect(() => {
    setCategorias([]);
  }, []);

  // Salvar todas as configurações localmente (ou chamar API)
  const handleSalvarConfiguracoes = () => {
    console.log("Configurações salvas", {
      contasBancarias,
      metodosPagamento,
      categorias,
      alertas,
      limites,
    });
  };

  const handleAddCategoria = async (nova: Categoria) => {
    setCategorias((prev) => [...prev, nova]);
  };

  const handleUpdateCategoria = async (categoriaAtualizada: Categoria) => {
    setCategorias((prev) =>
      prev.map((c) =>
        c.id === categoriaAtualizada.id ? categoriaAtualizada : c,
      ),
    );
  };

  const handleDeleteCategoria = async (id: string) => {
    setCategorias((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Configurações Financeiras"
        text="Configure contas, métodos de pagamento, categorias e alertas"
      />

      <ContasBancarias
        contasBancarias={contasBancarias}
        setContasBancarias={setContasBancarias}
      />

      <MetodosPagamento
        metodosPagamento={metodosPagamento}
        setMetodosPagamento={setMetodosPagamento}
      />

      <Categorias
        categorias={categorias}
        onAddCategoria={handleAddCategoria}
        onUpdateCategoria={handleUpdateCategoria}
        onDeleteCategoria={handleDeleteCategoria}
      />

      <CategoriasProduto />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LimitesFluxo limites={limites} setLimites={setLimites} />
        <Alertas alertas={alertas} setAlertas={setAlertas} />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSalvarConfiguracoes}
          className="bg-gradient-primary"
        >
          <Save className="h-4 w-4 mr-2" />
          Salvar Todas as Configurações
        </Button>
      </div>
    </div>
  );
}
