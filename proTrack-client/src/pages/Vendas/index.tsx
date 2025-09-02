import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../components/ui/button";
import { vendaSchema, type VendaForm } from "../../schemas/schemaVendas";
import { InformacoesVenda } from "./components/InformacoesVenda";
import { ResumoVenda } from "./components/ResumoVenda";
import { ProdutosTable } from "./components/ProdutosTable";
import { Header } from "../../components/header";
import { useProdutos } from "../../hooks/useProdutos";
import { useState, useEffect } from "react";
import { criarVenda } from "../../services/api";
import type { VendaData } from "../../@types/types.api";

// Sonner Toast
import { toast, Toaster } from "sonner";

export function Vendas() {
  const methods = useForm<VendaForm>({
    resolver: zodResolver(vendaSchema),
    defaultValues: {
      clienteId: "",
      dataVenda: new Date().toISOString().split("T")[0],
      desconto: 0,
      total: 0,
      totalComDesconto: 0,
      status: "Pendente",
      produtos: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "produtos",
  });

  const watchedProdutos = methods.watch("produtos");
  const { products } = useProdutos();
  const [totalGeral, setTotalGeral] = useState(0);
  const [totalComDesconto, setTotalComDesconto] = useState(0);

  const atualizarPrecoProduto = (index: number, produtoId: string) => {
    const produto = products.find((p) => String(p.id) === produtoId);
    if (produto) {
      methods.setValue(
        `produtos.${index}.precoUnitario`,
        Number(produto.preco_venda) || 0
      );
    } else {
      methods.setValue(`produtos.${index}.precoUnitario`, 0);
    }
  };

  const onSubmit = async (data: VendaForm) => {
    console.log("=== onSubmit chamado ===");
    console.log("Dados recebidos:", data);
    console.log("Erros do formulário:", methods.formState.errors);
    console.log("Produtos no campo:", fields);
    console.log("Forma de pagamento selecionada:", data.formaPagamento);

    data.totalComDesconto = totalComDesconto;
    data.total = totalGeral;

    try {
      const vendaParaEnviar: VendaData = {
        clienteId: data.clienteId,
        dataVenda: data.dataVenda,
        desconto: data.desconto,
        total: data.total,
        totalComDesconto: data.totalComDesconto,
        status: "pendente",
        diasVencimento: data.diasVencimento,
        produtos: data.produtos.map((p) => ({
          produtoId: p.produtoId,
          quantidade: p.quantidade,
          precoUnitario: p.precoUnitario,
          desconto: p.desconto ?? 0,
        })),
        formaPagamento: data.formaPagamento,
      };

      console.log("Venda a enviar para API:", vendaParaEnviar);

      const resposta = await criarVenda(vendaParaEnviar);
      console.log("Venda cadastrada com sucesso:", resposta);

      toast.success("Venda cadastrada com sucesso!", {
        style: { background: "#4ade80", color: "#065f46" },
      });

      methods.reset({
        clienteId: "",
        dataVenda: new Date().toISOString().split("T")[0],
        desconto: 0,
        total: 0,
        totalComDesconto: 0,
        status: "Pendente",
        produtos: [],
      });
      setTotalGeral(0);
      setTotalComDesconto(0);
    } catch (error) {
      console.error("Erro ao cadastrar venda:", error);
      toast.error("Erro ao cadastrar venda. Verifique os dados!", {
        style: { background: "#f87171", color: "#7f1d1d" },
      });
    }
  };

  useEffect(() => {
    console.log("Campos produtos atualizados:", watchedProdutos);
  }, [watchedProdutos]);

  useEffect(() => {
    console.log("FormState.errors:", methods.formState.errors);
  }, [methods.formState.errors]);

  return (
    <>
      <Toaster position="top-right" richColors />

      <div className="p-6 space-y-6">
        <Header
          title="Bem vindo a página Venda!"
          text="Aqui você pode registar suas vendas"
        />

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InformacoesVenda control={methods.control} />
              <ResumoVenda
                produtos={watchedProdutos}
                onChangeResumo={({ totalPreco, valorComDesconto }) => {
                  setTotalGeral(totalPreco);
                  setTotalComDesconto(valorComDesconto);
                }}
              />
            </div>

            <ProdutosTable
              fields={fields}
              append={append}
              remove={remove}
              control={methods.control}
              atualizarPrecoProduto={atualizarPrecoProduto}
              produtos={products}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  methods.reset({
                    clienteId: "",
                    dataVenda: new Date().toISOString().split("T")[0],
                    desconto: 0,
                    total: 0,
                    totalComDesconto: 0,
                    status: "Pendente",
                    produtos: [],
                  });
                  setTotalGeral(0);
                  setTotalComDesconto(0);
                }}
                className="cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-500 cursor-pointer"
              >
                Cadastrar Venda
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
}
