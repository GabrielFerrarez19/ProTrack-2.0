import { useState } from "react";
import type { Cliente } from "../../../@types/types.components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Dialog } from "../../../components/ui/dialog";
import { DialogAlterCliente } from "./DialogAlterCliente";
import { formatarDataNascimento } from "../../../utils/functions";

interface ClientTableProps {
  clientes: Cliente[];
  onClienteUpdated?: () => void; // Nova prop para callback de atualização
}

export function ClientTable({ clientes, onClienteUpdated }: ClientTableProps) {
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [open, setOpen] = useState(false);

  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      setOpen(false);
      setSelectedCliente(null);
      // Chama o callback para atualizar os dados da tabela
      if (onClienteUpdated) {
        onClienteUpdated();
      }
    }
  };

  return (
    <div className="rounded-lg overflow-hidden border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-teal-100 hover:bg-teal-100">
            <TableHead className="text-gray-700 font-semibold">Nome</TableHead>
            <TableHead className="text-gray-700 font-semibold">
              Data de Nascimento
            </TableHead>
            <TableHead className="text-gray-700 font-semibold">CPF</TableHead>
            <TableHead className="text-gray-700 font-semibold">
              WhatsApp
            </TableHead>
            <TableHead className="text-gray-700 font-semibold">Email</TableHead>
            <TableHead className="text-gray-700 font-semibold">CEP</TableHead>
            <TableHead className="text-gray-700 font-semibold">
              Endereço
            </TableHead>
            <TableHead className="text-gray-700 font-semibold">
              Número
            </TableHead>
            <TableHead className="text-gray-700 font-semibold">
              Bairro
            </TableHead>
            <TableHead className="text-gray-700 font-semibold">
              Cidade
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.map((cliente, index) => (
            <TableRow
              key={cliente.cpf ?? index}
              className="hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                setSelectedCliente(cliente);
                setOpen(true);
              }}
            >
              <TableCell className="font-medium">{cliente.nome}</TableCell>
              <TableCell>
                {cliente.dataNascimento
                  ? formatarDataNascimento(cliente.dataNascimento)
                  : "—"}
              </TableCell>
              <TableCell>{cliente.cpf}</TableCell>
              <TableCell>{cliente.telefoneWhatsapp ?? "—"}</TableCell>
              <TableCell>{cliente.email}</TableCell>
              <TableCell>{cliente.cep ?? "—"}</TableCell>
              <TableCell>{cliente.endereco ?? "—"}</TableCell>
              <TableCell>{cliente.numero ?? "—"}</TableCell>
              <TableCell>{cliente.bairro ?? "—"}</TableCell>
              <TableCell>{cliente.cidade ?? "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={handleDialogClose}>
        {selectedCliente && (
          <DialogAlterCliente
            setOpen={setOpen}
            cliente={selectedCliente}
            onClienteUpdated={onClienteUpdated}
          />
        )}
      </Dialog>
    </div>
  );
}
