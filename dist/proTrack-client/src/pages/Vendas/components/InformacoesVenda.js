"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InformacoesVenda = InformacoesVenda;
const useClientes_1 = require("../../../hooks/useClientes"); // ajuste o caminho
const form_1 = require("../../../components/ui/form");
const input_1 = require("../../../components/ui/input");
const card_1 = require("../../../components/ui/card");
const clienteSelect_1 = require("./clienteSelect");
function InformacoesVenda({ control }) {
    const { clientes, loading, error } = (0, useClientes_1.useClientes)();
    if (loading)
        return <div>Carregando clientes...</div>;
    if (error)
        return <div>{error}</div>;
    return (<card_1.Card>
      <card_1.CardHeader>
        <card_1.CardTitle>Informações da Venda</card_1.CardTitle>
      </card_1.CardHeader>
      <card_1.CardContent>
        <div className="w-76 space-y-4">
          <clienteSelect_1.ClienteSelect control={control} name="clienteId" clientes={clientes} label="Cliente" placeholder="Selecione um cliente"/>

          <form_1.FormField control={control} name="dataVenda" render={({ field }) => (<form_1.FormItem>
                <form_1.FormLabel>Data da Venda</form_1.FormLabel>
                <form_1.FormControl>
                  <input_1.Input type="date" {...field} readOnly/>
                </form_1.FormControl>
                <form_1.FormMessage />
              </form_1.FormItem>)}/>
        </div>
      </card_1.CardContent>
    </card_1.Card>);
}
