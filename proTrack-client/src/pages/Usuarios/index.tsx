import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useUsers } from "@/hooks/useUsers";
import type { User } from "@/@types/types.api";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/PageLoading";

import UserDialog from "./components/UserDialog";
import UserFilters from "./components/UserFilters";
import UserTable from "./components/UserTable";
import { Header } from "@/components/header";

const userSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  username: z.string().min(3, "Username deve ter pelo menos 3 caracteres"),
  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .optional(),
  role: z.string().min(1, "Selecione um perfil"),
  status: z.string().min(1, "Selecione um status"),
  departamento_id: z.string().optional(),
});
type UserFormData = z.infer<typeof userSchema>;

export default function GerenciarUsuarios() {
  const {
    users,
    isLoading,
    error,
    fetchUsers,
    createNewUser,
    updateUser,
    changeStatus,
    searchUsersByTerm,
    clearError,
  } = useUsers();

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Carregar usuários ao montar o componente
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      role: "",
      status: "ativo",
      departamento_id: "",
    },
  });

  // Usar debounce para busca
  useEffect(() => {
    const handleSearch = async (term: string) => {
      if (term.trim()) {
        try {
          await searchUsersByTerm(term);
        } catch {
          toast.error("Erro ao buscar usuários");
        }
      } else {
        fetchUsers();
      }
    };

    const timeoutId = setTimeout(() => {
      handleSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchUsersByTerm, fetchUsers]);

  const openDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      form.reset({
        name: user.name,
        email: user.email,
        username: user.username,
        password: "", // Não mostrar senha existente
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

  const onSubmit = async (data: UserFormData) => {
    try {
      if (editingUser) {
        // Atualizar usuário existente
        const updateData: {
          name: string;
          email: string;
          username?: string;
          role: string;
          status: string;
          departamento_id?: number;
        } = {
          name: data.name,
          email: data.email,
          username: data.username,
          role: data.role,
          status: data.status,
        };

        if (data.departamento_id) {
          updateData.departamento_id = parseInt(data.departamento_id);
        }

        await updateUser(editingUser.id, updateData);

        toast.success("Usuário atualizado", {
          description: "Os dados do usuário foram atualizados com sucesso.",
        });
      } else {
        // Criar novo usuário
        if (!data.password) {
          toast.error("Senha é obrigatória para novos usuários");
          return;
        }

        await createNewUser({
          name: data.name,
          email: data.email,
          username: data.username,
          password: data.password,
          role: data.role,
          departamento_id: data.departamento_id,
        });

        toast.success("Usuário criado", {
          description: "Novo usuário foi criado com sucesso.",
        });
      }

      setIsDialogOpen(false);
      form.reset();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Tente novamente mais tarde.";
      toast.error("Erro ao salvar usuário", {
        description: errorMessage,
      });
    }
  };

  const toggleUserStatus = async (userId: string) => {
    try {
      const user = users.find((u) => u.id === userId);
      if (!user) return;

      const newStatus = user.status === "ativo" ? "inativo" : "ativo";

      await changeStatus(userId, newStatus);

      toast.success("Status alterado", {
        description: `Usuário ${
          newStatus === "ativo" ? "ativado" : "desativado"
        } com sucesso.`,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Tente novamente mais tarde.";
      toast.error("Erro ao alterar status", {
        description: errorMessage,
      });
    }
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
        {isLoading ? (
          <PageLoading
            message="Carregando usu?rios..."
          />
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-red-500">
              {error}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  clearError();
                  fetchUsers();
                }}
                className="ml-2"
              >
                Tentar novamente
              </Button>
            </div>
          </div>
        ) : (
          <UserTable
            users={users}
            openDialog={openDialog}
            toggleUserStatus={toggleUserStatus}
          />
        )}
      </Card>
    </div>
  );
}
