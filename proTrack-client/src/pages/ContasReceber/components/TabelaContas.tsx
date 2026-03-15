import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Dialog } from "../../../components/ui/dialog";
import { Eye } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { formatBRL } from "../../../utils/functions";
import type { SaleWithDetails } from "@/@types/sales";
import { DialogDetalhesVenda } from "@/pages/TotalVenda/components/DialogDetalhesVenda";

function nextDueDate(installment: { due_date: string }[]): string | null {
  const now = new Date();
  const pending = installment
    .filter((i) => new Date(i.due_date) >= now)
    .sort(
      (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    );
  return pending[0]?.due_date ?? null;
}

function maxDaysOverdue(installment: { due_date: string; installment_status: string }[]): number {
  const now = new Date();
  let max = 0;
  for (const i of installment) {
    if (String(i.installment_status).toLowerCase() !== "paid" && i.due_date) {
      const due = new Date(i.due_date);
      if (due < now) {
        const days = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
        if (days > max) max = days;
      }
    }
  }
  return max;
}

function saleStatusDisplay(v: SaleWithDetails): "pendente" | "pago" | "parcial" | "vencido" {
  const hasOverdue = v.installment.some(
    (i) => String(i.installment_status).toLowerCase() === "overdue"
  );
  const hasPending = v.installment.some(
    (i) =>
      String(i.installment_status).toLowerCase() === "pending" ||
      String(i.installment_status).toLowerCase() === "pendente"
  );
  const allPaid = v.installment.length > 0 && v.installment.every(
    (i) => String(i.installment_status).toLowerCase() === "paid" || String(i.installment_status).toLowerCase() === "pago"
  );
  if (allPaid) return "pago";
  if (hasOverdue) return "vencido";
  if (hasPending) return "parcial";
  return "pendente";
}

interface Props {
  vendas: SaleWithDetails[];
  onVendaUpdated?: () => void;
}

export function TabelaContas({ vendas, onVendaUpdated }: Props) {
  const [detalhesAberto, setDetalhesAberto] = useState(false);
  const [vendaSelecionada, setVendaSelecionada] = useState<SaleWithDetails | null>(null);

  const handleVerDetalhes = (venda: SaleWithDetails) => {
    setVendaSelecionada(venda);
    setDetalhesAberto(true);
  };

  if (vendas.length === 0) {
    return (
      <p className="text-muted-foreground py-6 text-center">
        Nenhuma conta pendente ou vencida encontrada.
      </p>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-pastel-blue/20">
            <TableHead>Cliente</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Dias em Atraso</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendas.map((venda) => {
            const s = venda.sale;
            const proximoVenc = nextDueDate(venda.installment);
            const diasAtraso = maxDaysOverdue(venda.installment);
            const status = saleStatusDisplay(venda);
            const descricao = venda.products
              .map((p) => p.product_name)
              .join(", ") || "-";

            return (
              <TableRow key={s.sale_id}>
                <TableCell className="font-medium">{s.customer_name}</TableCell>
                <TableCell className="max-w-[200px] truncate" title={descricao}>
                  {descricao}
                </TableCell>
                <TableCell>R$ {formatBRL(s.total_amount)}</TableCell>
                <TableCell>
                  {proximoVenc
                    ? new Date(proximoVenc).toLocaleDateString("pt-BR")
                    : "-"}
                </TableCell>
                <TableCell>
                  <StatusBadge status={status} />
                </TableCell>
                <TableCell>
                  {diasAtraso > 0 ? (
                    <span className="text-pastel-red font-medium">
                      {diasAtraso} dias
                    </span>
                  ) : (
                    <span className="text-green-600 font-medium">Em dia</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="cursor-pointer gap-1 bg-pastel-purple/20"
                    onClick={() => handleVerDetalhes(venda)}
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

      <Dialog open={detalhesAberto} onOpenChange={setDetalhesAberto}>
        {vendaSelecionada && (
          <DialogDetalhesVenda
            venda={vendaSelecionada}
            setOpen={(open) => {
              setDetalhesAberto(open);
              if (!open) {
                setVendaSelecionada(null);
                onVendaUpdated?.();
              }
            }}
          />
        )}
      </Dialog>
    </>
  );
}
