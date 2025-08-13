import { useEffect, useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import type {
  VendaResponse,
  ItemVenda,
} from "../../../@types/types.components";
import { Input } from "../../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

interface DialogAlterVendaProps {
  venda: VendaResponse;
  setOpen: (value: boolean) => void;
  onVendaUpdated?: () => void;
}

export function DialogAlterVenda({
  venda,
  setOpen,
  onVendaUpdated,
}: DialogAlterVendaProps) {
  const [clienteNome, setClienteNome] = useState(venda.cliente_nome);
  const [dataVenda, setDataVenda] = useState(venda.data_venda);
  const [desconto, setDesconto] = useState(venda.desconto ?? 0);
  const [itens, setItens] = useState<ItemVenda[]>(venda.itens ?? []);

  // Calcula total e total com desconto
  const total = itens.reduce(
    (acc, item) => acc + item.quantidade * item.preco_unitario,
    0
  );
  const totalComDesconto = total - (total * desconto) / 100;

  useEffect(() => {
    console.log("Venda selecionada:", venda);
  }, [venda]);

  const handleItemChange = (
    id: number,
    field: keyof Pick<ItemVenda, "quantidade" | "preco_unitario" | "desconto">,
    value: number
  ) => {
    setItens((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = () => {
    // Aqui você pode chamar a API para atualizar a venda e os itens
    console.log("Salvando venda...", {
      clienteNome,
      dataVenda,
      desconto,
      itens,
    });

    // Fecha o modal e atualiza a tabela principal
    setOpen(false);
    if (onVendaUpdated) onVendaUpdated();
  };

  return (
    <DialogContent
      style={{
        width: "800px",
        maxWidth: "none",
        height: "70vh",
        overflowY: "auto",
      }}
    >
      <DialogHeader>
        <DialogTitle>Editar Venda #{venda.id}</DialogTitle>
      </DialogHeader>

      <CardContent className="p-6 space-y-4">
        <div>
          <strong>Cliente:</strong>
          <Input
            value={clienteNome}
            onChange={(e) => setClienteNome(e.target.value)}
          />
        </div>
        <div>
          <strong>Data da Venda:</strong>
          <Input
            type="date"
            value={dataVenda.split("T")[0]}
            onChange={(e) => setDataVenda(e.target.value)}
          />
        </div>
        <div>
          <strong>Desconto (%):</strong>
          <Input
            type="number"
            value={desconto}
            onChange={(e) => setDesconto(Number(e.target.value))}
          />
        </div>
        <div>
          <strong>Total:</strong> R${total.toFixed(2).replace(".", ",")}
        </div>
        <div>
          <strong>Total com Desconto:</strong> R$
          {totalComDesconto.toFixed(2).replace(".", ",")}
        </div>

        <div className="pt-4">
          <strong>Itens:</strong>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Preço Unitário</TableHead>
                <TableHead>Desconto (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itens.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.produto_nome}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.quantidade}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "quantidade",
                          Number(e.target.value)
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.preco_unitario}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "preco_unitario",
                          Number(e.target.value)
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.desconto}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "desconto",
                          Number(e.target.value)
                        )
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="pt-4 flex gap-2">
          <Button
            onClick={handleSave}
            className="
    bg-green-500 
    text-primary-foreground 
    font-medium 
    px-8 
    h-11 
    shadow-soft 
    cursor-pointer 
    transition-colors 
    duration-300 
    ease-in-out
    hover:bg-green-600
    hover:shadow-md
  "
          >
            Salvar
          </Button>
          <Button
            className="cursor-pointer"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Fechar
          </Button>
        </div>
      </CardContent>
    </DialogContent>
  );
}
