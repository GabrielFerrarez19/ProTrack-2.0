import { useState } from "react";
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

  console.log("VendaSelecionada", selectedVenda);

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
          {vendas.map((venda) => {
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
