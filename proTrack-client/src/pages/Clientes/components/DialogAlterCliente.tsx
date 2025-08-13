import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";

import { atualizarCliente } from "../../../services/api";
import type {
  ClienteFormData,
  Cliente,
} from "../../../@types/types.components";
import { formatarDataParaInput } from "../../../utils/functions";

interface DialogAlterClienteProps {
  setOpen: (value: boolean) => void;
  cliente: Cliente;
  onClienteUpdated?: () => void;
}

export function DialogAlterCliente({
  setOpen,
  cliente,
  onClienteUpdated,
}: DialogAlterClienteProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClienteFormData>();

  // Preenche o formulário com dados do cliente
  useEffect(() => {
    if (cliente) {
      reset({
        id: cliente.id,
        nome: cliente.nome,
        dataNascimento: formatarDataParaInput(cliente.dataNascimento),
        cpf: cliente.cpf,
        rg: cliente.rg || "",
        estadoCivil: cliente.estadoCivil || "",
        sexo: cliente.sexo || "",
        telefoneCelular: cliente.telefoneCelular || "",
        telefoneWhatsapp: cliente.telefoneWhatsapp || "",
        telefoneResidencial: cliente.telefoneResidencial || "",
        email: cliente.email,
        cep: cliente.cep || "",
        endereco: cliente.endereco || "",
        numero: cliente.numero || "",
        complemento: cliente.complemento || "",
        bairro: cliente.bairro || "",
        cidade: cliente.cidade || "",
      });
    }
  }, [cliente, reset]);

  // Envio do formulário
  const onSubmit = async (data: ClienteFormData) => {
    if (!cliente.id) {
      alert("ID do cliente ausente!");
      return;
    }

    console.log("id_cliente", cliente.id);

    try {
      console.log("Dados enviados para atualização:", data, "ID:", cliente.id);
      await atualizarCliente(cliente.id, data);
      alert("Cliente alterado com sucesso!");
      reset();
      setOpen(false);
      if (onClienteUpdated) onClienteUpdated();
    } catch (error: unknown) {
      console.error("Erro ao alterar cliente:", error);

      // Checa se 'error' é um objeto com a propriedade 'error'
      if (typeof error === "object" && error !== null && "error" in error) {
        // Aqui o TS entende que error é do tipo { error: unknown }
        alert((error as { error: string }).error);
      } else {
        alert("Erro ao alterar cliente");
      }
    }
  };

  const sexoSelecionado = watch("sexo");
  const estadoCivilSelecionado = watch("estadoCivil");

  return (
    <DialogContent
      style={{
        width: "900px",
        maxWidth: "none",
        height: "80vh",
        overflowY: "auto",
      }}
    >
      <DialogHeader>
        <DialogTitle>Alterar Dados do Cliente</DialogTitle>
      </DialogHeader>

      <CardContent className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Dados Pessoais */}
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
              {errors.nome && (
                <span className="text-red-500 text-sm">Nome é obrigatório</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataNascimento">Data de nascimento *</Label>
              <Input
                id="dataNascimento"
                type="date"
                {...register("dataNascimento", { required: true })}
                className="h-11 bg-input border-border"
              />
              {errors.dataNascimento && (
                <span className="text-red-500 text-sm">
                  Data de nascimento é obrigatória
                </span>
              )}
            </div>

            <div className="space-y-2 grid grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sexo">Sexo</Label>
                <Select
                  value={sexoSelecionado}
                  onValueChange={(val) => setValue("sexo", val)}
                >
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
                <Select
                  value={estadoCivilSelecionado}
                  onValueChange={(val) => setValue("estadoCivil", val)}
                >
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
              {errors.cpf && (
                <span className="text-red-500 text-sm">CPF é obrigatório</span>
              )}
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

          {/* Contato */}
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
              {errors.email && (
                <span className="text-red-500 text-sm">
                  Email é obrigatório
                </span>
              )}
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

          {/* Endereço */}
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

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="
    bg-green-500 
    text-primary-foreground 
    font-medium 
    px-8 
    h-11 
    shadow-soft 
    cursor-pointer 
    transition-colors 
    duration-300 
    ease-in-out
    hover:bg-green-600
    hover:shadow-md
  "
            >
              Alterar Cliente
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
    </DialogContent>
  );
}
