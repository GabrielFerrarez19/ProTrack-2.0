import { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "../../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import type { VendaForm } from "../../../schemas/schemaVendas";
type Produto = {
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
};

type ResumoVendaProps = {
  produtos: Produto[];
  onChangeResumo?: (totais: {
    totalPreco: number;
    valorComDesconto: number;
  }) => void;
};

export function ResumoVenda({ produtos, onChangeResumo }: ResumoVendaProps) {
  const { control, watch, setValue } = useFormContext<VendaForm>();
  const desconto = watch("desconto") ?? 0;
  const formaPagamentoSelecionada = watch("formaPagamento");

  const totalItens = produtos.length;
  const totalQuantidade = produtos.reduce((acc, p) => acc + p.quantidade, 0);
  const totalPreco = produtos.reduce(
    (acc, p) => acc + p.quantidade * p.precoUnitario,
    0,
  );
  const valorComDesconto = totalPreco * (1 - desconto / 100);

  useEffect(() => {
    if (onChangeResumo) {
      onChangeResumo({ totalPreco, valorComDesconto });
    }
  }, [totalPreco, valorComDesconto, onChangeResumo]);

  // Valores do enum payment_method_enum do banco (PostgreSQL)
  const formasPagamento = [
    { value: "cash", label: "Dinheiro" },
    { value: "credit_card", label: "Cartão de Crédito" },
    { value: "debit_card", label: "Cartão de Débito" },
    { value: "pix", label: "PIX" },
    { value: "bank_transfer", label: "Transferência Bancária" },
    { value: "installments", label: "Parcelado (à prazo)" },
    { value: "other", label: "Outro" },
  ] as const;

  // Dias de vencimento disponíveis
  const diasVencimentoOpcoes = [1, 3, 5, 9, 11, 15];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo da Venda</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Totais de itens */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Itens:</span>
          <span className="font-medium">{totalItens}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Total de Produtos:
          </span>
          <span className="font-medium">{totalQuantidade}</span>
        </div>

        {/* Desconto */}
        <div className="flex justify-between items-center">
          <label className="text-sm text-muted-foreground" htmlFor="desconto">
            Desconto (%):
          </label>
          <Controller
            control={control}
            name="desconto"
            defaultValue={0}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                min={0}
                max={100}
                className="w-20"
                onChange={(e) =>
                  field.onChange(
                    e.target.value === "" ? undefined : Number(e.target.value),
                  )
                }
                value={field.value ?? ""}
              />
            )}
          />
        </div>

        {/* Select de formas de pagamento */}
        <div className="flex justify-between items-center">
          <label
            className="text-sm text-muted-foreground mr-2"
            htmlFor="formaPagamento"
          >
            Forma de Pagamento:
          </label>
          <Controller
            control={control}
            name="formaPagamento"
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  if (value !== "installments") setValue("diasVencimento", undefined);
                }}
                value={field.value ?? ""}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {formasPagamento.map((fp) => (
                    <SelectItem key={fp.value} value={fp.value}>
                      {fp.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Select de dias de vencimento apenas se forma de pagamento for parcelado */}
        {formaPagamentoSelecionada === "installments" && (
          <div className="flex justify-between items-center">
            <label
              className="text-sm text-muted-foreground mr-2"
              htmlFor="diasVencimento"
            >
              Dias para Vencimento:
            </label>
            <Controller
              control={control}
              name="diasVencimento"
              defaultValue={diasVencimentoOpcoes[0]} // valor padrão
              render={({ field }) => (
                <Select
                  onValueChange={(val) => field.onChange(Number(val))}
                  value={(field.value ?? diasVencimentoOpcoes[0]).toString()} // garante valor mesmo que undefined
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {diasVencimentoOpcoes.map((dias) => (
                      <SelectItem key={dias} value={dias.toString()}>
                        Dia {dias}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        )}

        {/* Totais finais */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-primary">
              R$ {totalPreco.toFixed(2)}
            </span>
          </div>

          {desconto > 0 && (
            <div className="flex justify-between items-center text-green-600 font-semibold">
              <span>Valor com {desconto}% de desconto:</span>
              <span>R$ {valorComDesconto.toFixed(2)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
