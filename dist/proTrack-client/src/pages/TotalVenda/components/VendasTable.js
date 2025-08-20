"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendasTable = VendasTable;
const react_1 = require("react");
const table_1 = require("../../../components/ui/table");
const badge_1 = require("../../../components/ui/badge");
const dialog_1 = require("../../../components/ui/dialog");
const DialogAlter_1 = require("./DialogAlter");
const functions_1 = require("../../../utils/functions");
// Cores fixas para cada coluna
const totalColor = "bg-blue-100 text-blue-800";
const descontoColor = "bg-yellow-100 text-yellow-800";
const totalComDescontoColor = "bg-green-100 text-green-800";
// Formata número em Real brasileiro com separador de milhares
function formatCurrency(value) {
    return value.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}
function VendasTable({ vendas, onVendaUpdated }) {
    const [selectedVenda, setSelectedVenda] = (0, react_1.useState)(null);
    const [open, setOpen] = (0, react_1.useState)(false);
    const handleDialogClose = (isOpen) => {
        if (!isOpen) {
            setOpen(false);
            setSelectedVenda(null);
            if (onVendaUpdated)
                onVendaUpdated();
        }
    };
    return (<div className="rounded-lg overflow-hidden border border-border">
      <table_1.Table>
        <table_1.TableHeader>
          <table_1.TableRow className="bg-teal-100 hover:bg-teal-100">
            <table_1.TableHead className="text-gray-700 font-semibold">
              ID Venda
            </table_1.TableHead>
            <table_1.TableHead className="text-gray-700 font-semibold">
              Cliente
            </table_1.TableHead>
            <table_1.TableHead className="text-gray-700 font-semibold">Data</table_1.TableHead>
            <table_1.TableHead className="text-gray-700 font-semibold">Total</table_1.TableHead>

            <table_1.TableHead className="text-gray-700 font-semibold">
              Desconto
            </table_1.TableHead>
            <table_1.TableHead className="text-gray-700 font-semibold">
              Total c/ Desconto
            </table_1.TableHead>
            <table_1.TableHead className="text-gray-700 font-semibold">
              Status
            </table_1.TableHead>
          </table_1.TableRow>
        </table_1.TableHeader>
        <table_1.TableBody>
          {vendas.map((venda) => {
            const desconto = Number(venda.total ?? 0) - Number(venda.total_com_desconto ?? 0);
            return (<table_1.TableRow key={venda.id} className="hover:bg-gray-200 cursor-pointer" onClick={() => {
                    setSelectedVenda(venda);
                    setOpen(true);
                }}>
                <table_1.TableCell className="font-medium">{venda.id}</table_1.TableCell>
                <table_1.TableCell>{venda.cliente_nome}</table_1.TableCell>
                <table_1.TableCell>
                  {new Date(venda.data_venda).toLocaleDateString()}
                </table_1.TableCell>
                <table_1.TableCell>
                  <badge_1.Badge className={totalColor}>
                    R$ {formatCurrency(Number(venda.total ?? 0))}
                  </badge_1.Badge>
                </table_1.TableCell>
                <table_1.TableCell>
                  <badge_1.Badge className={descontoColor}>
                    R$ {formatCurrency(desconto)}
                  </badge_1.Badge>
                </table_1.TableCell>
                <table_1.TableCell>
                  <badge_1.Badge className={totalComDescontoColor}>
                    R$ {formatCurrency(Number(venda.total_com_desconto ?? 0))}
                  </badge_1.Badge>
                </table_1.TableCell>
                <table_1.TableCell>
                  <badge_1.Badge className={(0, functions_1.formatStatus)(venda.status).color}>
                    {(0, functions_1.formatStatus)(venda.status).text}
                  </badge_1.Badge>
                </table_1.TableCell>
              </table_1.TableRow>);
        })}
        </table_1.TableBody>
      </table_1.Table>

      <dialog_1.Dialog open={open} onOpenChange={handleDialogClose}>
        {selectedVenda && (<DialogAlter_1.DialogAlterVenda setOpen={setOpen} venda={selectedVenda} onVendaUpdated={onVendaUpdated}/>)}
      </dialog_1.Dialog>
    </div>);
}
