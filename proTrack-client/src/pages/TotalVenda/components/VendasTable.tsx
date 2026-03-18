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
import { DialogDetalhesVenda } from "./DialogDetalhesVenda";
import { formatCurrency, formatStatus } from "../../../utils/functions";
import type { SaleWithDetails, VendaAgrupada } from "@/@types/sales";
import { Eye } from "lucide-react";

// Cores fixas para cada coluna
const totalColor = "bg-blue-100 text-blue-800";
const descontoColor = "bg-yellow-100 text-yellow-800";
const totalComDescontoColor = "bg-green-100 text-green-800";

function saleWithDetailsToVendaAgrupada(v: SaleWithDetails): VendaAgrupada {
  const { sale, products } = v;
  return {
    sale_id: sale.sale_id,
    subtotal: sale.subtotal,
    total_amount: sale.total_amount,
    discount_amount: sale.discount_amount,
    status: String(sale.sale_status ?? ""),
    sale_date: sale.sale_at,
    customer_name: sale.customer_name,
    payment_method: sale.payment_method ?? undefined,
    installments_count: sale.installments_count,
    installment_total_amount: sale.installment_total_amount,
    down_payments: sale.down_payments,
    itens: products.map((p) => ({
      item_id: p.sale_item_id,
      product_id: p.product_id,
      quantity: p.quantity,
      unit_price: p.unit_price,
      discount: p.item_discount,
      product_name: p.product_name,
    })),
  };
}

interface VendasTableProps {
  vendas: SaleWithDetails[];
  onVendaUpdated?: () => void;
}

export function VendasTable({ vendas, onVendaUpdated }: VendasTableProps) {
  const [selectedVenda, setSelectedVenda] = useState<VendaAgrupada | null>(null);
  const [selectedVendaDetalhes, setSelectedVendaDetalhes] = useState<SaleWithDetails | null>(null);
  const [open, setOpen] = useState(false);
  const [openDetalhes, setOpenDetalhes] = useState(false);

  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Cálculos de paginação (cada item já é uma venda completa)
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

  const handleOpenDetalhes = (e: React.MouseEvent, venda: SaleWithDetails) => {
    e.stopPropagation();
    setSelectedVendaDetalhes(venda);
    setOpenDetalhes(true);
  };

  const handleOpenEditar = (venda: SaleWithDetails) => {
    setSelectedVenda(saleWithDetailsToVendaAgrupada(venda));
    setOpen(true);
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
            <TableHead className="text-gray-700 font-semibold">
              Pagamento
            </TableHead>
            <TableHead className="text-gray-700 font-semibold">
              Parcelas
            </TableHead>
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
            <TableHead className="text-gray-700 font-semibold w-[100px]">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentVendas.map((venda) => {
            const s = venda.sale;
            const desconto =
              Number(s.total_amount ?? 0) - Number(s.discount_amount ?? 0);
            const statusFormatted = formatStatus(
              s.sale_status as "pendente" | "pago" | "cancelado" | "aprazo",
            );

            return (
              <TableRow
                key={s.sale_id}
                className="hover:bg-gray-200 cursor-pointer"
                onClick={() => handleOpenEditar(venda)}
              >
                <TableCell className="font-medium">{s.sale_id}</TableCell>
                <TableCell>{s.customer_name}</TableCell>
                <TableCell>
                  {new Date(s.sale_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {s.payment_method ? (
                    <Badge variant="outline">{String(s.payment_method)}</Badge>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  {s.installments_count ? (
                    <Badge variant="outline">{s.installments_count}x</Badge>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={totalColor}>
                    R$ {formatCurrency(Number(s.total_amount ?? 0))}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={descontoColor}>
                    R$ {formatCurrency(Number(s.discount_amount ?? 0))}
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
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="cursor-pointer gap-1"
                    onClick={(e) => handleOpenDetalhes(e, venda)}
                    title="Ver parcelas e produtos"
                  >
                    <Eye className="h-4 w-4" />
                    Ver detalhes
                  </Button>
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
              {Math.min(endIndex, vendas.length)} de{" "}
              {vendas.length} vendas
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

      <Dialog open={openDetalhes} onOpenChange={setOpenDetalhes}>
        {selectedVendaDetalhes && (
          <DialogDetalhesVenda
            venda={selectedVendaDetalhes}
            setOpen={setOpenDetalhes}
          />
        )}
      </Dialog>
    </div>
  );
}
