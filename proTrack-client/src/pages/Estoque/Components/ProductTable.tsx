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
import { useState, useMemo } from "react";
import { Dialog } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
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

  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Cálculos de paginação
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = useMemo(() => {
    return products.slice(startIndex, endIndex);
  }, [products, startIndex, endIndex]);

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
          {currentProducts.map((product, index) => (
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

      {/* Controles de Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
          <div className="flex items-center text-sm text-gray-700">
            <span>
              Mostrando {startIndex + 1} a {Math.min(endIndex, products.length)}{" "}
              de {products.length} produtos
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
                )
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
