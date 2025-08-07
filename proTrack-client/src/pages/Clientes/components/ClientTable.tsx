import type { Cliente } from "../../../@types/types.components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { formatarDataNascimento } from "../../../utils/functions";

interface ClientTableProps {
  clientes: Cliente[];
}

export function ClientTable({ clientes }: ClientTableProps) {
  return (
    <div className="overflow-auto border border-border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-teal-100 hover:bg-teal-100">
            <TableHead>Nome</TableHead>
            <TableHead>Data de Nascimento</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>CEP</TableHead>
            <TableHead>Endereço</TableHead>
            <TableHead>Número</TableHead>
            <TableHead>Bairro</TableHead>
            <TableHead>Cidade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.map((cliente, index) => (
            <TableRow key={cliente.cpf ?? index} className="hover:bg-muted/50">
              <TableCell>{cliente.nome}</TableCell>
              <TableCell>
                {cliente.dataNascimento
                  ? formatarDataNascimento(cliente.dataNascimento)
                  : "—"}
              </TableCell>
              <TableCell>{cliente.cpf}</TableCell>
              <TableCell>{cliente.telefoneWhatsapp ?? "—"}</TableCell>
              <TableCell>{cliente.email}</TableCell>
              <TableCell>{cliente.cep ?? "—"}</TableCell>
              <TableCell>{cliente.endereco ?? "—"}</TableCell>
              <TableCell>{cliente.numero ?? "—"}</TableCell>
              <TableCell>{cliente.bairro ?? "—"}</TableCell>
              <TableCell>{cliente.cidade ?? "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
