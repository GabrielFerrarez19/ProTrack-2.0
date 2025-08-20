"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientTable = ClientTable;
const react_1 = require("react");
const table_1 = require("../../../components/ui/table");
const dialog_1 = require("../../../components/ui/dialog");
const DialogAlterCliente_1 = require("./DialogAlterCliente");
const functions_1 = require("../../../utils/functions");
function ClientTable({ clientes, onClienteUpdated }) {
    const [selectedCliente, setSelectedCliente] = (0, react_1.useState)(null);
    const [open, setOpen] = (0, react_1.useState)(false);
    const handleDialogClose = (isOpen) => {
        if (!isOpen) {
            setOpen(false);
            setSelectedCliente(null);
            // Chama o callback para atualizar os dados da tabela
            if (onClienteUpdated) {
                onClienteUpdated();
            }
        }
    };
    console.log(selectedCliente?.id);
    return (<div className="rounded-lg overflow-hidden border border-border">
      <table_1.Table>
        <table_1.TableHeader>
          <table_1.TableRow className="bg-teal-100 hover:bg-teal-100">
            <table_1.TableHead className="text-gray-700 font-semibold">Nome</table_1.TableHead>
            <table_1.TableHead className="text-gray-700 font-semibold">
              Data de Nascimento
            </table_1.TableHead>
            <table_1.TableHead className="text-gray-700 font-semibold">CPF</table_1.TableHead>
            <table_1.TableHead className="text-gray-700 font-semibold">
              WhatsApp
            </table_1.TableHead>
            <table_1.TableHead className="text-gray-700 font-semibold">Email</table_1.TableHead>
            <table_1.TableHead className="text-gray-700 font-semibold">CEP</table_1.TableHead>
            <table_1.TableHead className="text-gray-700 font-semibold">
              Endereço
            </table_1.TableHead>
            <table_1.TableHead className="text-gray-700 font-semibold">
              Número
            </table_1.TableHead>
            <table_1.TableHead className="text-gray-700 font-semibold">
              Bairro
            </table_1.TableHead>
            <table_1.TableHead className="text-gray-700 font-semibold">
              Cidade
            </table_1.TableHead>
          </table_1.TableRow>
        </table_1.TableHeader>
        <table_1.TableBody>
          {clientes.map((cliente, index) => (<table_1.TableRow key={cliente.cpf ?? index} className="hover:bg-gray-200 cursor-pointer" onClick={() => {
                setSelectedCliente(cliente);
                setOpen(true);
            }}>
              <table_1.TableCell className="font-medium">{cliente.nome}</table_1.TableCell>
              <table_1.TableCell>
                {cliente.dataNascimento
                ? (0, functions_1.formatarDataNascimento)(cliente.dataNascimento)
                : "—"}
              </table_1.TableCell>
              <table_1.TableCell>{cliente.cpf}</table_1.TableCell>
              <table_1.TableCell>{cliente.telefoneWhatsapp ?? "—"}</table_1.TableCell>
              <table_1.TableCell>{cliente.email}</table_1.TableCell>
              <table_1.TableCell>{cliente.cep ?? "—"}</table_1.TableCell>
              <table_1.TableCell>{cliente.endereco ?? "—"}</table_1.TableCell>
              <table_1.TableCell>{cliente.numero ?? "—"}</table_1.TableCell>
              <table_1.TableCell>{cliente.bairro ?? "—"}</table_1.TableCell>
              <table_1.TableCell>{cliente.cidade ?? "—"}</table_1.TableCell>
            </table_1.TableRow>))}
        </table_1.TableBody>
      </table_1.Table>

      <dialog_1.Dialog open={open} onOpenChange={handleDialogClose}>
        {selectedCliente && (<DialogAlterCliente_1.DialogAlterCliente setOpen={setOpen} cliente={selectedCliente} onClienteUpdated={onClienteUpdated}/>)}
      </dialog_1.Dialog>
    </div>);
}
