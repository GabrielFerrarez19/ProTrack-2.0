"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumoVenda = ResumoVenda;
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const input_1 = require("../../../components/ui/input");
const card_1 = require("../../../components/ui/card");
function ResumoVenda({ produtos, onChangeResumo }) {
    const { control, watch } = (0, react_hook_form_1.useFormContext)();
    const desconto = watch("desconto") ?? 0;
    const totalItens = produtos.length;
    const totalQuantidade = produtos.reduce((acc, p) => acc + p.quantidade, 0);
    const totalPreco = produtos.reduce((acc, p) => acc + p.quantidade * p.precoUnitario, 0);
    const valorComDesconto = totalPreco * (1 - desconto / 100);
    react_1.default.useEffect(() => {
        if (onChangeResumo) {
            onChangeResumo({ totalPreco, valorComDesconto });
        }
    }, [totalPreco, valorComDesconto, onChangeResumo]);
    return (<card_1.Card>
      <card_1.CardHeader>
        <card_1.CardTitle>Resumo da Venda</card_1.CardTitle>
      </card_1.CardHeader>
      <card_1.CardContent className="space-y-4">
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
          <react_hook_form_1.Controller control={control} name="desconto" defaultValue={0} render={({ field }) => (<input_1.Input {...field} type="number" min={0} max={100} className="w-20" onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} value={field.value ?? ""}/>)}/>
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-primary">
              R$ {totalPreco.toFixed(2)}
            </span>
          </div>

          {desconto > 0 && (<div className="flex justify-between items-center text-green-600 font-semibold">
              <span>Valor com {desconto}% de desconto:</span>
              <span>R$ {valorComDesconto.toFixed(2)}</span>
            </div>)}
        </div>
      </card_1.CardContent>
    </card_1.Card>);
}
