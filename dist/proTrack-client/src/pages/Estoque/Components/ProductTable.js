"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductTable = ProductTable;
const table_1 = require("../../../components/ui/table");
const badge_1 = require("../../../components/ui/badge");
const react_1 = require("react");
const dialog_1 = require("../../../components/ui/dialog");
const DialogAlter_1 = require("./DialogAlter");
function getQuantityColor(quantity) {
    if (!quantity)
        return "bg-gray-100 text-gray-500"; // quando quantidade undefined ou zero
    if (quantity >= 10)
        return "bg-green-100 text-green-800 hover:bg-green-200";
    if (quantity >= 5)
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    return "bg-red-100 text-red-800 hover:bg-red-200";
}
function ProductTable({ products, onProductUpdated, }) {
    const [selectedProduct, setSelectedProduct] = (0, react_1.useState)(null);
    const [open, setOpen] = (0, react_1.useState)(false);
    const handleDialogClose = (isOpen) => {
        if (!isOpen) {
            setOpen(false);
            setSelectedProduct(null);
            // Chama o callback para atualizar os dados da tabela
            if (onProductUpdated) {
                onProductUpdated();
            }
        }
    };
    return (<div className="rounded-lg overflow-hidden border border-border">
      <table_1.Table>
        <table_1.TableHeader>
          <table_1.TableRow className="bg-teal-100 hover:bg-teal-100">
            <table_1.TableHead className="text-gray-700 font-semibold">Nome</table_1.TableHead>
            <table_1.TableHead className="text-gray-700 font-semibold">
              Código de barras
            </table_1.TableHead>
            <table_1.TableHead className="text-gray-700 font-semibold">
              Categoria
            </table_1.TableHead>
            <table_1.TableHead className="text-gray-700 font-semibold">
              Tamanho
            </table_1.TableHead>
            <table_1.TableHead className="text-gray-700 font-semibold">
              Preço Venda
            </table_1.TableHead>
            <table_1.TableHead className="text-gray-700 font-semibold">
              Quantidade
            </table_1.TableHead>
          </table_1.TableRow>
        </table_1.TableHeader>
        <table_1.TableBody>
          {products.map((product, index) => (<table_1.TableRow key={product.codigo_barras ?? index} className="hover:bg-gray-200 cursor-pointer" onClick={() => {
                setSelectedProduct(product);
                setOpen(true);
            }}>
              <table_1.TableCell className="font-medium">{product.nome}</table_1.TableCell>
              <table_1.TableCell>{product.codigo_barras ?? "—"}</table_1.TableCell>
              <table_1.TableCell>{product.categoria ?? "—"}</table_1.TableCell>
              <table_1.TableCell>{product.tamanho ?? "—"}</table_1.TableCell>
              <table_1.TableCell>
                {typeof product.preco_venda === "number"
                ? `R$ ${product.preco_venda.toFixed(2).replace(".", ",")}`
                : "—"}
              </table_1.TableCell>
              <table_1.TableCell>
                <badge_1.Badge className={getQuantityColor(product.quantidade)}>
                  {product.quantidade ?? 0}
                </badge_1.Badge>
              </table_1.TableCell>
            </table_1.TableRow>))}
        </table_1.TableBody>
      </table_1.Table>

      <dialog_1.Dialog open={open} onOpenChange={handleDialogClose}>
        {selectedProduct && (<DialogAlter_1.DialogAlter setOpen={setOpen} product={selectedProduct} onProductUpdated={onProductUpdated}/>)}
      </dialog_1.Dialog>
    </div>);
}
