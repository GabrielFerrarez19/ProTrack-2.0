import { useMemo, useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, CreditCard, Package, Receipt } from "lucide-react";
import { toast } from "sonner";
import type { VendaAgrupada } from "@/@types/sales";

interface DialogAlterVendaProps {
  venda: VendaAgrupada;
  setOpen: (value: boolean) => void;
  onVendaUpdated?: () => void;
}

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const statusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  pendente: { label: "Pendente", variant: "outline" },
  pago: { label: "Pago", variant: "default" },
  cancelado: { label: "Cancelado", variant: "destructive" },
  aprazo: { label: "A Prazo", variant: "secondary" },
};

const metodosPagamentoMock = [
  { id: "1", name: "Dinheiro" },
  { id: "2", name: "Cartão de Crédito" },
  { id: "3", name: "Cartão de Débito" },
  { id: "4", name: "PIX" },
  { id: "5", name: "Boleto" },
];

export function DialogAlterVenda({
  venda,
  setOpen,
  onVendaUpdated,
}: DialogAlterVendaProps) {
  const [paymentMethodId, setPaymentMethodId] = useState(() => {
    const found = metodosPagamentoMock.find(
      (m) =>
        m.name.toLowerCase() === (venda.payment_method ?? "").toLowerCase(),
    );
    return found?.id ?? metodosPagamentoMock[0]?.id ?? "";
  });

  const dataFormatada = useMemo(() => {
    try {
      return new Date(venda.sale_date).toLocaleDateString("pt-BR");
    } catch {
      return "—";
    }
  }, [venda.sale_date]);

  const totalComDesconto = useMemo(() => {
    return Number(venda.total_amount ?? 0) - Number(venda.discount_amount ?? 0);
  }, [venda.total_amount, venda.discount_amount]);

  const entradaVenda = useMemo(() => {
    // Preferir o valor vindo do backend (mais confiável)
    if (venda.down_payments != null) return Number(venda.down_payments) || 0;

    // Fallback antigo caso a API ainda não envie o campo
    if (venda.installment_total_amount == null) return null;
    const entrada = totalComDesconto - Number(venda.installment_total_amount);
    if (!Number.isFinite(entrada)) return null;
    return entrada > 0 ? entrada : 0;
  }, [totalComDesconto, venda.installment_total_amount, venda.down_payments]);

  const statusInfo = statusConfig[venda.status] ?? statusConfig.pendente;

  const onSalvar = () => {
    toast.success("Venda atualizada com sucesso!");
    onVendaUpdated?.();
    setOpen(false);
  };

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
        <DialogTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-primary" />
          Editar Venda #{venda.sale_id}
        </DialogTitle>
        <DialogDescription>
          Altere as informações da venda abaixo.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 py-2">
        {/* Informações gerais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-muted-foreground">
              <User className="h-3.5 w-3.5" /> Cliente
            </Label>
            <Input value={venda.customer_name} readOnly className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" /> Data da Venda
            </Label>
            <Input value={dataFormatada} readOnly className="bg-muted" />
          </div>
        </div>

        <Separator />

        {/* Valores */}
        <div>
          <h4 className="text-sm font-medium mb-3">Resumo Financeiro</h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="rounded-lg border p-3 text-center">
              <p className="text-xs text-muted-foreground">Subtotal</p>
              <p className="text-sm font-semibold">
                R$ {formatCurrency(Number(venda.subtotal ?? 0))}
              </p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-xs text-muted-foreground">Desconto</p>
              <p className="text-sm font-semibold text-destructive">
                - R$ {formatCurrency(Number(venda.discount_amount ?? 0))}
              </p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-xs text-muted-foreground">Entrada</p>
              <p className="text-sm font-semibold">
                {entradaVenda == null
                  ? "—"
                  : `R$ ${formatCurrency(Number(entradaVenda))}`}
              </p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-sm font-semibold">
                R$ {formatCurrency(Number(venda.total_amount ?? 0))}
              </p>
            </div>
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-center">
              <p className="text-xs text-muted-foreground">Total c/ Desconto</p>
              <p className="text-sm font-bold text-primary">
                R$ {formatCurrency(totalComDesconto)}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Status (somente visualização) e Pagamento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Status da Venda</Label>
            <Input
              value={statusInfo.label}
              readOnly
              className="bg-muted w-fit min-w-[10rem]"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5" /> Forma de Pagamento
            </Label>
            <Select value={paymentMethodId} onValueChange={setPaymentMethodId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {metodosPagamentoMock.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {venda.payment_method && (
              <p className="text-xs text-muted-foreground">
                Atual: {venda.payment_method}
              </p>
            )}
          </div>
        </div>

        {/* Parcelas */}
        {(venda.installments_count || venda.installment_total_amount) && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">
                Qtd. Parcelas
              </Label>
              <p className="text-sm font-medium">
                {venda.installments_count ?? "—"}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">
                Total Parcelado
              </Label>
              <p className="text-sm font-medium">
                {venda.installment_total_amount != null
                  ? `R$ ${formatCurrency(Number(totalComDesconto / venda.installment_total_amount))}`
                  : "—"}
              </p>
            </div>
          </div>
        )}

        <Separator />

        {/* Itens da venda */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5" /> Itens da Venda
          </h4>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-center w-20">Qtd</TableHead>
                  <TableHead className="text-right w-28">Preço Unit.</TableHead>
                  <TableHead className="text-center w-24">Desc. (%)</TableHead>
                  <TableHead className="text-right w-28">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {venda.itens.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {item.product_name}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      R$ {formatCurrency(Number(item.unit_price ?? 0))}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.discount}%
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      R${" "}
                      {formatCurrency(
                        Number(item.quantity ?? 0) *
                          Number(item.unit_price ?? 0),
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button variant="outline" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
        <Button onClick={onSalvar}>Salvar Alterações</Button>
      </DialogFooter>
    </DialogContent>
  );
}
