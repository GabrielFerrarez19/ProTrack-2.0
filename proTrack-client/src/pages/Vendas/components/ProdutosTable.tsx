import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead as TableTh,
} from "../../../components/ui/table";
import { Plus } from "lucide-react";

import { ProdutoRow } from "./ProdutoRow";

import type { Control, FieldArrayWithId } from "react-hook-form";
import type { VendaForm } from "../../../schemas/schemaVendas";
import type { ProductResponse } from "@/@types/product";

type ProdutosTableProps = {
  fields: FieldArrayWithId<VendaForm, "produtos", "id">[];
  append: (value: Omit<VendaForm["produtos"][number], "id">) => void;
  remove: (index: number) => void;
  control: Control<VendaForm>;
  atualizarPrecoProduto: (index: number, produtoId: string) => void;
  produtos: ProductResponse[];
};

export function ProdutosTable({
  fields,
  append,
  remove,
  control,
  atualizarPrecoProduto,
  produtos,
}: ProdutosTableProps) {
  function handleAdicionarProduto() {
    append({
      produtoId: "",
      quantidade: 0,
      precoUnitario: 0,
      desconto: 0,
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Produtos da Venda</CardTitle>
        <Button
          type="button"
          onClick={handleAdicionarProduto}
          size="sm"
          className="cursor-pointer bg-gradient-to-r from-[#628DFD] to-[#6F31FF] hover:from-[#7A9BFD] hover:to-[#B597F9]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Produto
        </Button>
      </CardHeader>

      {fields.length > 0 ? (
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableTh>Produto</TableTh>
                <TableTh className="w-24">Quantidade</TableTh>
                <TableTh className="w-32">Preço Unit.</TableTh>
                <TableTh className="w-32">Subtotal</TableTh>
                <TableTh className="w-16">Ações</TableTh>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <ProdutoRow
                  key={field.id}
                  index={index}
                  field={field}
                  remove={remove}
                  control={control}
                  atualizarPrecoProduto={atualizarPrecoProduto}
                  produtos={produtos}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      ) : (
        <CardContent>
          <p className="text-center py-4">Nenhum produto adicionado</p>
        </CardContent>
      )}
    </Card>
  );
}
