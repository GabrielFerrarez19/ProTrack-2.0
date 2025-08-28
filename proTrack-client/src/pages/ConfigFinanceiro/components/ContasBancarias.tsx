import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Building, Plus, Edit, Trash2 } from "lucide-react";
import type { ContaBancaria } from "../../../@types/types.components";

interface Props {
  contasBancarias: ContaBancaria[];
  setContasBancarias: React.Dispatch<React.SetStateAction<ContaBancaria[]>>;
}

export function ContasBancarias({
  contasBancarias,
  setContasBancarias,
}: Props) {
  const handleAdicionarConta = () =>
    console.log("Funcionalidade para adicionar nova conta bancária.");
  const handleEditarConta = (id: string) =>
    console.log(`Editando conta bancária ID: ${id}`);
  const handleExcluirConta = (id: string) => {
    setContasBancarias((contas) => contas.filter((c) => c.id !== id));
    console.log(`Conta ${id} removida.`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Contas Bancárias
          </CardTitle>
          <Button
            onClick={handleAdicionarConta}
            className="cursor-pointer bg-gradient-to-r from-[#628DFD] to-[#6F31FF] 
      text-white font-semibold hover:from-[#7A9BFD] hover:to-[#B597F9]"
          >
            <Plus className="h-4 w-4 mr-2" /> Nova Conta
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Banco</TableHead>
              <TableHead>Agência</TableHead>
              <TableHead>Conta</TableHead>
              <TableHead>Saldo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contasBancarias.map((conta) => (
              <TableRow key={conta.id}>
                <TableCell className="font-medium">{conta.nome}</TableCell>
                <TableCell>{conta.banco}</TableCell>
                <TableCell>{conta.agencia}</TableCell>
                <TableCell>{conta.conta}</TableCell>
                <TableCell>
                  R${" "}
                  {conta.saldo.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell>
                  <Badge variant={conta.ativa ? "secondary" : "outline"}>
                    {conta.ativa ? "Ativa" : "Inativa"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditarConta(conta.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExcluirConta(conta.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
