import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { CreditCard, Check, Clock } from "lucide-react";
import type { ContaPagar } from "../../../@types/types.components";

interface AccountsTableProps {
  contas: ContaPagar[];
}

function getStatusBadge(status: ContaPagar["status"]) {
  switch (status) {
    case "pago":
      return <Badge variant="secondary">Pago</Badge>;
    case "agendado":
      return <Badge variant="outline">Agendado</Badge>;
    case "vencido":
      return <Badge variant="destructive">Vencido</Badge>;
    default:
      return <Badge variant="outline">Pendente</Badge>;
  }
}

export function AccountsTable({ contas }: AccountsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fornecedor</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Vencimento</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Dias em Atraso</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contas.map((conta) => (
          <TableRow key={conta.id}>
            <TableCell className="font-medium">{conta.fornecedor}</TableCell>
            <TableCell>{conta.descricao}</TableCell>
            <TableCell>
              <Badge variant="outline">{conta.categoria}</Badge>
            </TableCell>
            <TableCell>
              R{"$"}{" "}
              {conta.valor.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </TableCell>
            <TableCell>
              {new Date(conta.dataVencimento).toLocaleDateString("pt-BR")}
              {conta.dataAgendamento && (
                <div className="text-xs text-muted-foreground">
                  Agendado:{" "}
                  {new Date(conta.dataAgendamento).toLocaleDateString("pt-BR")}
                </div>
              )}
            </TableCell>
            <TableCell>{getStatusBadge(conta.status)}</TableCell>
            <TableCell>
              {conta.diasAtraso > 0 ? (
                <span className="text-destructive font-medium">
                  {conta.diasAtraso} dias
                </span>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex gap-2 flex-wrap">
                {conta.status !== "pago" && (
                  <>
                    <Button size="sm" variant="outline">
                      <Check className="h-4 w-4 mr-1" /> Pagar
                    </Button>
                    {conta.status !== "agendado" && (
                      <Button size="sm" variant="outline">
                        <Clock className="h-4 w-4 mr-1" /> Agendar
                      </Button>
                    )}
                  </>
                )}
                <Button size="sm" variant="outline">
                  <CreditCard className="h-4 w-4 mr-1" /> Comprovante
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
