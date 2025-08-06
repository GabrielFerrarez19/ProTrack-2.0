import type { Product } from "../../../@types/types.components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow
              key={product.codigo_barras ?? index}
              className="hover:bg-muted/50"
            >
              <TableCell className="font-medium">{product.nome}</TableCell>
              <TableCell>{product.codigo_barras ?? "—"}</TableCell>
              <TableCell>{product.categoria ?? "—"}</TableCell>
              <TableCell>{product.tamanho ?? "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
