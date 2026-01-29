// DialogAlterVenda.tsx
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { ProdutoSelect } from "./ProdutoSelect";
import { useProdutos } from "../../../hooks/useProdutos";
import { toast } from "sonner";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import type {
  VendaForm,
  ItemVendaForm,
} from "../../../@types/types.components";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

interface DialogAlterVendaProps {
  venda: {
    id: number;
    cliente_id: number;
    cliente_nome: string;
    desconto?: number;
    status: "pendente" | "pago" | "cancelado" | "aprazo";
    forma_pagamento?:
      | "dinheiro"
      | "cartao"
      | "pix"
      | "transferencia"
      | "aprazo";
    dias_vencimento?: number | null; // ✅ novo campo
    data_venda: string;
    itens: ItemVendaForm[];
  };
  setOpen: (value: boolean) => void;
  onVendaUpdated?: () => void;
}

export function DialogAlterVenda({
  venda,
  setOpen,
  onVendaUpdated,
}: DialogAlterVendaProps) {
  const { products } = useProdutos();

  const methods = useForm<VendaForm>({
    defaultValues: {
      data_venda: venda.data_venda.split("T")[0],
      desconto: venda.desconto ?? 0,
      status: venda.status,
      formaPagamento: venda.forma_pagamento,
      diasVencimento: venda.dias_vencimento ?? 1, // valor padrão se não tiver
      itens: venda.itens.map((item) => ({
        produto_id: item.produto_id,
        produto_nome: item.produto_nome,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario,
        desconto: item.desconto,
      })),
    },
  });

  const { control, handleSubmit, watch, setValue } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "itens",
  });

  const itens = watch("itens");
  const desconto = watch("desconto");
  const diasVencimentoAtual = watch("diasVencimento");

  console.log("DiaVencimento", diasVencimentoAtual);

  const total = itens.reduce(
    (acc, item) => acc + item.quantidade * item.preco_unitario,
    0,
  );
  const totalComDesconto = total - (total * desconto) / 100;

  const atualizarPrecoProduto = (index: number, produtoId: string) => {
    const prod = products.find((p) => p.id === Number(produtoId));
    if (prod) {
      setValue(`itens.${index}.produto_id`, prod.id ?? 0);
      setValue(`itens.${index}.preco_unitario`, prod.preco_venda ?? 0);
      setValue(`itens.${index}.produto_nome`, prod.nome ?? "");
    }
  };

  const onSubmit = async (formData: VendaForm) => {
    const produtosApi = formData.itens.map((item) => ({
      produtoId: item.produto_id,
      quantidade: item.quantidade,
      precoUnitario: item.preco_unitario,
      desconto: item.desconto ?? 0,
    }));

    try {
      if (onVendaUpdated) onVendaUpdated();
      setOpen(false);
      toast.success("Venda atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar venda:", error);
      toast.error("Erro ao atualizar venda");
    }
  };

  return (
    <FormProvider {...methods}>
      <DialogContent
        style={{
          width: "900px",
          maxWidth: "none",
          height: "70vh",
          overflowY: "auto",
        }}
      >
        <DialogHeader>
          <DialogTitle>Editar Venda #{venda.id}</DialogTitle>
        </DialogHeader>

        <CardContent className="p-6 space-y-4">
          {/* Cliente, Data, Desconto, Totais... */}
          <div>
            <strong>Cliente:</strong>
            <Input value={venda.cliente_nome} disabled />
          </div>

          <div>
            <strong>Data da Venda:</strong>
            <Input type="date" {...methods.register("data_venda")} />
          </div>

          <div>
            <strong>Desconto (%):</strong>
            <Input type="number" {...methods.register("desconto")} />
          </div>

          <div>
            <strong>Total:</strong> R${total.toFixed(2).replace(".", ",")}
          </div>
          <div>
            <strong>Total com Desconto:</strong> R$
            {totalComDesconto.toFixed(2).replace(".", ",")}
          </div>

          {/* Status */}
          <div>
            <strong>Status:</strong>
            <Select
              value={watch("status")}
              onValueChange={(value) =>
                setValue(
                  "status",
                  value as "pendente" | "pago" | "cancelado" | "aprazo",
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pago">Pago</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
                <SelectItem value="aprazo">À prazo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Forma de pagamento */}
          <div>
            <strong>Forma de Pagamento:</strong>
            <Select
              value={watch("formaPagamento")}
              onValueChange={(value) =>
                setValue(
                  "formaPagamento",
                  value as
                    | "dinheiro"
                    | "cartao"
                    | "pix"
                    | "transferencia"
                    | "aprazo",
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                <SelectItem value="cartao">Cartão de Crédito</SelectItem>
                <SelectItem value="cartao">Cartão de Débito</SelectItem>
                <SelectItem value="pix">Pix</SelectItem>
                <SelectItem value="transferencia">Transferência</SelectItem>
                <SelectItem value="aprazo">À prazo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Select de dias de vencimento se for à prazo */}
          {watch("formaPagamento") === "aprazo" && (
            <div className="pt-2">
              <strong>Dias para Vencimento</strong>
              <Select
                value={String(diasVencimentoAtual)} // valor inicial do backend
                onValueChange={(value) =>
                  setValue("diasVencimento", Number(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione dias de vencimento" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 3, 5, 9, 11, 15].map((dia) => (
                    <SelectItem key={dia} value={String(dia)}>
                      {dia} dias
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Itens da venda */}
          <div className="pt-4">
            <div className="flex justify-between items-center mb-2">
              <strong>Itens:</strong>
              <Button
                onClick={() =>
                  append({
                    produto_id: 0,
                    produto_nome: "",
                    quantidade: 1,
                    preco_unitario: 0,
                    desconto: 0,
                  })
                }
              >
                Adicionar Produto
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Preço Unitário</TableHead>
                  <TableHead>Desconto (%)</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <ProdutoSelect
                        control={control}
                        name={`itens.${index}.produto_id`}
                        produtos={products}
                        index={index}
                        atualizarPrecoProduto={atualizarPrecoProduto}
                      />
                    </TableCell>

                    <TableCell>
                      <Input
                        type="number"
                        {...methods.register(`itens.${index}.quantidade`)}
                      />
                    </TableCell>

                    <TableCell>
                      <Input
                        type="number"
                        {...methods.register(`itens.${index}.preco_unitario`)}
                      />
                    </TableCell>

                    <TableCell>
                      <Input
                        type="number"
                        {...methods.register(`itens.${index}.desconto`)}
                      />
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="destructive"
                        onClick={() => remove(index)}
                      >
                        Remover
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Botões */}
          <div className="pt-4 flex gap-2">
            <Button
              onClick={handleSubmit(onSubmit)}
              className="bg-green-500 text-primary-foreground font-medium px-8 h-11 shadow-soft cursor-pointer transition-colors duration-300 ease-in-out hover:bg-green-600 hover:shadow-md"
            >
              Salvar
            </Button>

            <Button
              className="cursor-pointer"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Fechar
            </Button>
          </div>
        </CardContent>
      </DialogContent>
    </FormProvider>
  );
}
