import { Card, CardContent } from "../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

export function TableData() {
  const tableData = [
    { codigo: "1", cliente: "Pessoa 1", valor: "R$ 200", situacao: "Vendido" },
    { codigo: "2", cliente: "Pessoa 2", valor: "R$ 300", situacao: "Vendido" },
    { codigo: "3", cliente: "Pessoa 3", valor: "R$ 500", situacao: "Vendido" },
    { codigo: "4", cliente: "Pessoa 4", valor: "R$ 400", situacao: "Vendido" },
  ];
  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Situação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row) => (
              <TableRow key={row.codigo}>
                <TableCell className="font-medium">{row.codigo}</TableCell>
                <TableCell>{row.cliente}</TableCell>
                <TableCell>{row.valor}</TableCell>
                <TableCell>{row.situacao}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
