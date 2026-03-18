import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { formatCurrency, formatStatus } from "../../../utils/functions";
import type { SaleWithDetails } from "@/@types/sales";

interface DialogDetalhesVendaProps {
  venda: SaleWithDetails;
  setOpen: (value: boolean) => void;
}

export function DialogDetalhesVenda({
  venda,
  setOpen,
}: DialogDetalhesVendaProps) {
  const { sale, products, installment } = venda;
  const totalComDesconto =
    Number(sale.total_amount ?? 0) - Number(sale.discount_amount ?? 0);
  const entrada =
    sale.down_payments != null
      ? Number(sale.down_payments) || 0
      : sale.installment_total_amount != null
        ? Math.max(0, totalComDesconto - Number(sale.installment_total_amount))
        : null;

  return (
    <DialogContent
      style={{
        width: "min(90vw, 920px)",
        maxWidth: "none",
        maxHeight: "85vh",
        overflowY: "auto",
      }}
    >
      <DialogHeader>
        <DialogTitle>Detalhes da venda #{sale.sale_id}</DialogTitle>
      </DialogHeader>

      <div className="space-y-6 py-2">
        {/* Resumo da venda */}
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {sale.customer_name}
          </span>
          {" · "}
          {new Date(sale.sale_at).toLocaleDateString("pt-BR")}
          {" · "}
          <Badge
            className={
              formatStatus(
                sale.sale_status as
                  | "pendente"
                  | "pago"
                  | "cancelado"
                  | "aprazo",
              ).color
            }
          >
            {
              formatStatus(
                sale.sale_status as
                  | "pendente"
                  | "pago"
                  | "cancelado"
                  | "aprazo",
              ).text
            }
          </Badge>
        </div>

        {/* Campos completos do bloco "sale" */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">ID do cliente</p>
            <p className="text-sm font-medium">{sale.customer_id ?? "—"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Forma de pagamento</p>
            <p className="text-sm font-medium">{sale.payment_method ?? "—"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Subtotal</p>
            <p className="text-sm font-medium">
              R$ {formatCurrency(Number(sale.subtotal ?? 0))}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Desconto</p>
            <p className="text-sm font-medium">
              R$ {formatCurrency(Number(sale.discount_amount ?? 0))}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-sm font-medium">
              R$ {formatCurrency(Number(sale.total_amount ?? 0))}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total c/ desconto</p>
            <p className="text-sm font-medium">
              R$ {formatCurrency(totalComDesconto)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Qtd. parcelas</p>
            <p className="text-sm font-medium">
              {sale.installments_count ? `${sale.installments_count}x` : "—"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total parcelado</p>
            <p className="text-sm font-medium">
              {sale.installment_total_amount != null
                ? `R$ ${formatCurrency(Number(sale.installment_total_amount))}`
                : "—"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Entrada</p>
            <p className="text-sm font-medium">
              {entrada == null ? "—" : `R$ ${formatCurrency(Number(entrada))}`}
            </p>
          </div>
        </div>

        {/* Produtos vendidos */}
        <div>
          <h4 className="font-semibold mb-2">Produtos vendidos</h4>
          {products.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum produto.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-right">Qtd</TableHead>
                  <TableHead className="text-right">Preço unit.</TableHead>
                  <TableHead className="text-right">Desconto</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.sale_item_id}>
                    <TableCell>{p.product_name}</TableCell>
                    <TableCell className="text-right">{p.quantity}</TableCell>
                    <TableCell className="text-right">
                      R$ {formatCurrency(p.unit_price)}
                    </TableCell>
                    <TableCell className="text-right">
                      R$ {formatCurrency(p.item_discount)}
                    </TableCell>
                    <TableCell className="text-right">
                      R${" "}
                      {formatCurrency(
                        p.quantity * p.unit_price - p.item_discount,
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Parcelas */}
        <div>
          <h4 className="font-semibold mb-2">Parcelas</h4>
          {installment.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Venda à vista ou sem parcelas cadastradas.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parcela</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {installment.map((parc) => (
                  <TableRow key={parc.installment_id}>
                    <TableCell>{parc.installment_number}</TableCell>
                    <TableCell>
                      {new Date(parc.due_date).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      R$ {formatCurrency(parc.installment_balance)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          formatStatus(
                            parc.installment_status as
                              | "pendente"
                              | "pago"
                              | "cancelado"
                              | "aprazo",
                          ).color
                        }
                      >
                        {
                          formatStatus(
                            parc.installment_status as
                              | "pendente"
                              | "pago"
                              | "cancelado"
                              | "aprazo",
                          ).text
                        }
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-sm font-medium text-primary hover:underline cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </DialogContent>
  );
}
