import { useState, useMemo } from "react";
import type { VendaResponse } from "../../../@types/types.components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Dialog } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { DialogAlterVenda } from "./DialogAlter";
import { formatCurrency, formatStatus } from "../../../utils/functions";

// Cores fixas para cada coluna
const totalColor = "bg-blue-100 text-blue-800";
const descontoColor = "bg-yellow-100 text-yellow-800";
const totalComDescontoColor = "bg-green-100 text-green-800";

interface VendasTableProps {
  vendas: VendaResponse[];
  onVendaUpdated?: () => void;
}

export function VendasTable({ vendas, onVendaUpdated }: VendasTableProps) {
  const [selectedVenda, setSelectedVenda] = useState<VendaResponse | null>(
    null
  );
  const [open, setOpen] = useState(false);

  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  console.log("VendaSelecionada", selectedVenda);

  // Cálculos de paginação
  const totalPages = Math.ceil(vendas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVendas = useMemo(() => {
    return vendas.slice(startIndex, endIndex);
  }, [vendas, startIndex, endIndex]);

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
      setSelectedVenda(null);
      if (onVendaUpdated) onVendaUpdated();
    }
  };

  return (
    <div className="rounded-lg overflow-hidden border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-teal-100 hover:bg-teal-100">
            <TableHead className="text-gray-700 font-semibold">
              ID Venda
            </TableHead>
            <TableHead className="text-gray-700 font-semibold">
              Cliente
            </TableHead>
            <TableHead className="text-gray-700 font-semibold">Data</TableHead>
            <TableHead className="text-gray-700 font-semibold">Total</TableHead>

            <TableHead className="text-gray-700 font-semibold">
              Desconto
            </TableHead>
            <TableHead className="text-gray-700 font-semibold">
              Total c/ Desconto
            </TableHead>
            <TableHead className="text-gray-700 font-semibold">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentVendas.map((venda) => {
            const desconto =
              Number(venda.total ?? 0) - Number(venda.total_com_desconto ?? 0);

            return (
              <TableRow
                key={venda.id}
                className="hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  setSelectedVenda(venda);
                  setOpen(true);
                }}
              >
                <TableCell className="font-medium">{venda.id}</TableCell>
                <TableCell>{venda.cliente_nome}</TableCell>
                <TableCell>
                  {new Date(venda.data_venda).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge className={totalColor}>
                    R$ {formatCurrency(Number(venda.total ?? 0))}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={descontoColor}>
                    R$ {formatCurrency(desconto)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={totalComDescontoColor}>
                    R$ {formatCurrency(Number(venda.total_com_desconto ?? 0))}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={formatStatus(venda.status).color}>
                    {formatStatus(venda.status).text}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Controles de Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
          <div className="flex items-center text-sm text-gray-700">
            <span>
              Mostrando {startIndex + 1} a {Math.min(endIndex, vendas.length)}{" "}
              de {vendas.length} vendas
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
        {selectedVenda && (
          <DialogAlterVenda
            setOpen={setOpen}
            venda={selectedVenda}
            onVendaUpdated={onVendaUpdated}
          />
        )}
      </Dialog>
    </div>
  );
}
