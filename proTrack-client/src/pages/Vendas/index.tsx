import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../components/ui/button";
import { vendaSchema, type VendaForm } from "../../schemas/schemaVendas";
import { InformacoesVenda } from "./components/InformacoesVenda";
import { ResumoVenda } from "./components/ResumoVenda";
import { ProdutosTable } from "./components/ProdutosTable";
import { Header } from "../../components/header";
import { useProdutos } from "../../hooks/useProdutos";

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

  const { produtos } = useProdutos();

  const atualizarPrecoProduto = (index: number, produtoId: string) => {
    const produto = produtos.find((p) => String(p.id) === produtoId);
    if (produto) {
      methods.setValue(
        `produtos.${index}.precoUnitario`,
        produto.preco_venda ?? 0
      );
    } else {
      methods.setValue(`produtos.${index}.precoUnitario`, 0);
    }
  };

  const onSubmit = (data: VendaForm) => {
    console.log("Dados da venda:", data);
    methods.reset();
  };

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Bem vindo a página Venda!"
        text="Aqui você pode registar suas vendas"
      />

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
            produtos={produtos}
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
