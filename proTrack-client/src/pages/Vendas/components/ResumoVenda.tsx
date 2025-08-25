import React from "react";
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
  const { control, watch } = useFormContext<VendaForm>();
  const desconto = watch("desconto") ?? 0;

  const totalItens = produtos.length;
  const totalQuantidade = produtos.reduce((acc, p) => acc + p.quantidade, 0);
  const totalPreco = produtos.reduce(
    (acc, p) => acc + p.quantidade * p.precoUnitario,
    0
  );

  const valorComDesconto = totalPreco * (1 - desconto / 100);

  React.useEffect(() => {
    if (onChangeResumo) {
      onChangeResumo({ totalPreco, valorComDesconto });
    }
  }, [totalPreco, valorComDesconto, onChangeResumo]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo da Venda</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
                    e.target.value === "" ? undefined : Number(e.target.value)
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
            defaultValue={undefined}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="Cartão de Crédito">
                    Cartão de Crédito
                  </SelectItem>
                  <SelectItem value="Cartão de Débito">
                    Cartão de Débito
                  </SelectItem>
                  <SelectItem value="Pix">PIX</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

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
