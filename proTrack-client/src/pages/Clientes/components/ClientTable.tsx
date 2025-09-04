import { useState, useMemo } from "react";
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
import { Button } from "../../../components/ui/button";
import { DialogAlterCliente } from "./DialogAlterCliente";
import { formatarDataNascimento } from "../../../utils/functions";

interface ClientTableProps {
  clientes: Cliente[];
  onClienteUpdated?: () => void; // Nova prop para callback de atualização
}

export function ClientTable({ clientes, onClienteUpdated }: ClientTableProps) {
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [open, setOpen] = useState(false);

  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Cálculos de paginação
  const totalPages = Math.ceil(clientes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClientes = useMemo(() => {
    return clientes.slice(startIndex, endIndex);
  }, [clientes, startIndex, endIndex]);

  // Funções de navegação
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

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

  console.log(selectedCliente?.id);

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
          {currentClientes.map((cliente, index) => (
            <TableRow
              key={cliente.cpf ?? index}
              className="hover:bg-gray-200 cursor-pointer text-sm"
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

      {/* Controles de Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
          <div className="flex items-center text-sm text-gray-700">
            <span>
              Mostrando {startIndex + 1} a {Math.min(endIndex, clientes.length)}{" "}
              de {clientes.length} clientes
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="cursor-pointer"
            >
              Anterior
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(page)}
                    className="w-8 h-8 p-0 cursor-pointer"
                  >
                    {page}
                  </Button>
                )
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="cursor-pointer"
            >
              Próximo
            </Button>
          </div>
        </div>
      )}

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
