"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogAlterCliente = DialogAlterCliente;
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const dialog_1 = require("../../../components/ui/dialog");
const card_1 = require("../../../components/ui/card");
const input_1 = require("../../../components/ui/input");
const button_1 = require("../../../components/ui/button");
const label_1 = require("../../../components/ui/label");
const select_1 = require("../../../components/ui/select");
const api_1 = require("../../../services/api");
const functions_1 = require("../../../utils/functions");
function DialogAlterCliente({ setOpen, cliente, onClienteUpdated, }) {
    const { register, handleSubmit, reset, setValue, watch, formState: { errors }, } = (0, react_hook_form_1.useForm)();
    // Preenche o formulário com dados do cliente
    (0, react_1.useEffect)(() => {
        if (cliente) {
            reset({
                id: cliente.id,
                nome: cliente.nome,
                dataNascimento: (0, functions_1.formatarDataParaInput)(cliente.dataNascimento),
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
    const onSubmit = async (data) => {
        if (!cliente.id) {
            alert("ID do cliente ausente!");
            return;
        }
        console.log("id_cliente", cliente.id);
        try {
            console.log("Dados enviados para atualização:", data, "ID:", cliente.id);
            await (0, api_1.atualizarCliente)(cliente.id, data);
            alert("Cliente alterado com sucesso!");
            reset();
            setOpen(false);
            if (onClienteUpdated)
                onClienteUpdated();
        }
        catch (error) {
            console.error("Erro ao alterar cliente:", error);
            // Checa se 'error' é um objeto com a propriedade 'error'
            if (typeof error === "object" && error !== null && "error" in error) {
                // Aqui o TS entende que error é do tipo { error: unknown }
                alert(error.error);
            }
            else {
                alert("Erro ao alterar cliente");
            }
        }
    };
    const sexoSelecionado = watch("sexo");
    const estadoCivilSelecionado = watch("estadoCivil");
    return (<dialog_1.DialogContent style={{
            width: "900px",
            maxWidth: "none",
            height: "80vh",
            overflowY: "auto",
        }}>
      <dialog_1.DialogHeader>
        <dialog_1.DialogTitle>Alterar Dados do Cliente</dialog_1.DialogTitle>
      </dialog_1.DialogHeader>

      <card_1.CardContent className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Dados Pessoais */}
          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <legend className="text-lg font-medium text-muted-foreground mb-2 col-span-full">
              Dados Pessoais
            </legend>

            <div className="space-y-2 col-span-full">
              <label_1.Label htmlFor="nome">Nome completo *</label_1.Label>
              <input_1.Input id="nome" {...register("nome", { required: true })} placeholder="Ex: João da Silva" className="h-11 bg-input border-border"/>
              {errors.nome && (<span className="text-red-500 text-sm">Nome é obrigatório</span>)}
            </div>

            <div className="space-y-2">
              <label_1.Label htmlFor="dataNascimento">Data de nascimento *</label_1.Label>
              <input_1.Input id="dataNascimento" type="date" {...register("dataNascimento", { required: true })} className="h-11 bg-input border-border"/>
              {errors.dataNascimento && (<span className="text-red-500 text-sm">
                  Data de nascimento é obrigatória
                </span>)}
            </div>

            <div className="space-y-2 grid grid-cols-2">
              <div className="space-y-2">
                <label_1.Label htmlFor="sexo">Sexo</label_1.Label>
                <select_1.Select value={sexoSelecionado} onValueChange={(val) => setValue("sexo", val)}>
                  <select_1.SelectTrigger className="h-11 bg-input border-border">
                    <select_1.SelectValue placeholder="Selecione"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    <select_1.SelectItem value="Masculino">Masculino</select_1.SelectItem>
                    <select_1.SelectItem value="Feminino">Feminino</select_1.SelectItem>
                    <select_1.SelectItem value="Outro">Outro</select_1.SelectItem>
                  </select_1.SelectContent>
                </select_1.Select>
              </div>
              <div className="space-y-2">
                <label_1.Label htmlFor="estadoCivil">Estado civil</label_1.Label>
                <select_1.Select value={estadoCivilSelecionado} onValueChange={(val) => setValue("estadoCivil", val)}>
                  <select_1.SelectTrigger className="h-11 bg-input border-border">
                    <select_1.SelectValue placeholder="Selecione"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    <select_1.SelectItem value="Solteiro(a)">Solteiro(a)</select_1.SelectItem>
                    <select_1.SelectItem value="Casado(a)">Casado(a)</select_1.SelectItem>
                    <select_1.SelectItem value="Divorciado(a)">Divorciado(a)</select_1.SelectItem>
                    <select_1.SelectItem value="Viúvo(a)">Viúvo(a)</select_1.SelectItem>
                  </select_1.SelectContent>
                </select_1.Select>
              </div>
            </div>

            <div className="space-y-2">
              <label_1.Label htmlFor="cpf">CPF *</label_1.Label>
              <input_1.Input id="cpf" {...register("cpf", { required: true })} placeholder="000.000.000-00" className="h-11 bg-input border-border"/>
              {errors.cpf && (<span className="text-red-500 text-sm">CPF é obrigatório</span>)}
            </div>

            <div className="space-y-2">
              <label_1.Label htmlFor="rg">RG</label_1.Label>
              <input_1.Input id="rg" {...register("rg")} placeholder="12.345.678-9" className="h-11 bg-input border-border"/>
            </div>
          </fieldset>

          {/* Contato */}
          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <legend className="text-lg font-medium text-muted-foreground mb-2 col-span-full">
              Contato
            </legend>

            <div className="space-y-2 col-span-full">
              <label_1.Label htmlFor="email">Email *</label_1.Label>
              <input_1.Input id="email" type="email" {...register("email", { required: true })} placeholder="joao@email.com" className="h-11 bg-input border-border"/>
              {errors.email && (<span className="text-red-500 text-sm">
                  Email é obrigatório
                </span>)}
            </div>

            <div className="space-y-2">
              <label_1.Label htmlFor="telefoneCelular">Telefone celular</label_1.Label>
              <input_1.Input id="telefoneCelular" {...register("telefoneCelular")} placeholder="(11) 91234-5678" className="h-11 bg-input border-border"/>
            </div>

            <div className="space-y-2">
              <label_1.Label htmlFor="telefoneWhatsapp">Telefone WhatsApp</label_1.Label>
              <input_1.Input id="telefoneWhatsapp" {...register("telefoneWhatsapp")} placeholder="(11) 97654-3210" className="h-11 bg-input border-border"/>
            </div>

            <div className="space-y-2">
              <label_1.Label htmlFor="telefoneResidencial">Telefone residencial</label_1.Label>
              <input_1.Input id="telefoneResidencial" {...register("telefoneResidencial")} placeholder="(11) 3456-7890" className="h-11 bg-input border-border"/>
            </div>
          </fieldset>

          {/* Endereço */}
          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <legend className="text-lg font-medium text-muted-foreground mb-2 col-span-full">
              Endereço
            </legend>

            <div className="space-y-2">
              <label_1.Label htmlFor="cep">CEP</label_1.Label>
              <input_1.Input id="cep" {...register("cep")} placeholder="00000-000" className="h-11 bg-input border-border"/>
            </div>

            <div className="space-y-2">
              <label_1.Label htmlFor="endereco">Endereço</label_1.Label>
              <input_1.Input id="endereco" {...register("endereco")} placeholder="Rua Exemplo" className="h-11 bg-input border-border"/>
            </div>

            <div className="space-y-2">
              <label_1.Label htmlFor="numero">Número</label_1.Label>
              <input_1.Input id="numero" {...register("numero")} placeholder="123" className="h-11 bg-input border-border"/>
            </div>

            <div className="space-y-2">
              <label_1.Label htmlFor="complemento">Complemento</label_1.Label>
              <input_1.Input id="complemento" {...register("complemento")} placeholder="Casa / Apto / Bloco" className="h-11 bg-input border-border"/>
            </div>

            <div className="space-y-2">
              <label_1.Label htmlFor="bairro">Bairro</label_1.Label>
              <input_1.Input id="bairro" {...register("bairro")} placeholder="Centro" className="h-11 bg-input border-border"/>
            </div>

            <div className="space-y-2">
              <label_1.Label htmlFor="cidade">Cidade</label_1.Label>
              <input_1.Input id="cidade" {...register("cidade")} placeholder="São Paulo" className="h-11 bg-input border-border"/>
            </div>
          </fieldset>

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <button_1.Button type="submit" className="
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
  ">
              Alterar Cliente
            </button_1.Button>
            <button_1.Button type="button" variant="outline" onClick={() => reset()} className="border-border hover:bg-muted h-11 px-8">
              Limpar
            </button_1.Button>
          </div>
        </form>
      </card_1.CardContent>
    </dialog_1.DialogContent>);
}
