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
import type { VendaResponse } from "../../../@types/types.components";
import { calcularDiasAtraso, formatBRL } from "../../../utils/functions";

interface Props {
  vendas: VendaResponse[];
}

export function TabelaContas({ vendas }: Props) {
  console.log("vendas", vendas);

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
        {vendas.map((conta) => (
          <TableRow key={conta.id}>
            <TableCell className="font-medium">{conta.cliente_nome}</TableCell>

            {/* Descrição: lista de produtos */}
            <TableCell>
              {conta.itens.map((item) => item.produto_nome).join(", ")}
            </TableCell>

            {/* Valor total com desconto */}
            <TableCell>R$ {formatBRL(conta.total)}</TableCell>

            {/* Valor original */}
            <TableCell>
              R$
              {formatBRL(conta.total_com_desconto)}
            </TableCell>

            {/* Vencimento */}
            <TableCell>Dia {conta.dias_vencimento}</TableCell>

            {/* Status */}
            <TableCell>
              <StatusBadge status={conta.status} />
            </TableCell>

            {/* Dias em atraso */}
            <TableCell>
              {conta.dias_vencimento ? (
                (() => {
                  const atraso = calcularDiasAtraso(
                    conta.data_venda,
                    conta.dias_vencimento
                  );
                  return atraso && atraso > 0 ? (
                    <span className="text-pastel-red font-medium">
                      {atraso} dias
                    </span>
                  ) : (
                    <span className="text-green-600 font-medium">Em dia</span>
                  );
                })()
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </TableCell>

            {/* Ações */}
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
