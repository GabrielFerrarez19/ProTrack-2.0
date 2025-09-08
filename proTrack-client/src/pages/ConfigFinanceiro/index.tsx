import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Save } from "lucide-react";

import { Alertas } from "./components/Alertas";
import { Categorias } from "./components/Categorias";
import { ContasBancarias } from "./components/ContasBancarias";
import { MetodosPagamento } from "./components/MetodosPagamento";
import { LimitesFluxo } from "./components/LimitesFluxoCaixa";

import type {
  ContaBancaria,
  MetodoPagamento,
  Categoria,
} from "../../@types/types.components";

import {
  createCategoria,
  deleteCategoriaApi,
  fetchCategorias,
  fetchMetodosPagamento,
  updateCategoriaApi,
} from "../../services/api";
import type { MetodoPagamentoConfig } from "../../@types/types.api";
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
    []
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

  // Busca métodos de pagamento
  useEffect(() => {
    const loadMetodos = async () => {
      try {
        const dados: MetodoPagamentoConfig[] = await fetchMetodosPagamento();

        // Filtrar apenas os tipos compatíveis
        const metodosFiltrados: MetodoPagamento[] = dados.filter(
          (item): item is MetodoPagamento =>
            item.tipo === "dinheiro" ||
            item.tipo === "cartao" ||
            item.tipo === "pix" ||
            item.tipo === "transferencia" ||
            item.tipo === "aprazo"
        );

        setMetodosPagamento(metodosFiltrados);
      } catch (error) {
        console.error("Erro ao carregar métodos de pagamento:", error);
      }
    };
    loadMetodos();
  }, []);

  // Busca categorias
  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const dados = await fetchCategorias();
        setCategorias(dados);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };
    loadCategorias();
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

  // Funções para manipular categorias usando API
  const handleAddCategoria = async (nova: Categoria) => {
    try {
      await createCategoria(nova);
      setCategorias((prev) => [...prev, nova]);
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
    }
  };

  const handleUpdateCategoria = async (categoriaAtualizada: Categoria) => {
    try {
      await updateCategoriaApi(categoriaAtualizada);
      setCategorias((prev) =>
        prev.map((c) =>
          c.id === categoriaAtualizada.id ? categoriaAtualizada : c
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
    }
  };

  const handleDeleteCategoria = async (id: string) => {
    try {
      await deleteCategoriaApi(id);
      setCategorias((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
    }
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
