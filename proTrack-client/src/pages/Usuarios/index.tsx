import { useState } from "react";
import { Plus } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import UserDialog from "./components/UserDialog";
import UserFilters from "./components/UserFilters";
import UserTable from "./components/UserTable";
import { Header } from "@/components/header";

const userSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  username: z.string().min(3, "Username deve ter pelo menos 3 caracteres"),
  role: z.string().min(1, "Selecione um perfil"),
  status: z.string().min(1, "Selecione um status"),
  departamento_id: z.string().optional(),
});
type UserFormData = z.infer<typeof userSchema>;

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  role: string;
  status: "ativo" | "inativo" | "bloqueado";
  departamento_id: number | null;
  ultimo_login: string | null;
  created_at: string;
  updated_at: string;
}

const mockUsers: User[] = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@empresa.com",
    username: "joao.silva",
    role: "admin",
    status: "ativo",
    departamento_id: 1,
    ultimo_login: "2024-01-08 10:30:00",
    created_at: "2024-01-01 08:00:00",
    updated_at: "2024-01-08 10:30:00",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@empresa.com",
    username: "maria.santos",
    role: "financeiro",
    status: "ativo",
    departamento_id: 2,
    ultimo_login: "2024-01-08 09:15:00",
    created_at: "2024-01-02 14:00:00",
    updated_at: "2024-01-08 09:15:00",
  },
  {
    id: 3,
    name: "Pedro Costa",
    email: "pedro@empresa.com",
    username: "pedro.costa",
    role: "vendas",
    status: "inativo",
    departamento_id: 3,
    ultimo_login: "2023-12-20 16:45:00",
    created_at: "2023-11-15 11:00:00",
    updated_at: "2023-12-20 16:45:00",
  },
  {
    id: 4,
    name: "Ana Oliveira",
    email: "ana@empresa.com",
    username: "ana.oliveira",
    role: "user",
    status: "ativo",
    departamento_id: 1,
    ultimo_login: "2024-01-07 15:20:00",
    created_at: "2023-10-10 09:30:00",
    updated_at: "2024-01-07 15:20:00",
  },
];

export default function GerenciarUsuarios() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      role: "",
      status: "ativo",
      departamento_id: "",
    },
  });

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      form.reset({
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status,
        departamento_id: user.departamento_id?.toString() || "",
      });
    } else {
      setEditingUser(null);
      form.reset();
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (data: UserFormData) => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                ...data,
                status: data.status as User["status"],
                departamento_id: data.departamento_id
                  ? parseInt(data.departamento_id)
                  : null,
                updated_at: new Date().toISOString(),
              }
            : user
        )
      );
      toast.success("Usuário atualizado", {
        description: "Os dados do usuário foram atualizados com sucesso.",
      });
    } else {
      const newUser: User = {
        id: Math.max(...users.map((u) => u.id)) + 1,
        name: data.name,
        email: data.email,
        username: data.username,
        role: data.role,
        status: data.status as User["status"],
        departamento_id: data.departamento_id
          ? parseInt(data.departamento_id)
          : null,
        ultimo_login: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setUsers((prev) => [...prev, newUser]);
      toast.success("Usuário criado", {
        description: "Novo usuário foi criado com sucesso.",
      });
    }
    setIsDialogOpen(false);
    form.reset();
  };

  const toggleUserStatus = (userId: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "ativo" ? "inativo" : "ativo",
              updated_at: new Date().toISOString(),
            }
          : user
      )
    );

    const user = users.find((u) => u.id === userId);
    const newStatus = user?.status === "ativo" ? "inativo" : "ativo";

    toast.success("Status alterado", {
      description: `Usuário ${
        newStatus === "ativo" ? "ativado" : "desativado"
      } com sucesso.`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Header
          title="Gerenciar Usuários"
          text="Gerencie todos os usuários do sistema"
        />

        <Button
          onClick={() => openDialog()}
          className="cursor-pointer bg-gradient-to-r from-[#628DFD] to-[#6F31FF] hover:from-[#7A9BFD] hover:to-[#B597F9]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      <UserDialog
        form={form}
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        editingUser={editingUser}
        onSubmit={onSubmit}
      />

      <UserFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <Card>
        <UserTable
          users={filteredUsers}
          openDialog={openDialog}
          toggleUserStatus={toggleUserStatus}
        />
      </Card>
    </div>
  );
}
