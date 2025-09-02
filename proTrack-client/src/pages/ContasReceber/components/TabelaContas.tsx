import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Mail, Check } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface ContaReceber {
  id: string;
  cliente: string;
  valor: number;
  dataVencimento: string;
  diasAtraso: number;
  status: "pendente" | "parcial" | "pago" | "vencido";
  valorPago: number;
  descricao: string;
}

export function TabelaContas({ contas }: { contas: ContaReceber[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-pastel-blue/20">
          <TableHead>Cliente</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Valor Pago</TableHead>
          <TableHead>Vencimento</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Dias em Atraso</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contas.map((conta) => (
          <TableRow key={conta.id}>
            <TableCell className="font-medium">{conta.cliente}</TableCell>
            <TableCell>{conta.descricao}</TableCell>
            <TableCell>
              R${" "}
              {conta.valor.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </TableCell>
            <TableCell>
              R${" "}
              {conta.valorPago.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </TableCell>
            <TableCell>
              {new Date(conta.dataVencimento).toLocaleDateString("pt-BR")}
            </TableCell>
            <TableCell>
              <StatusBadge status={conta.status} />
            </TableCell>
            <TableCell>
              {conta.diasAtraso > 0 ? (
                <span className="text-pastel-red font-medium">
                  {conta.diasAtraso} dias
                </span>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                {conta.status !== "pago" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-pastel-green/20"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Baixar
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-pastel-purple/20"
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Lembrete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
