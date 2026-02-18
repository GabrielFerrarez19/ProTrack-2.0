import Select, { type SingleValue } from "react-select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "../../../components/ui/form";

import type { Control } from "react-hook-form";
import type { VendaForm } from "../../../schemas/schemaVendas";
import type { CustomerResponse } from "@/@types/customers";

type OptionType = {
  value: string;
  label: string;
};

type ClienteSelectProps = {
  control: Control<VendaForm>;
  name: keyof VendaForm;
  clientes: CustomerResponse[];
  label?: string;
  placeholder?: string;
};

export function ClienteSelect({
  control,
  name,
  clientes,
  label = "Cliente",
  placeholder = "Selecione um cliente",
}: ClienteSelectProps) {
  const lista = clientes ?? [];

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Procura a opção selecionada no formato { value, label }
        const selectedOption =
          lista
            .map((c) => ({ value: c.id, label: `${c.full_name} - ${c.cpf}` }))
            .find((opt) => opt.value === field.value) || null;

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Select
                options={lista.map((c) => ({
                  value: c.id,
                  label: `${c.full_name} - ${c.cpf}`,
                }))}
                value={selectedOption}
                onChange={(option: SingleValue<OptionType>) => {
                  field.onChange(option ? option.value : "");
                }}
                isClearable
                placeholder={placeholder}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
