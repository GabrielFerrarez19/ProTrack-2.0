// DialogAlterVenda.tsx
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import type { VendaForm } from "../../../@types/types.components";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { UpdateSaleStatus } from "../../../services/sales";
import type { VendaAgrupada } from "@/@types/sales";

interface DialogAlterVendaProps {
  venda: VendaAgrupada;
  setOpen: (value: boolean) => void;
  onVendaUpdated?: () => void;
}

export function DialogAlterVenda({
  venda,
  setOpen,
  onVendaUpdated,
}: DialogAlterVendaProps) {
  const methods = useForm<VendaForm>({
    defaultValues: {
      data_venda: new Date(venda.sale_date).toISOString().split("T")[0],
      desconto: 0,
      status: (venda.status ?? "pendente") as
        | "pendente"
        | "pago"
        | "cancelado"
        | "aprazo",
      formaPagamento: undefined,
      diasVencimento: 1,
      itens: venda.itens.map((item) => ({
        produto_id: Number(item.product_id),
        produto_nome: item.product_name,
        quantidade: item.quantity,
        preco_unitario: item.unit_price,
        desconto: item.discount,
      })),
    },
  });

  const { handleSubmit, watch, setValue } = methods;

  const itens = watch("itens");
  const status = watch("status");

  const onSubmit = async (formData: VendaForm) => {
    try {
      await UpdateSaleStatus(venda.sale_id, formData.status);
      if (onVendaUpdated) onVendaUpdated();
      setOpen(false);
      toast.success("Status da venda atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar status da venda:", error);
      toast.error("Erro ao atualizar status da venda");
    }
  };

  return (
    <DialogContent
      style={{
        width: "900px",
        maxWidth: "none",
        height: "70vh",
        overflowY: "auto",
      }}
    >
      <DialogHeader>
        <DialogTitle>Editar Venda #{venda.sale_id}</DialogTitle>
      </DialogHeader>

      <CardContent className="p-6 space-y-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <strong>Cliente:</strong>
              <Input value={venda.customer_name} disabled />
            </div>

            <div>
              <strong>Data da Venda:</strong>
              <Input
                type="date"
                value={methods.getValues("data_venda")}
                disabled
              />
            </div>

            <div>
              <strong>Total:</strong> R$
              {Number(venda.total_amount).toFixed(2).replace(".", ",")}
            </div>

            <div>
              <strong>Desconto:</strong> R$
              {Number(venda.discount_amount).toFixed(2).replace(".", ",")}
            </div>

            {/* Status - único campo editável */}
            <div>
              <strong>Status:</strong>
              <Select
                value={status}
                onValueChange={(value) =>
                  setValue(
                    "status",
                    value as "pendente" | "pago" | "cancelado" | "aprazo"
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                  <SelectItem value="aprazo">À prazo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Itens da venda (somente leitura) */}
            <div className="pt-4">
              <strong>Itens:</strong>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Preço Unitário</TableHead>
                    <TableHead>Desconto (%)</TableHead>
                    <TableHead>Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itens.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.produto_nome}</TableCell>
                      <TableCell>{item.quantidade}</TableCell>
                      <TableCell>
                        R$ {item.preco_unitario.toFixed(2).replace(".", ",")}
                      </TableCell>
                      <TableCell>{item.desconto}</TableCell>
                      <TableCell>
                        R$
                        {(item.quantidade * item.preco_unitario)
                          .toFixed(2)
                          .replace(".", ",")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Botões */}
            <div className="pt-4 flex gap-2">
              <Button
                type="submit"
                className="bg-green-500 text-primary-foreground font-medium px-8 h-11 shadow-soft cursor-pointer transition-colors duration-300 ease-in-out hover:bg-green-600 hover:shadow-md"
              >
                Salvar
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              >
                Fechar
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </DialogContent>
  );
}
