"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoRow = ProdutoRow;
const react_hook_form_1 = require("react-hook-form");
const button_1 = require("../../../components/ui/button");
const form_1 = require("../../../components/ui/form");
const input_1 = require("../../../components/ui/input");
const lucide_react_1 = require("lucide-react");
const table_1 = require("../../../components/ui/table");
const ProdutoSelect_1 = require("./ProdutoSelect"); // importe o ProdutoSelect criado
function ProdutoRow({ index, field, remove, control, atualizarPrecoProduto, produtos, }) {
    const produtoAtual = (0, react_hook_form_1.useWatch)({
        control,
        name: `produtos.${index}`,
    }) || { quantidade: 0, precoUnitario: 0 };
    const quantidade = produtoAtual.quantidade || 0;
    const precoUnitario = produtoAtual.precoUnitario || 0;
    const subtotal = quantidade * precoUnitario;
    return (<table_1.TableRow key={field.id}>
      <table_1.TableCell>
        <ProdutoSelect_1.ProdutoSelect control={control} name={`produtos.${index}.produtoId`} produtos={produtos} index={index} // passe o índice
     atualizarPrecoProduto={atualizarPrecoProduto} // função que recebe (index, produtoId)
     placeholder="Selecione um produto"/>
      </table_1.TableCell>

      <table_1.TableCell>
        <form_1.FormField control={control} name={`produtos.${index}.quantidade`} render={({ field }) => (<form_1.FormItem>
              <form_1.FormControl>
                <input_1.Input type="number" min={1} {...field} onChange={(e) => field.onChange(Number(e.target.value))}/>
              </form_1.FormControl>
              <form_1.FormMessage />
            </form_1.FormItem>)}/>
      </table_1.TableCell>

      <table_1.TableCell>
        <form_1.FormField control={control} name={`produtos.${index}.precoUnitario`} render={({ field }) => (<form_1.FormItem>
              <form_1.FormControl>
                <input_1.Input type="number" step={0.01} min={0} {...field} onChange={(e) => field.onChange(Number(e.target.value))} readOnly/>
              </form_1.FormControl>
              <form_1.FormMessage />
            </form_1.FormItem>)}/>
      </table_1.TableCell>

      <table_1.TableCell>
        <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
      </table_1.TableCell>

      <table_1.TableCell>
        <button_1.Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
          <lucide_react_1.Trash2 className="h-4 w-4"/>
        </button_1.Button>
      </table_1.TableCell>
    </table_1.TableRow>);
}
