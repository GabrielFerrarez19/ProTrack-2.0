import type { Product } from "../../../@types/types.components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { useState } from "react";
import { Dialog } from "../../../components/ui/dialog";
import { DialogAlter } from "./DialogAlter";

interface ProductTableProps {
  products: Product[];
  onProductUpdated?: () => void; // Nova prop para callback de atualização
}

function getQuantityColor(quantity?: number) {
  if (!quantity) return "bg-gray-100 text-gray-500"; // quando quantidade undefined ou zero
  if (quantity >= 10) return "bg-green-100 text-green-800 hover:bg-green-200";
  if (quantity >= 5) return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
  return "bg-red-100 text-red-800 hover:bg-red-200";
}

export function ProductTable({
  products,
  onProductUpdated,
}: ProductTableProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      setOpen(false);
      setSelectedProduct(null);
      // Chama o callback para atualizar os dados da tabela
      if (onProductUpdated) {
        onProductUpdated();
      }
    }
  };

  console.log(products);

  return (
    <div className="rounded-lg overflow-hidden border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-teal-100 hover:bg-teal-100">
            <TableHead className="text-gray-700 font-semibold">Nome</TableHead>
            <TableHead className="text-gray-700 font-semibold">
              Código de barras
            </TableHead>
            <TableHead className="text-gray-700 font-semibold">
              Categoria
            </TableHead>
            <TableHead className="text-gray-700 font-semibold">
              Tamanho
            </TableHead>
            <TableHead className="text-gray-700 font-semibold">
              Preço Venda
            </TableHead>
            <TableHead className="text-gray-700 font-semibold">
              Quantidade
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow
              key={product.codigo_barras ?? index}
              className="hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                setSelectedProduct(product);
                setOpen(true);
              }}
            >
              <TableCell className="font-medium">{product.nome}</TableCell>
              <TableCell>{product.codigo_barras ?? "—"}</TableCell>
              <TableCell>{product.categoria ?? "—"}</TableCell>
              <TableCell>{product.tamanho ?? "—"}</TableCell>
              <TableCell>
                {product.preco_venda != null
                  ? `R$ ${Number(product.preco_venda)
                      .toFixed(2)
                      .replace(".", ",")}`
                  : "0,00"}
              </TableCell>
              <TableCell>
                <Badge className={getQuantityColor(product.quantidade)}>
                  {product.quantidade ?? 0}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={handleDialogClose}>
        {selectedProduct && (
          <DialogAlter
            setOpen={setOpen}
            product={selectedProduct}
            onProductUpdated={onProductUpdated}
          />
        )}
      </Dialog>
    </div>
  );
}
