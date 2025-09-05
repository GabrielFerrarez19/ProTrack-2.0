import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import type { ClienteFormData } from "../../../@types/types.components";
import { cadastrarCliente } from "../../../services/api";

// Sonner Toast
import { toast } from "sonner";

export function ClientForm() {
  const { register, setValue, handleSubmit, reset } =
    useForm<ClienteFormData>();

  const onSubmit = async (data: ClienteFormData) => {
    try {
      const resposta = await cadastrarCliente(data);
      console.log("Cliente cadastrado com sucesso:", resposta);
      reset();
      toast.success("Cliente cadastrado com sucesso!", {
        style: { background: "#4ade80", color: "#065f46" }, // verde pastel
      });
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      toast.error(
        "Erro ao cadastrar cliente. Verifique os dados e tente novamente.",
        {
          style: { background: "#f87171", color: "#7f1d1d" }, // vermelho pastel
        }
      );
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-elegant border-2 bg-card border-[var(--bluePast-500)] p-0">
      <CardHeader className="flex bg-[var(--bluePast-500)] h-20 text-primary-foreground rounded-t-lg items-center">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <User className="w-6 h-6" />
          Cadastro de Clientes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* 🔹 Seção 1: Dados Pessoais */}
          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <legend className="text-lg font-medium text-muted-foreground mb-2 col-span-full">
              Dados Pessoais
            </legend>

            <div className="space-y-2 col-span-full">
              <Label htmlFor="nome">Nome completo *</Label>
              <Input
                id="nome"
                {...register("nome", { required: true })}
                placeholder="Ex: João da Silva"
                className="h-11 bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataNascimento">Data de nascimento *</Label>
              <Input
                id="dataNascimento"
                type="date"
                {...register("dataNascimento", { required: true })}
                className="h-11 bg-input border-border"
              />
            </div>

            <div className="space-y-2 grid grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sexo">Sexo</Label>
                <Select onValueChange={(val) => setValue("sexo", val)}>
                  <SelectTrigger className="h-11 bg-input border-border">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Feminino">Feminino</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estadoCivil">Estado civil</Label>
                <Select onValueChange={(val) => setValue("estadoCivil", val)}>
                  <SelectTrigger className="h-11 bg-input border-border">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Solteiro(a)">Solteiro(a)</SelectItem>
                    <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                    <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                    <SelectItem value="Viúvo(a)">Viúvo(a)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                {...register("cpf", { required: true })}
                placeholder="000.000.000-00"
                className="h-11 bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rg">RG</Label>
              <Input
                id="rg"
                {...register("rg")}
                placeholder="12.345.678-9"
                className="h-11 bg-input border-border"
              />
            </div>
          </fieldset>

          {/* 🔹 Seção 2: Contato */}
          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <legend className="text-lg font-medium text-muted-foreground mb-2 col-span-full">
              Contato
            </legend>

            <div className="space-y-2 col-span-full">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: true })}
                placeholder="joao@email.com"
                className="h-11 bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefoneCelular">Telefone celular</Label>
              <Input
                id="telefoneCelular"
                {...register("telefoneCelular")}
                placeholder="(11) 91234-5678"
                className="h-11 bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefoneWhatsapp">Telefone WhatsApp</Label>
              <Input
                id="telefoneWhatsapp"
                {...register("telefoneWhatsapp")}
                placeholder="(11) 97654-3210"
                className="h-11 bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefoneResidencial">Telefone residencial</Label>
              <Input
                id="telefoneResidencial"
                {...register("telefoneResidencial")}
                placeholder="(11) 3456-7890"
                className="h-11 bg-input border-border"
              />
            </div>
          </fieldset>

          {/* 🔹 Seção 3: Endereço */}
          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <legend className="text-lg font-medium text-muted-foreground mb-2 col-span-full">
              Endereço
            </legend>

            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                {...register("cep")}
                placeholder="00000-000"
                className="h-11 bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                {...register("endereco")}
                placeholder="Rua Exemplo"
                className="h-11 bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero">Número</Label>
              <Input
                id="numero"
                {...register("numero")}
                placeholder="123"
                className="h-11 bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="complemento">Complemento</Label>
              <Input
                id="complemento"
                {...register("complemento")}
                placeholder="Casa / Apto / Bloco"
                className="h-11 bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input
                id="bairro"
                {...register("bairro")}
                placeholder="Centro"
                className="h-11 bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                {...register("cidade")}
                placeholder="São Paulo"
                className="h-11 bg-input border-border"
              />
            </div>
          </fieldset>

          {/* 🔹 Botões */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className=" cursor-pointer text-primary-foreground font-medium px-8 h-11 shadow-soft bg-gradient-to-r from-[#628DFD] to-[#6F31FF] hover:from-[#7A9BFD] hover:to-[#B597F9]"
            >
              Cadastrar Cliente
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              className="border-border hover:bg-muted h-11 px-8"
            >
              Limpar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
