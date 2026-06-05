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

import { toast } from "sonner";
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
import type {
  CustomerResponse,
  Gender,
  UpdateCustomerParams,
} from "@/@types/customers";
import type { AccountReceivable } from "@/@types/accountsReceivable";
import {
  GetPendingReceivablesByCustomer,
  GetReceivablesBySale,
} from "@/services/accountsReceivable";
import { CreatePayment } from "@/services/payments";
import { ListPaymentMethodsIsActive } from "@/services/paymentMethods";
import { UpdateCustomer } from "@/services/customers";
import type { PaymentMethodResponse } from "@/@types/paymentMethods";

interface DialogAlterClienteProps {
  setOpen: (value: boolean) => void;
  cliente: CustomerResponse;
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
  } = useForm<UpdateCustomerParams>();

  type VendaParceladaResumo = {
    saleId: string;
    totalParcelado: number;
    totalAberto: number;
    totalParcelas: number;
    primeiraDataVencimento: string | null;
    status: string;
  };

  const [vendasParceladas, setVendasParceladas] = useState<
    VendaParceladaResumo[]
  >([]);
  const [parcelasPorVenda, setParcelasPorVenda] = useState<
    Record<string, AccountReceivable[]>
  >({});
  const [vendaExpandidaId, setVendaExpandidaId] = useState<string | null>(null);
  const [loadingVendas, setLoadingVendas] = useState(false);
  const [metodosPagamento, setMetodosPagamento] = useState<
    PaymentMethodResponse[]
  >([]);
  const [loadingMetodos, setLoadingMetodos] = useState(false);
  const [paymentMethodId, setPaymentMethodId] = useState<string>("");
  const [notesPagamento, setNotesPagamento] = useState<string>("");
  const [submittingPagamento, setSubmittingPagamento] = useState(false);

  // Preenche o formulário com dados do cliente
  useEffect(() => {
    if (cliente) {
      reset({
        full_name: cliente.full_name,
        birth_date: formatarDataParaInput(cliente.birth_date),
        cpf: cliente.cpf,
        rg: cliente.rg || "",
        marital_status: cliente.marital_status || "",
        gender: cliente.gender || "",
        mobile_phone: cliente.mobile_phone || "",
        whatsapp: cliente.whatsapp || "",
        home_phone: cliente.home_phone || "",
        email: cliente.email,
        address_zipcode: cliente.address_zipcode || "",
        address_street: cliente.address_street || "",
        address_number: cliente.address_number || "",
        address_complement: cliente.address_complement || "",
        address_neighborhood: cliente.address_neighborhood || "",
        address_city: cliente.address_city || "",
      });
      setValorAPagar(cliente.balance_due ?? 0); // inicializa valor a pagar
    }
  }, [cliente, reset]);

  useEffect(() => {
    if (!cliente?.id) return;

    const carregarVendasParceladas = async () => {
      try {
        setLoadingVendas(true);
        const contas = await GetPendingReceivablesByCustomer(cliente.id);

        const agrupadoPorVenda = new Map<string, AccountReceivable[]>();

        contas.forEach((conta) => {
          if (!conta.sale_id) return;
          const atual = agrupadoPorVenda.get(conta.sale_id) ?? [];
          agrupadoPorVenda.set(conta.sale_id, [...atual, conta]);
        });

        const resumo: VendaParceladaResumo[] = [];

        agrupadoPorVenda.forEach((parcelas, saleId) => {
          const totalParcelado = parcelas.reduce(
            (acc, p) => acc + (p.total_amount ?? 0),
            0,
          );
          const totalAberto = parcelas.reduce(
            (acc, p) => acc + (p.balance ?? 0),
            0,
          );
          const totalParcelas =
            parcelas[0]?.total_installments ?? parcelas.length;
          const datasOrdenadas = [...parcelas]
            .map((p) => p.due_date)
            .filter(Boolean)
            .sort();
          const primeiraDataVencimento =
            datasOrdenadas.length > 0 ? datasOrdenadas[0] : null;

          let status = "pendente";
          const todosPagos = parcelas.every((p) => p.status === "paid");
          const algumParcial = parcelas.some((p) => p.status === "partial");

          if (todosPagos) status = "pago";
          else if (algumParcial) status = "parcial";

          resumo.push({
            saleId,
            totalParcelado,
            totalAberto,
            totalParcelas,
            primeiraDataVencimento,
            status,
          });
        });

        setVendasParceladas(resumo);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingVendas(false);
      }
    };

    void carregarVendasParceladas();
  }, [cliente]);

  // Carregar métodos de pagamento ativos ao abrir o diálogo
  useEffect(() => {
    const carregarMetodos = async () => {
      try {
        setLoadingMetodos(true);
        const list = await ListPaymentMethodsIsActive();
        setMetodosPagamento(list);
        if (list.length > 0 && !paymentMethodId) {
          setPaymentMethodId(list[0].id);
        }
      } catch (error) {
        console.error(error);
        toast.error("Não foi possível carregar os métodos de pagamento.");
      } finally {
        setLoadingMetodos(false);
      }
    };
    void carregarMetodos();
  }, [paymentMethodId]);

  const sexoSelecionado = watch("gender");
  const estadoCivilSelecionado = watch("marital_status");
  const [valorPago, setValorPago] = useState<number>(0);
  const [valorAPagar, setValorAPagar] = useState<number>(0);
  const [, setTotalRestante] = useState<number>(0); // estado usado apenas para receber valor do resumo

  const [tabelaAberta, setTabelaAberta] = useState<boolean>(false);

  const toggleTabela = () => {
    setTabelaAberta(!tabelaAberta);
  };

  const handleClickVenda = async (saleId: string) => {
    setVendaExpandidaId((prev) => (prev === saleId ? null : saleId));

    if (!parcelasPorVenda[saleId]) {
      try {
        const parcelas = await GetReceivablesBySale(saleId);
        setParcelasPorVenda((prev) => ({
          ...prev,
          [saleId]: parcelas,
        }));
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (cliente) {
      setValorAPagar(cliente.balance_due ?? 0); // pega do cliente
    }
  }, [cliente]);

  const onSubmit = async (data: UpdateCustomerParams) => {
    try {
      await UpdateCustomer(data, cliente.id);
      console.log("Form", cliente);

      toast.success("Cliente atualizado com sucesso!", {
        style: { background: "#4ade80", color: "#065f46" }, // verde pastel
      });
      setOpen(false);
    } catch (error) {
      console.log("Erro ao atualizar cliente", error);
      toast.error("Erro ao atualizar cliente", {
        style: { background: "#f87171", color: "#7f1d1d" },
      });
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

    const saldoDevido = Number(cliente.balance_due ?? 0);
    if (valorPago > saldoDevido) {
      toast.error("O valor informado é maior que o saldo devedor do cliente.");
      return;
    }

    if (!paymentMethodId) {
      toast.error("Selecione a forma de pagamento.");
      return;
    }

    try {
      setSubmittingPagamento(true);
      await CreatePayment({
        customer_id: cliente.id,
        payment_method_id: paymentMethodId,
        amount_paid: valorPago,
        notes: notesPagamento.trim(),
      });
      toast.success("Pagamento registrado com sucesso!");
      setValorPago(0);
      setNotesPagamento("");
      if (onClienteUpdated) onClienteUpdated();
    } catch (error: unknown) {
      const msg =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { error?: string } } }).response
              ?.data?.error
          : null;
      toast.error(msg ?? "Erro ao registrar pagamento. Tente novamente.");
    } finally {
      setSubmittingPagamento(false);
    }
  };

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
        {/* Tabela de Vendas Parceladas */}
        <legend className="text-lg font-medium text-muted-foreground mb-2 col-span-full">
          Vendas parceladas em aberto
        </legend>
        <Table>
          <TableHeader>
            <TableRow
              className="bg-teal-100 hover:bg-teal-100 cursor-pointer"
              onClick={toggleTabela}
            >
              <TableHead>ID Venda</TableHead>
              <TableHead>1º Vencimento</TableHead>
              <TableHead>Total Parcelado</TableHead>
              <TableHead>Saldo em Aberto</TableHead>
              <TableHead>Qtd. Parcelas</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          {tabelaAberta && (
            <TableBody>
              {loadingVendas && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="flex items-center justify-center gap-2 py-2 text-muted-foreground text-sm">
                      <span className="inline-block h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span>Carregando vendas...</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {!loadingVendas && vendasParceladas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    Nenhuma venda parcelada em aberto para este cliente.
                  </TableCell>
                </TableRow>
              )}

              {!loadingVendas &&
                vendasParceladas.map((venda) => {
                  const statusFormatted = formatStatus(
                    venda.status as
                      | "pendente"
                      | "pago"
                      | "cancelado"
                      | "aprazo",
                  );

                  return (
                    <>
                      <TableRow
                        key={venda.saleId}
                        className="hover:bg-gray-200 cursor-pointer"
                        onClick={() => handleClickVenda(venda.saleId)}
                      >
                        <TableCell>{venda.saleId}</TableCell>
                        <TableCell>
                          {venda.primeiraDataVencimento
                            ? new Date(
                                venda.primeiraDataVencimento,
                              ).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          R$ {formatCurrency(venda.totalParcelado)}
                        </TableCell>
                        <TableCell>
                          R$ {formatCurrency(venda.totalAberto)}
                        </TableCell>
                        <TableCell>{venda.totalParcelas}</TableCell>
                        <TableCell>
                          <Badge className={statusFormatted.color}>
                            {statusFormatted.text}
                          </Badge>
                        </TableCell>
                      </TableRow>

                      {vendaExpandidaId === venda.saleId && (
                        <TableRow>
                          <TableCell colSpan={6}>
                            <Table className="mt-2">
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Parcela</TableHead>
                                  <TableHead>Vencimento</TableHead>
                                  <TableHead>Valor</TableHead>
                                  <TableHead>Saldo</TableHead>
                                  <TableHead>Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {(parcelasPorVenda[venda.saleId] ?? []).map(
                                  (parcela) => (
                                    <TableRow key={parcela.id}>
                                      <TableCell>
                                        {parcela.installment_number} /{" "}
                                        {parcela.total_installments}
                                      </TableCell>
                                      <TableCell>
                                        {new Date(
                                          parcela.due_date,
                                        ).toLocaleDateString()}
                                      </TableCell>
                                      <TableCell>
                                        R${" "}
                                        {formatCurrency(parcela.total_amount)}
                                      </TableCell>
                                      <TableCell>
                                        R$ {formatCurrency(parcela.balance)}
                                      </TableCell>
                                      <TableCell>{parcela.status}</TableCell>
                                    </TableRow>
                                  ),
                                )}
                              </TableBody>
                            </Table>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
            </TableBody>
          )}
        </Table>

        {/* Resumo de Vendas e formulário de pagamento */}
        <div className="flex flex-col gap-4">
          <ResumoVendas
            valorAPagar={valorAPagar}
            valorPago={valorPago}
            setValorPago={setValorPago}
            setTotalRestantePai={setTotalRestante} // pega o total restante
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="formaPagamento">Forma de pagamento *</Label>
              <Select
                value={paymentMethodId}
                onValueChange={setPaymentMethodId}
                disabled={loadingMetodos}
              >
                <SelectTrigger id="formaPagamento">
                  <SelectValue placeholder="Selecione a forma de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  {metodosPagamento.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {loadingMetodos && (
                <span className="text-sm text-muted-foreground">
                  Carregando métodos de pagamento...
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="observacoesPagamento">Observações</Label>
              <Input
                id="observacoesPagamento"
                value={notesPagamento}
                onChange={(e) => setNotesPagamento(e.target.value)}
                placeholder="Opcional"
              />
            </div>
          </div>
          <Button
            type="button"
            onClick={onRegistrarPagamento}
            className="bg-blue-500 text-white h-11 px-8 hover:bg-blue-600 cursor-pointer"
            disabled={valorPago <= 0 || !paymentMethodId || submittingPagamento}
          >
            {submittingPagamento ? "Registrando..." : "Registrar Pagamento"}
          </Button>
        </div>
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
              <Input id="nome" {...register("full_name", { required: true })} />
              {errors.full_name && (
                <span className="text-red-500 text-sm">Nome é obrigatório</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataNascimento">Data de nascimento *</Label>
              <Input
                id="dataNascimento"
                type="date"
                {...register("birth_date", { required: true })}
              />
              {errors.birth_date && (
                <span className="text-red-500 text-sm">Data é obrigatória</span>
              )}
            </div>

            <div className="space-y-2 grid grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sexo">Sexo</Label>
                <Select
                  value={sexoSelecionado}
                  onValueChange={(val) => setValue("gender", val as Gender)}
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
                  onValueChange={(val) => setValue("marital_status", val)}
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
              <Input id="telefoneCelular" {...register("mobile_phone")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefoneWhatsapp">Telefone WhatsApp</Label>
              <Input id="telefoneWhatsapp" {...register("whatsapp")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefoneResidencial">Telefone residencial</Label>
              <Input id="telefoneResidencial" {...register("home_phone")} />
            </div>
          </fieldset>

          {/* Endereço */}
          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <legend className="text-lg font-medium text-muted-foreground mb-2 col-span-full">
              Endereço
            </legend>

            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input id="cep" {...register("address_zipcode")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input id="endereco" {...register("address_street")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero">Número</Label>
              <Input id="numero" {...register("address_number")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="complemento">Complemento</Label>
              <Input id="complemento" {...register("address_complement")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input id="bairro" {...register("address_neighborhood")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" {...register("address_city")} />
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
          </div>
        </form>
      </CardContent>
    </DialogContent>
  );
}
