import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { User } from "../index";
import UserRow from "./UserRow";

interface UserTableProps {
  users: User[];
  openDialog: (user: User) => void;
  toggleUserStatus: (userId: number) => void;
}

export default function UserTable({
  users,
  openDialog,
  toggleUserStatus,
}: UserTableProps) {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Perfil</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Último Login</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              openDialog={openDialog}
              toggleUserStatus={toggleUserStatus}
            />
          ))}
        </TableBody>
      </Table>

      {users.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum usuário encontrado
        </div>
      )}
    </>
  );
}
