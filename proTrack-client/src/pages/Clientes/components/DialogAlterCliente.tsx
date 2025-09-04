import { useEffect, useState } from "react";
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

import { atualizarCliente, fetchAllVendasById } from "../../../services/api";
import { toast } from "sonner";
import type {
  ClienteFormData,
  Cliente,
  VendaResponse,
} from "../../../@types/types.components";
import {
  formatarDataParaInput,
  formatCurrency,
  formatStatus,
} from "../../../utils/functions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { ResumoVendas } from "./ResumoVendas";
import { Badge } from "../../../components/ui/badge";

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

  const [vendasPorCliente, setVendasPorCliente] = useState<
    Record<number, VendaResponse[]>
  >({});

  // Preenche o formulário com dados do cliente
  useEffect(() => {
    if (cliente) {
      reset({
        id: parseInt(cliente.id),
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
      setValorAPagar(cliente.valorAPagar ?? 0); // inicializa valor a pagar
    }
  }, [cliente, reset]);

  // Carrega vendas do cliente
  useEffect(() => {
    const loadVendas = async () => {
      if (!cliente?.id) return;
      try {
        const vendas = await fetchAllVendasById(parseInt(cliente.id));
        setVendasPorCliente({ [parseInt(cliente.id)]: vendas });
        console.log("vendas", vendas);
      } catch (err) {
        console.error(`Erro ao buscar vendas do cliente ${cliente.id}`, err);
        setVendasPorCliente({ [parseInt(cliente.id)]: [] });
      }
    };
    loadVendas();
  }, [cliente]);

  const sexoSelecionado = watch("sexo");
  const estadoCivilSelecionado = watch("estadoCivil");
  const [valorPago, setValorPago] = useState<number>(0);
  const [valorAPagar, setValorAPagar] = useState<number>(0);
  const [totalRestante, setTotalRestante] = useState<number>(0); // novo estado

  const [tabelaAberta, setTabelaAberta] = useState<boolean>(false);

  const toggleTabela = () => {
    setTabelaAberta(!tabelaAberta);
  };

  useEffect(() => {
    if (cliente) {
      setValorAPagar(cliente.valorAPagar ?? 0); // pega do cliente
    }
  }, [cliente]);

  console.log("valor a pagar", cliente.valorAPagar);

  // Envio do formulário
  const onSubmit = async (data: ClienteFormData) => {
    if (!cliente.id) {
      toast.error("ID do cliente ausente!");
      return;
    }

    try {
      await atualizarCliente(parseInt(cliente.id), {
        ...data,
        valorAPagar: totalRestante, // envia valor a pagar atualizado
      });
      toast.success("Cliente alterado com sucesso!");
      reset();
      setOpen(false);
      if (onClienteUpdated) onClienteUpdated();
    } catch (error: unknown) {
      console.error("Erro ao alterar cliente:", error);
      if (typeof error === "object" && error !== null && "error" in error) {
        toast.error((error as { error: string }).error);
      } else {
        toast.error("Erro ao alterar cliente");
      }
    }
  };

  // Função para registrar apenas o pagamento
  const onRegistrarPagamento = async () => {
    if (!cliente.id) {
      toast.error("ID do cliente ausente!");
      return;
    }

    if (valorPago <= 0) {
      toast.error("Valor do pagamento deve ser maior que zero!");
      return;
    }

    try {
      await atualizarCliente(parseInt(cliente.id), {
        id: parseInt(cliente.id),
        nome: cliente.nome,
        dataNascimento: cliente.dataNascimento,
        cpf: cliente.cpf,
        email: cliente.email,
        valorAPagar: totalRestante, // envia valor a pagar atualizado
      });
      toast.success("Pagamento registrado com sucesso!");
      setValorPago(0);
      if (onClienteUpdated) onClienteUpdated();
    } catch (error: unknown) {
      console.error("Erro ao registrar pagamento:", error);
      if (typeof error === "object" && error !== null && "error" in error) {
        toast.error((error as { error: string }).error);
      } else {
        toast.error("Erro ao registrar pagamento");
      }
    }
  };

  console.log();

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
        <DialogTitle className="flex flex-col gap-3">
          Alterar Dados do Cliente
        </DialogTitle>
      </DialogHeader>

      <CardContent className="p-8">
        {/* Tabela de Vendas */}
        <legend className="text-lg font-medium text-muted-foreground mb-2 col-span-full">
          Dados vendas
        </legend>
        <Table>
          <TableHeader>
            <TableRow
              className="bg-teal-100 hover:bg-teal-100 cursor-pointer"
              onClick={toggleTabela}
            >
              <TableHead>ID Venda</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Desconto</TableHead>
              <TableHead>Total c/ Desconto</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          {tabelaAberta && (
            <TableBody>
              {(vendasPorCliente[parseInt(cliente.id)] ?? []).map(
                (venda: VendaResponse) => {
                  const desconto =
                    Number(venda.total ?? 0) -
                    Number(venda.total_com_desconto ?? 0);
                  return (
                    <TableRow
                      key={venda.id}
                      className="hover:bg-gray-200 cursor-pointer"
                    >
                      <TableCell>{venda.id}</TableCell>
                      <TableCell>
                        {new Date(venda.data_venda).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        R$ {formatCurrency(Number(venda.total ?? 0))}
                      </TableCell>
                      <TableCell>R$ {formatCurrency(desconto)}</TableCell>
                      <TableCell>
                        R${" "}
                        {formatCurrency(Number(venda.total_com_desconto ?? 0))}
                      </TableCell>
                      <TableCell>
                        <Badge className={formatStatus(venda.status).color}>
                          {formatStatus(venda.status).text}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          )}
        </Table>

        {/* Resumo de Vendas */}
        <ResumoVendas
          valorAPagar={valorAPagar}
          valorPago={valorPago}
          setValorPago={setValorPago}
          setTotalRestantePai={setTotalRestante} // pega o total restante
        />
      </CardContent>

      {/* Formulário de Cliente */}
      <CardContent className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Dados Pessoais */}
          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <legend className="text-lg font-medium text-muted-foreground mb-2 col-span-full">
              Dados Pessoais
            </legend>

            <div className="space-y-2 col-span-full">
              <Label htmlFor="nome">Nome completo *</Label>
              <Input id="nome" {...register("nome", { required: true })} />
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
              />
              {errors.dataNascimento && (
                <span className="text-red-500 text-sm">Data é obrigatória</span>
              )}
            </div>

            <div className="space-y-2 grid grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sexo">Sexo</Label>
                <Select
                  value={sexoSelecionado}
                  onValueChange={(val) => setValue("sexo", val)}
                >
                  <SelectTrigger>
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
                  <SelectTrigger>
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
              <Input id="cpf" {...register("cpf", { required: true })} />
              {errors.cpf && (
                <span className="text-red-500 text-sm">CPF é obrigatório</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rg">RG</Label>
              <Input id="rg" {...register("rg")} />
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
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  Email é obrigatório
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefoneCelular">Telefone celular</Label>
              <Input id="telefoneCelular" {...register("telefoneCelular")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefoneWhatsapp">Telefone WhatsApp</Label>
              <Input id="telefoneWhatsapp" {...register("telefoneWhatsapp")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefoneResidencial">Telefone residencial</Label>
              <Input
                id="telefoneResidencial"
                {...register("telefoneResidencial")}
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
              <Input id="cep" {...register("cep")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input id="endereco" {...register("endereco")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero">Número</Label>
              <Input id="numero" {...register("numero")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="complemento">Complemento</Label>
              <Input id="complemento" {...register("complemento")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input id="bairro" {...register("bairro")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" {...register("cidade")} />
            </div>
          </fieldset>

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="bg-green-500 text-white h-11 px-8 hover:bg-green-600"
            >
              Alterar Cliente
            </Button>
            <Button
              type="button"
              onClick={onRegistrarPagamento}
              className="bg-blue-500 text-white h-11 px-8 hover:bg-blue-600"
              disabled={valorPago <= 0}
            >
              Registrar Pagamento
            </Button>
          </div>
        </form>
      </CardContent>
    </DialogContent>
  );
}
