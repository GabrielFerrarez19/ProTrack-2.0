import Select, { type SingleValue } from "react-select";
import {
  FormField,
  FormItem,
  FormMessage,
  FormControl,
} from "../../../components/ui/form";

import type { Control } from "react-hook-form";
import type { VendaForm } from "../../../schemas/schemaVendas";
import type { Produto } from "../../../@types/types.api";

type OptionType = {
  value: string;
  label: string;
};

type ProdutoSelectProps = {
  control: Control<VendaForm>;
  name: keyof VendaForm;
  produtos: Produto[];
  index: number; // índice para passar no onChange
  atualizarPrecoProduto: (index: number, produtoId: string) => void;
  label?: string;
  placeholder?: string;
};

export function ProdutoSelect({
  control,
  name,
  produtos,
  index,
  atualizarPrecoProduto,
  placeholder = "Selecione um produto",
}: ProdutoSelectProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // seleciona a opção do select
        const selectedOption: OptionType | null =
          produtos
            .map((p) => ({
              value: String(p.id),
              label: `${p.nome} - Cod: ${p.codigo_barras ?? "-"} - R$ ${
                p.preco_venda?.toFixed(2) ?? "0.00"
              }`,
            }))
            .find((opt) => opt.value === String(field.value)) || null;

        return (
          <FormItem>
            <FormControl>
              <Select
                options={produtos.map((p) => ({
                  value: String(p.id),
                  label: `${p.nome} - Cod: ${p.codigo_barras ?? "-"} - R$ ${
                    p.preco_venda?.toFixed(2) ?? "0.00"
                  }`,
                }))}
                value={selectedOption}
                onChange={(option: SingleValue<OptionType>) => {
                  field.onChange(option ? option.value : "");
                  atualizarPrecoProduto(index, option ? option.value : "");
                }}
                isClearable
                placeholder={placeholder}
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                menuPlacement="top"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
