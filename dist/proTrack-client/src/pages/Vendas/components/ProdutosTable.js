"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutosTable = ProdutosTable;
const button_1 = require("../../../components/ui/button");
const card_1 = require("../../../components/ui/card");
const table_1 = require("../../../components/ui/table");
const lucide_react_1 = require("lucide-react");
const ProdutoRow_1 = require("./ProdutoRow");
function ProdutosTable({ fields, append, remove, control, atualizarPrecoProduto, produtos, }) {
    function handleAdicionarProduto() {
        append({
            produtoId: "",
            quantidade: 0,
            precoUnitario: 0,
            desconto: 0,
        });
    }
    return (<card_1.Card>
      <card_1.CardHeader className="flex flex-row items-center justify-between">
        <card_1.CardTitle>Produtos da Venda</card_1.CardTitle>
        <button_1.Button type="button" onClick={handleAdicionarProduto} size="sm" className="cursor-pointer bg-gradient-to-r from-[#628DFD] to-[#6F31FF] hover:from-[#7A9BFD] hover:to-[#B597F9]">
          <lucide_react_1.Plus className="h-4 w-4 mr-2"/>
          Adicionar Produto
        </button_1.Button>
      </card_1.CardHeader>

      {fields.length > 0 ? (<card_1.CardContent>
          <table_1.Table>
            <table_1.TableHeader>
              <table_1.TableRow>
                <table_1.TableHead>Produto</table_1.TableHead>
                <table_1.TableHead className="w-24">Quantidade</table_1.TableHead>
                <table_1.TableHead className="w-32">Preço Unit.</table_1.TableHead>
                <table_1.TableHead className="w-32">Subtotal</table_1.TableHead>
                <table_1.TableHead className="w-16">Ações</table_1.TableHead>
              </table_1.TableRow>
            </table_1.TableHeader>
            <table_1.TableBody>
              {fields.map((field, index) => (<ProdutoRow_1.ProdutoRow key={field.id} index={index} field={field} remove={remove} control={control} atualizarPrecoProduto={atualizarPrecoProduto} produtos={produtos}/>))}
            </table_1.TableBody>
          </table_1.Table>
        </card_1.CardContent>) : (<card_1.CardContent>
          <p className="text-center py-4">Nenhum produto adicionado</p>
        </card_1.CardContent>)}
    </card_1.Card>);
}
