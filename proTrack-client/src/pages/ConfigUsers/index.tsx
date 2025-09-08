import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AvatarCard } from "./components/AvatarCard";
import { ProfileFormCard } from "./components/ProfileFormCard";
import { Header } from "../../components/header";
import { useAuth } from "../../hooks/useAuth";
import { perfilSchema, type PerfilFormData } from "../../schemas/schemaUsers";
import { roles, departamentos } from "../../utils/functions";

export function ConfigUsers() {
  const [isEditing, setIsEditing] = useState(false);
  const { user, updateUser, isLoading, error } = useAuth();

  const form = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      role: "",
      departamento_id: "",
    },
  });

  // Atualizar valores do formulário quando o usuário carregar
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        username: user.username || "",
        role: user.role,
        departamento_id: user.departamento_id || "",
      });
    }
  }, [user, form]);

  const onSubmit = async (data: PerfilFormData) => {
    try {
      await updateUser({
        name: data.name,
        email: data.email,
        username: data.username,
        role: data.role,
        departamento_id: data.departamento_id
          ? parseInt(data.departamento_id)
          : undefined,
      });

      toast.success("Perfil atualizado", {
        description: "Suas informações foram atualizadas com sucesso.",
        style: { background: "#4ade80", color: "#065f46" },
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      toast.error("Erro ao atualizar perfil", {
        description: "Não foi possível atualizar suas informações.",
        style: { background: "#ef4444", color: "#ffffff" },
      });
    }
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
  const getDepartamentoLabel = (id: string) => {
    if (!id) return "Não informado";
    return departamentos.find((d) => d.value === id)?.label || "Não informado";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Header
          title="Configurações de Usuário"
          text="Carregando suas informações..."
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados do usuário...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 space-y-6">
        <Header
          title="Configurações de Usuário"
          text="Erro ao carregar informações"
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-red-600 font-semibold">Erro ao carregar dados</p>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // No user state
  if (!user) {
    return (
      <div className="p-6 space-y-6">
        <Header
          title="Configurações de Usuário"
          text="Usuário não encontrado"
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-gray-500 text-6xl mb-4">👤</div>
            <p className="text-gray-600 font-semibold">
              Usuário não encontrado
            </p>
            <p className="text-gray-500">
              Faça login para acessar suas configurações
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Configurações de Usuário"
        text="Gerencie suas informações pessoais e configurações"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AvatarCard
          getStatusColor={getStatusColor}
          getRoleLabel={getRoleLabel}
          getDepartamentoLabel={getDepartamentoLabel}
        />
        <ProfileFormCard
          form={form}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onSubmit={onSubmit}
          user={user}
        />
      </div>
    </div>
  );
}
