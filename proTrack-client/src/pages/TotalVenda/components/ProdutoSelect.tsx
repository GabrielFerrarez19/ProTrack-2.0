import Select, { type SingleValue } from "react-select";
import {
  FormField,
  FormItem,
  FormMessage,
  FormControl,
} from "../../../components/ui/form";

import type { Control, Path } from "react-hook-form";
import type { VendaForm } from "../../../@types/types.components";
import type { Produto } from "../../../@types/types.api";

type OptionType = {
  value: string;
  label: string;
};

type ProdutoSelectProps = {
  control: Control<VendaForm>;
  name: Path<VendaForm>; // <- Corrigido aqui
  produtos?: Produto[];
  index: number;
  atualizarPrecoProduto: (index: number, produtoId: string) => void;
  label?: string;
  placeholder?: string;
};

export function ProdutoSelect({
  control,
  name,
  produtos = [],
  index,
  atualizarPrecoProduto,
  placeholder = "Selecione um produto",
}: ProdutoSelectProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const options: OptionType[] = produtos.map((p) => ({
          value: String(p.id),
          label: `${p.nome} - Cod: ${p.codigo_barras ?? "-"} - R$ ${
            p.preco_venda?.toFixed(2) ?? "0.00"
          }`,
        }));

        const selectedOption: OptionType | null =
          options.find((opt) => opt.value === String(field.value)) || null;

        return (
          <FormItem>
            <FormControl>
              <Select
                options={options}
                value={selectedOption}
                onChange={(option: SingleValue<OptionType>) => {
                  const value = option?.value ?? "";
                  field.onChange(value);
                  atualizarPrecoProduto(index, value);
                }}
                isClearable
                placeholder={placeholder}
                menuPortalTarget={document.body} // garante que o menu fique fora do fluxo do pai
                menuPlacement="auto" // abre para cima ou baixo conforme espaço
                styles={{
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999, // sobrepõe todos os elementos
                  }),
                  menuList: (base) => ({
                    ...base,
                    maxHeight: 250, // altura máxima do menu
                    overflowY: "auto", // habilita scroll interno
                  }),
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
