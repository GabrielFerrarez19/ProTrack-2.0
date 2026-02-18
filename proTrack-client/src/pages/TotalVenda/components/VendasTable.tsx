import { useState, useMemo } from "react";
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
import type { ListSalesByCompanyResponse, VendaAgrupada } from "@/@types/sales";

// Cores fixas para cada coluna
const totalColor = "bg-blue-100 text-blue-800";
const descontoColor = "bg-yellow-100 text-yellow-800";
const totalComDescontoColor = "bg-green-100 text-green-800";

function groupSalesBySaleId(
  rows: ListSalesByCompanyResponse[],
): VendaAgrupada[] {
  const map = new Map<string, VendaAgrupada>();
  for (const row of rows) {
    const id = String(row.sale_id);
    if (!map.has(id)) {
      map.set(id, {
        sale_id: row.sale_id,
        total_amount: row.total_amount,
        discount_amount: row.discount_amount,
        status: String(row.status ?? ""),
        sale_date: row.sale_date,
        customer_name: row.customer_name,
        itens: [],
      });
    }
    map.get(id)!.itens.push({
      item_id: row.item_id,
      product_id: row.product_id,
      quantity: row.quantity,
      unit_price: row.unit_price,
      discount: row.discount,
      product_name: row.product_name,
    });
  }
  return Array.from(map.values());
}

interface VendasTableProps {
  vendas: ListSalesByCompanyResponse[];
  onVendaUpdated?: () => void;
}

export function VendasTable({ vendas, onVendaUpdated }: VendasTableProps) {
  const [selectedVenda, setSelectedVenda] = useState<VendaAgrupada | null>(
    null,
  );
  const [open, setOpen] = useState(false);

  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const vendasAgrupadas = useMemo(() => groupSalesBySaleId(vendas), [vendas]);

  // Cálculos de paginação
  const totalPages = Math.ceil(vendasAgrupadas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVendas = useMemo(() => {
    return vendasAgrupadas.slice(startIndex, endIndex);
  }, [vendasAgrupadas, startIndex, endIndex]);

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
              Number(venda.total_amount ?? 0) -
              Number(venda.discount_amount ?? 0);
            const statusFormatted = formatStatus(
              venda.status as "pendente" | "pago" | "cancelado" | "aprazo",
            );

            return (
              <TableRow
                key={venda.sale_id}
                className="hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  setSelectedVenda(venda);
                  setOpen(true);
                }}
              >
                <TableCell className="font-medium">{venda.sale_id}</TableCell>
                <TableCell>{venda.customer_name}</TableCell>
                <TableCell>
                  {new Date(venda.sale_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge className={totalColor}>
                    R$ {formatCurrency(Number(venda.total_amount ?? 0))}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={descontoColor}>
                    R$ {formatCurrency(Number(venda.discount_amount ?? 0))}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={totalComDescontoColor}>
                    R$ {formatCurrency(desconto)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={statusFormatted.color}>
                    {statusFormatted.text}
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
              Mostrando {startIndex + 1} a{" "}
              {Math.min(endIndex, vendasAgrupadas.length)} de{" "}
              {vendasAgrupadas.length} vendas
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
                ),
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
