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
import {
  Check,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  MoreHorizontal,
} from "lucide-react";
import { useContasPagar } from "../../../hooks/useContasPagar";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

interface AccountsTableProps {
  contas: Array<{
    id: string;
    fornecedor_id?: string;
    fornecedor_nome: string;
    valor: number;
    data_vencimento: string;
    status: string;
    categoria_id?: string;
    categoria_nome?: string;
    descricao: string;
    observacoes?: string;
    data_agendamento?: string;
    data_pagamento?: string;
    valor_pago?: number;
    forma_pagamento?: string;
    dias_atraso: number;
    criado_em: string;
    atualizado_em: string;
  }>;
  loading: boolean;
  onRefresh: () => void;
}

function getStatusBadge(status: string) {
  switch (status) {
    case "pago":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Pago
        </Badge>
      );
    case "agendado":
      return (
        <Badge variant="outline" className="border-blue-200 text-blue-700">
          Agendado
        </Badge>
      );
    case "vencido":
      return <Badge variant="destructive">Vencido</Badge>;
    default:
      return (
        <Badge variant="outline" className="border-yellow-200 text-yellow-700">
          Pendente
        </Badge>
      );
  }
}

export function AccountsTable({
  contas,
  loading,
  onRefresh,
}: AccountsTableProps) {
  const { marcarComoPaga, excluirConta, formatarMoeda, formatarData } =
    useContasPagar();

  const handlePagar = async (conta: AccountsTableProps["contas"][0]) => {
    try {
      const valorPago = prompt(
        `Valor pago para ${conta.fornecedor_nome}:`,
        conta.valor.toString()
      );
      if (!valorPago) return;

      const formaPagamento = prompt("Forma de pagamento:", "PIX");
      if (!formaPagamento) return;

      const resultado = await marcarComoPaga(
        conta.id,
        Number(valorPago),
        formaPagamento
      );
      if (resultado) {
        toast.success("Conta marcada como paga com sucesso!");
        onRefresh();
      }
    } catch {
      toast.error("Erro ao marcar conta como paga");
    }
  };

  const handleExcluir = async (conta: AccountsTableProps["contas"][0]) => {
    if (
      !confirm(
        `Tem certeza que deseja excluir a conta de ${conta.fornecedor_nome}?`
      )
    ) {
      return;
    }

    try {
      const resultado = await excluirConta(conta.id);
      if (resultado) {
        toast.success("Conta excluída com sucesso!");
        onRefresh();
      }
    } catch {
      toast.error("Erro ao excluir conta");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Carregando contas...</span>
        </div>
      </div>
    );
  }

  if (contas.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">Nenhuma conta encontrada</p>
        <Button onClick={onRefresh} variant="outline">
          Recarregar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {contas.length} conta{contas.length !== 1 ? "s" : ""} encontrada
          {contas.length !== 1 ? "s" : ""}
        </h3>
        <Button onClick={onRefresh} variant="outline" size="sm">
          Atualizar
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Fornecedor</TableHead>
              <TableHead className="font-semibold">Descrição</TableHead>
              <TableHead className="font-semibold">Categoria</TableHead>
              <TableHead className="font-semibold">Valor</TableHead>
              <TableHead className="font-semibold">Vencimento</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Dias em Atraso</TableHead>
              <TableHead className="font-semibold">Observações</TableHead>
              <TableHead className="font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contas.map((conta) => (
              <TableRow key={conta.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div className="space-y-1">
                    <div>{conta.fornecedor_nome}</div>
                    {conta.fornecedor_id && (
                      <div className="text-xs text-muted-foreground">
                        ID: {conta.fornecedor_id}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="space-y-1">
                    <div className="truncate" title={conta.descricao}>
                      {conta.descricao}
                    </div>
                    {conta.observacoes && (
                      <div className="text-xs text-muted-foreground">
                        {conta.observacoes}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {conta.categoria_nome || "Sem categoria"}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono">
                  <div className="space-y-1 ">
                    <div className="font-bold text-sm">
                      {formatarMoeda(conta.valor)}
                    </div>
                    {conta.valor_pago && (
                      <div className="text-xs text-green-600">
                        Pago: {formatarMoeda(conta.valor_pago)}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div
                      className={`font-medium ${
                        conta.dias_atraso > 0 ? "text-destructive" : ""
                      }`}
                    >
                      {formatarData(conta.data_vencimento)}
                    </div>
                    {conta.data_agendamento && (
                      <div className="text-xs text-blue-600">
                        Agendado: {formatarData(conta.data_agendamento)}
                      </div>
                    )}
                    {conta.data_pagamento && (
                      <div className="text-xs text-green-600">
                        Pago em: {formatarData(conta.data_pagamento)}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(conta.status)}</TableCell>
                <TableCell>
                  {conta.dias_atraso > 0 ? (
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-destructive" />
                      <span className="text-destructive font-medium">
                        {conta.dias_atraso} dia
                        {conta.dias_atraso !== 1 ? "s" : ""}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="max-w-xs">
                  {conta.observacoes ? (
                    <div
                      className="text-xs text-muted-foreground truncate"
                      title={conta.observacoes}
                    >
                      {conta.observacoes}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => console.log("Visualizar")}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </DropdownMenuItem>

                      {conta.status !== "pago" && (
                        <>
                          <DropdownMenuItem
                            onClick={() => handlePagar(conta)}
                            className="text-green-600"
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Marcar como paga
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => console.log("Editar")}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        </>
                      )}

                      <DropdownMenuItem
                        onClick={() => handleExcluir(conta)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
