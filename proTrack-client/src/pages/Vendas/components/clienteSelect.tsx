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

type OptionType = {
  value: string;
  label: string;
};

export type Cliente = {
  id: string;
  nome: string;
  email: string; // importante ter todos os campos usados
  cpf?: string; // opcional se usar
};

type ClienteSelectProps = {
  control: Control<VendaForm>;
  name: keyof VendaForm;
  clientes: Cliente[];
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
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Procura a opção selecionada no formato { value, label }
        const selectedOption =
          clientes
            .map((c) => ({ value: c.id, label: `${c.nome} - ${c.email}` }))
            .find((opt) => opt.value === field.value) || null;

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Select
                options={clientes.map((c) => ({
                  value: c.id,
                  label: `${c.nome} - ${c.cpf}`,
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
