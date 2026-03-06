import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../components/ui/button";
import { vendaSchema, type VendaForm } from "../../schemas/schemaVendas";
import { InformacoesVenda } from "./components/InformacoesVenda";
import { ResumoVenda } from "./components/ResumoVenda";
import { ProdutosTable } from "./components/ProdutosTable";
import { Header } from "../../components/header";
import { useProdutos } from "../../hooks/useProdutos";
import { useVendas } from "../../hooks/useVendas";
import { useAuth } from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import type { SaleRequest } from "../../@types/sales";

// Sonner Toast
import { toast } from "sonner";

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
      formaPagamento: "cash",
      parcelas: 1,
      entrada: 0,
      produtos: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "produtos",
  });

  const watchedProdutos = methods.watch("produtos");
  const { products } = useProdutos();
  const { submitVenda, loading } = useVendas();
  const { companyID, user } = useAuth();
  const [totalGeral, setTotalGeral] = useState(0);
  const [totalComDesconto, setTotalComDesconto] = useState(0);

  const atualizarPrecoProduto = (index: number, produtoId: string) => {
    const produto = products.find((p) => String(p.id) === produtoId);
    if (produto) {
      methods.setValue(
        `produtos.${index}.precoUnitario`,
        Number(produto.sale_price) || 0,
      );
    } else {
      methods.setValue(`produtos.${index}.precoUnitario`, 0);
    }
  };

  const onSubmit = async (data: VendaForm) => {
    if (!companyID || !user?.id) {
      toast.error("Usuário ou empresa não identificados. Faça login novamente.", {
        style: { background: "#f87171", color: "#7f1d1d" },
      });
      return;
    }

    const saleRequest: SaleRequest = {
      customer_id: data.clienteId,
      discount_amount: data.desconto ?? 0,
      subtotal: totalGeral,
      total_amount: totalComDesconto,
      payment_method: data.formaPagamento ?? "cash",
      due_days:
        data.formaPagamento === "installments"
          ? (data.diasVencimento ?? 1)
          : undefined,
      installments_count:
        data.formaPagamento === "installments"
          ? (data.parcelas ?? 1)
          : 1,
      status: data.status ?? "Pendente",
      prohibited: data.entrada ?? 0,
      items: data.produtos.map((p) => ({
        product_id: p.produtoId,
        quantity: p.quantidade,
        unit_price: p.precoUnitario,
        discount: p.desconto ?? 0,
      })),
    };

    try {
      await submitVenda(saleRequest);
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
        formaPagamento: "cash",
        parcelas: 1,
        entrada: 0,
        produtos: [],
      });
      setTotalGeral(0);
      setTotalComDesconto(0);
    } catch {
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
                  formaPagamento: "cash",
                  parcelas: 1,
                  entrada: 0,
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
              disabled={loading}
              className="bg-green-600 hover:bg-green-500 cursor-pointer"
            >
              {loading ? "Cadastrando..." : "Cadastrar Venda"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
