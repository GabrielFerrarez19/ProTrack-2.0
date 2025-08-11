import { useWatch } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Trash2 } from "lucide-react";
import { TableCell, TableRow } from "../../../components/ui/table";

import type { Control, FieldArrayWithId } from "react-hook-form";
import type { VendaForm } from "../../../schemas/schemaVendas";

import { ProdutoSelect } from "./ProdutoSelect"; // importe o ProdutoSelect criado
import type { Produto } from "../../../@types/types.api";

type ProdutoRowProps = {
  index: number;
  field: FieldArrayWithId<VendaForm, "produtos", "id">;
  remove: (index: number) => void;
  control: Control<VendaForm>;
  atualizarPrecoProduto: (index: number, produtoId: string) => void;
  produtos: Produto[];
};

export function ProdutoRow({
  index,
  field,
  remove,
  control,
  atualizarPrecoProduto,
  produtos,
}: ProdutoRowProps) {
  const produtoAtual = useWatch({
    control,
    name: `produtos.${index}`,
  }) || { quantidade: 0, precoUnitario: 0 };

  const quantidade = produtoAtual.quantidade || 0;
  const precoUnitario = produtoAtual.precoUnitario || 0;
  const subtotal = quantidade * precoUnitario;

  return (
    <TableRow key={field.id}>
      <TableCell>
        <ProdutoSelect
          control={control}
          name={`produtos.${index}.produtoId` as keyof VendaForm}
          produtos={produtos}
          index={index} // passe o índice
          atualizarPrecoProduto={atualizarPrecoProduto} // função que recebe (index, produtoId)
          placeholder="Selecione um produto"
        />
      </TableCell>

      <TableCell>
        <FormField
          control={control}
          name={`produtos.${index}.quantidade`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>

      <TableCell>
        <FormField
          control={control}
          name={`produtos.${index}.precoUnitario`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="number"
                  step={0.01}
                  min={0}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  readOnly
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>

      <TableCell>
        <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
      </TableCell>

      <TableCell>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => remove(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
