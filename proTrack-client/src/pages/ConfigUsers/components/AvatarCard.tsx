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
import type { User } from "../../../@types/types.components";

type AvatarCardProps = {
  user: User;
  getStatusColor: (status: string) => string;
  getRoleLabel: (role: string) => string;
  getDepartamentoLabel: (id: number) => string;
};

export function AvatarCard({
  user,
  getStatusColor,
  getRoleLabel,
  getDepartamentoLabel,
}: AvatarCardProps) {
  return (
    <Card className="lg:col-span-1">
      <CardHeader className="text-center">
        <Avatar className="w-24 h-24 mx-auto">
          <AvatarImage src="/placeholder-avatar.jpg" />
          <AvatarFallback className="text-2xl">
            {user.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-xl">{user.name}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
        <Badge className={getStatusColor(user.status)}>
          {user.status.toUpperCase()}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{getRoleLabel(user.role)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">
            {getDepartamentoLabel(user.departamento_id!)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">
            Último login: {new Date(user.ultimo_login).toLocaleString("pt-BR")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
