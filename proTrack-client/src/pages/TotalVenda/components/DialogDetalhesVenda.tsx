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

export function DialogDetalhesVenda({ venda, setOpen }: DialogDetalhesVendaProps) {
  const { sale, products, installment } = venda;

  return (
    <DialogContent
      style={{
        width: "min(90vw, 720px)",
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
          <span className="font-medium text-foreground">{sale.customer_name}</span>
          {" · "}
          {new Date(sale.sale_at).toLocaleDateString("pt-BR")}
          {" · "}
          <Badge className={formatStatus(sale.sale_status as "pendente" | "pago" | "cancelado" | "aprazo").color}>
            {formatStatus(sale.sale_status as "pendente" | "pago" | "cancelado" | "aprazo").text}
          </Badge>
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
                      R$ {formatCurrency(p.quantity * p.unit_price - p.item_discount)}
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
            <p className="text-sm text-muted-foreground">Venda à vista ou sem parcelas cadastradas.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parcela</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
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
                          formatStatus(parc.installment_status as "pendente" | "pago" | "cancelado" | "aprazo").color
                        }
                      >
                        {formatStatus(parc.installment_status as "pendente" | "pago" | "cancelado" | "aprazo").text}
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
