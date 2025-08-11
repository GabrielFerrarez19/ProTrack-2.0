import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShoppingCart } from "lucide-react";
import { Button } from "../../components/ui/button";
// import { Form } from "../../components/ui/form"; // removi, para evitar conflito

import {
  vendaSchema,
  type VendaForm,
  produtos,
} from "../../schemas/schemaVendas";
import { InformacoesVenda } from "./components/InformacoesVenda";
import { ResumoVenda } from "./components/ResumoVenda";
import { ProdutosTable } from "./components/ProdutosTable";

export function Vendas() {
  const methods = useForm<VendaForm>({
    resolver: zodResolver(vendaSchema),
    defaultValues: {
      clienteId: "",
      dataVenda: new Date().toISOString().split("T")[0],
      produtos: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "produtos",
  });

  const watchedProdutos = methods.watch("produtos");

  const atualizarPrecoProduto = (index: number, produtoId: string) => {
    const produto = produtos.find((p) => p.id === produtoId);
    if (produto) {
      methods.setValue(`produtos.${index}.precoUnitario`, produto.preco);
    } else {
      methods.setValue(`produtos.${index}.precoUnitario`, 0);
    }
  };

  const onSubmit = (data: VendaForm) => {
    console.log("Dados da venda:", data);
    methods.reset();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <ShoppingCart className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Cadastro de Vendas</h1>
      </div>

      {/* Envolver com FormProvider para contexto do react-hook-form */}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InformacoesVenda control={methods.control} />
            <ResumoVenda produtos={watchedProdutos} />
          </div>

          <ProdutosTable
            fields={fields}
            append={append}
            remove={remove}
            control={methods.control}
            atualizarPrecoProduto={atualizarPrecoProduto}
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => methods.reset()}
            >
              Cancelar
            </Button>
            <Button type="submit">Cadastrar Venda</Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
