import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Separator } from "../../../components/ui/separator";
import { Label } from "../../../components/ui/label";
import type { PerfilFormData } from "../../../@types/types.components";
import type { User } from "../../../@types/types.api";
import type { UseFormReturn } from "react-hook-form";

type ProfileFormCardProps = {
  form: UseFormReturn<PerfilFormData>;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  onSubmit: (data: PerfilFormData) => void;
  roles: { value: string; label: string }[];
  departamentos: { value: string; label: string }[];
  user: User;
};

export function ProfileFormCard({
  form,
  isEditing,
  setIsEditing,
  onSubmit,
  roles,
  departamentos,
  user,
}: ProfileFormCardProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>Atualize suas informações de perfil</CardDescription>
        </div>
        <Button
          variant={isEditing ? "outline" : "default"}
          onClick={() => setIsEditing(!isEditing)}
          className={`${
            isEditing
              ? "hover:bg-muted "
              : "cursor-pointer bg-gradient-to-r from-[#628DFD] to-[#6F31FF] text-white hover:from-[#7A9BFD] hover:to-[#B597F9]"
          }`}
        >
          {isEditing ? "Cancelar" : "Editar"}
        </Button>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" disabled={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!isEditing}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a função" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="departamento_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!isEditing}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o departamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departamentos.map((d) => (
                          <SelectItem key={d.value} value={d.value}>
                            {d.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {isEditing && (
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className={`cursor-pointer bg-gradient-to-r from-[#628DFD] to-[#6F31FF] text-white hover:from-[#7A9BFD] hover:to-[#B597F9]`}
                >
                  Salvar Alterações
                </Button>
              </div>
            )}
          </form>
        </Form>

        <Separator className="my-6" />

        {/* Informações de Sistema */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Informações do Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">ID do Usuário</Label>
              <p className="font-medium">#{user.id}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Status</Label>
              <p className="font-medium capitalize">{user.status}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Data de Cadastro</Label>
              <p className="font-medium">
                {new Date(user.created_at).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">
                Última Atualização
              </Label>
              <p className="font-medium">
                {new Date(user.updated_at).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
