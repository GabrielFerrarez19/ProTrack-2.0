import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "../../../components/ui/badge";
import { Shield, Building, Clock } from "lucide-react";
// Removido import User não utilizado
import { useAuth } from "../../../hooks/useAuth";

type AvatarCardProps = {
  getStatusColor: (status: string) => string;
  getRoleLabel: (role: string) => string;
  getDepartamentoLabel: (id: string) => string;
};

export function AvatarCard({
  getStatusColor,
  getRoleLabel,
  getDepartamentoLabel,
}: AvatarCardProps) {
  const { user, isLoading, error } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro ao carregar usuário: {error}</div>;
  }

  console.log("🔍 AvatarCard - Dados do usuário:", user);

  return (
    <Card className="lg:col-span-1">
      <CardHeader className="text-center">
        <Avatar className="w-24 h-24 mx-auto">
          <AvatarImage
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=Gabriel+Ferrarez"
            alt="Avatar"
            className="w-24 h-24 rounded-md"
          />
          <AvatarFallback className="text-2xl">
            {user?.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-xl">{user?.name}</CardTitle>
        <CardDescription>{user?.email}</CardDescription>
        <Badge className={getStatusColor(user?.status || "")}>
          {user?.status.toUpperCase()}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{getRoleLabel(user?.role || "")}</span>
        </div>
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">
            {getDepartamentoLabel(user?.departamento_id || "")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">
            Último login:{" "}
            {new Date(user?.ultimo_login || "").toLocaleString("pt-BR")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
