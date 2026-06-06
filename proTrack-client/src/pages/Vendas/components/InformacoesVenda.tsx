import { useClientes } from "../../../hooks/useClientes"; // ajuste o caminho
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { ClienteSelect } from "./clienteSelect";
import { PageLoading } from "@/components/PageLoading";

import type { Control } from "react-hook-form";
import type { VendaForm } from "../../../schemas/schemaVendas";

type InformacoesVendaProps = {
  control: Control<VendaForm>;
};

export function InformacoesVenda({ control }: InformacoesVendaProps) {
  const { data: clientes, isLoading, error } = useClientes();

  if (isLoading)
    return <PageLoading message="Carregando clientes..." fullHeight={false} />;
  if (error) return <div>{error.message}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações da Venda</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-76 space-y-4">
          <ClienteSelect
            control={control}
            name="clienteId"
            clientes={clientes ?? []}
            label="Cliente"
            placeholder="Selecione um cliente"
          />

          <FormField
            control={control}
            name="dataVenda"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data da Venda</FormLabel>
                <FormControl>
                  <Input type="date" {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
