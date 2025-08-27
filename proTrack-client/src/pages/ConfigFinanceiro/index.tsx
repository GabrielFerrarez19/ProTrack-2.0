import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Save } from "lucide-react";

import { Alertas } from "./components/Alertas";
import { Categorias } from "./components/Categorias";
import { ContasBancarias } from "./components/ContasBancarias";
import { MetodosPagamento } from "./components/MetodosPagamento";
import type {
  ContaBancaria,
  MetodoPagamento,
  Categoria,
} from "../../@types/types.components";
import { LimitesFluxo } from "./components/LimitesFluxoCaixa";
import { fetchMetodosPagamento } from "../../services/api"; // API que retorna todos os métodos do banco

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
    []
  );

  const [categorias] = useState<Categoria[]>([
    { id: "1", nome: "Vendas", tipo: "receita", cor: "#22c55e" },
    { id: "2", nome: "Serviços", tipo: "receita", cor: "#3b82f6" },
    { id: "3", nome: "Mercadorias", tipo: "despesa", cor: "#ef4444" },
    { id: "4", nome: "Salários", tipo: "despesa", cor: "#f97316" },
    { id: "5", nome: "Utilidades", tipo: "despesa", cor: "#8b5cf6" },
    { id: "6", nome: "Marketing", tipo: "despesa", cor: "#ec4899" },
  ]);

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

  // Busca métodos de pagamento do banco ao montar
  useEffect(() => {
    const loadMetodos = async () => {
      try {
        const dados = await fetchMetodosPagamento(); // retorna {id, nome, tipo, ativo} de todos
        setMetodosPagamento(dados);
      } catch (error) {
        console.error("Erro ao carregar métodos de pagamento:", error);
      }
    };
    loadMetodos();
  }, []);

  const handleSalvarConfiguracoes = () => {
    console.log("Configurações salvas", {
      contasBancarias,
      metodosPagamento,
      categorias,
      alertas,
      limites,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Configurações Financeiras
        </h1>
        <p className="text-muted-foreground">
          Configure contas, métodos de pagamento, categorias e alertas
        </p>
      </div>

      <ContasBancarias
        contasBancarias={contasBancarias}
        setContasBancarias={setContasBancarias}
      />
      <MetodosPagamento
        metodosPagamento={metodosPagamento}
        setMetodosPagamento={setMetodosPagamento}
      />
      <Categorias categorias={categorias} />
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
