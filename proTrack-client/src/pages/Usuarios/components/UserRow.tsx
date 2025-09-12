import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, UserX, UserCheck } from "lucide-react";
import type { User } from "@/@types/types.api";
import { roles, departamentos } from "@/utils/functions";
import { Badge } from "@/components/ui/badge";

interface UserRowProps {
  user: User;
  openDialog: (user: User) => void;
  toggleUserStatus: (userId: string) => void;
}

export default function UserRow({
  user,
  openDialog,
  toggleUserStatus,
}: UserRowProps) {
  const getStatusBadge = (status: User["status"]) => {
    const variants = {
      ativo: "bg-green-100 text-green-800 hover:bg-green-100",
      inativo: "bg-gray-100 text-gray-800 hover:bg-gray-100",
      bloqueado: "bg-red-100 text-red-800 hover:bg-red-100",
    };
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status}
      </Badge>
    );
  };

  const getRoleLabel = (role: string) =>
    roles.find((r) => r.value === role)?.label || role;

  const getDepartamentoLabel = (id: number | null) => {
    if (!id) return "-";
    return (
      departamentos.find((d) => d.value === id.toString())?.label ||
      "Desconhecido"
    );
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-muted-foreground">
              @{user.username}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{getRoleLabel(user.role)}</TableCell>
      <TableCell>
        {getDepartamentoLabel(
          user.departamento_id ? parseInt(user.departamento_id) : null
        )}
      </TableCell>
      <TableCell>{getStatusBadge(user.status)}</TableCell>
      <TableCell>
        {user.ultimo_login
          ? new Date(user.ultimo_login).toLocaleDateString("pt-BR")
          : "Nunca"}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => openDialog(user)}>
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleUserStatus(user.id)}
          >
            {user.status === "ativo" ? (
              <UserX className="h-4 w-4 text-red-600" />
            ) : (
              <UserCheck className="h-4 w-4 text-green-600" />
            )}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
