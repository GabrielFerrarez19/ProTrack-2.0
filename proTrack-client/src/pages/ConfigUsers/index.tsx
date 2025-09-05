import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { AvatarCard } from "./components/AvatarCard";
import { ProfileFormCard } from "./components/ProfileFormCard";
import type { User } from "../../@types/types.components";
import { Header } from "../../components/header";

const perfilSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  username: z.string().min(3).optional(),
  role: z.string(),
  departamento_id: z.string().optional(),
});
type PerfilFormData = z.infer<typeof perfilSchema>;

const mockUser = {
  id: 1,
  name: "João Silva",
  email: "joao.silva@empresa.com",
  username: "joaosilva",
  role: "admin",
  status: "ativo",
  empresa_id: 1,
  departamento_id: 2,
  ultimo_login: "2024-01-15T10:30:00",
  created_at: "2023-06-15T09:00:00",
  updated_at: "2024-01-10T14:20:00",
};

const roles = [
  { value: "admin", label: "Administrador" },
  { value: "financeiro", label: "Financeiro" },
  { value: "vendas", label: "Vendas" },
  { value: "user", label: "Usuário" },
];

const departamentos = [
  { value: "1", label: "Administrativo" },
  { value: "2", label: "Financeiro" },
  { value: "3", label: "Vendas" },
  { value: "4", label: "Estoque" },
];

export function ConfigUsers() {
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      name: mockUser.name,
      email: mockUser.email,
      username: mockUser.username,
      role: mockUser.role,
      departamento_id: mockUser.departamento_id?.toString(),
    },
  });

  const onSubmit = (data: PerfilFormData) => {
    console.log("Dados do perfil:", data);
    toast.success("Perfil atualizado", {
      description: "Suas informações foram atualizadas com sucesso.",
      style: { background: "#4ade80", color: "#065f46" },
    });
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-success text-success-foreground";
      case "inativo":
        return "bg-secondary text-secondary-foreground";
      case "bloqueado":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getRoleLabel = (role: string) =>
    roles.find((r) => r.value === role)?.label || role;
  const getDepartamentoLabel = (id: number) =>
    departamentos.find((d) => d.value === id.toString())?.label ||
    "Não informado";

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Bem vindo a página Configurações de Usuários!"
        text="Aqui você pode configurar as informações do usuário"
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AvatarCard
          user={mockUser as User}
          getStatusColor={getStatusColor}
          getRoleLabel={getRoleLabel}
          getDepartamentoLabel={getDepartamentoLabel}
        />
        <ProfileFormCard
          form={form}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onSubmit={onSubmit}
          roles={roles}
          departamentos={departamentos}
          user={mockUser as User}
        />
      </div>
    </div>
  );
}
