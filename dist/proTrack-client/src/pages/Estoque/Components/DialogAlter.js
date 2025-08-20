"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogAlter = DialogAlter;
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const dialog_1 = require("../../../components/ui/dialog");
const card_1 = require("../../../components/ui/card");
const input_1 = require("../../../components/ui/input");
const button_1 = require("../../../components/ui/button");
const textarea_1 = require("../../../components/ui/textarea");
const react_label_1 = require("@radix-ui/react-label");
const select_1 = require("../../../components/ui/select");
const api_1 = require("../../../services/api"); // ajuste o caminho se necessário
const categorias = [
    "Roupas",
    "Calçados",
    "Acessórios",
    "Eletrônicos",
    "Casa e Decoração",
    "Esportes",
    "Beleza",
    "Livros",
];
const tamanhos = ["PP", "P", "M", "G", "GG", "XG", "Único"];
function DialogAlter({ product, setOpen, onProductUpdated, }) {
    const { register, reset, setValue, watch, handleSubmit, formState: { errors }, } = (0, react_hook_form_1.useForm)();
    const precoCusto = watch("precoCusto");
    const precoVenda = watch("precoVenda");
    (0, react_1.useEffect)(() => {
        if (product) {
            reset({
                nome: product.nome,
                descricao: product.descricao || "",
                categoria: product.categoria || "",
                codigoBarras: product.codigo_barras || "",
                quantidade: product.quantidade ?? 0,
                tamanho: product.tamanho || "",
                precoCusto: product.preco_custo ?? 0,
                precoVenda: product.preco_venda ?? 0,
            });
        }
    }, [product, reset]);
    const onSubmit = async (data) => {
        try {
            const updatedProduct = {
                id: product.id,
                nome: data.nome,
                descricao: data.descricao,
                categoria: data.categoria,
                codigo_barras: data.codigoBarras,
                quantidade: data.quantidade,
                tamanho: data.tamanho,
                preco_custo: data.precoCusto,
                preco_venda: data.precoVenda,
            };
            await (0, api_1.atualizarProduto)(updatedProduct);
            setOpen(false);
            // Chama o callback para atualizar os dados da tabela
            alert("Cliente alterado com sucesso!");
            if (onProductUpdated) {
                onProductUpdated();
            }
        }
        catch (error) {
            console.error("Erro ao atualizar produto:", error);
            alert(error instanceof Error ? error.message : "Erro ao atualizar produto");
        }
    };
    const categoriaSelecionada = watch("categoria");
    const tamanhoSelecionado = watch("tamanho");
    return (<dialog_1.DialogContent style={{
            width: "900px",
            maxWidth: "none",
            height: "80vh",
            overflowY: "auto",
        }}>
      <dialog_1.DialogHeader>
        <dialog_1.DialogTitle>Dados do Produto</dialog_1.DialogTitle>
      </dialog_1.DialogHeader>

      <card_1.CardContent className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-rows-1 gap-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <react_label_1.Label htmlFor="nome">Nome do Produto * </react_label_1.Label>
                <input_1.Input id="nome" {...register("nome", { required: true })} placeholder="Ex: Camiseta Polo Azul" className="h-11 bg-input border-border"/>
                {errors.nome && (<span className="text-red-500 text-sm">
                    Nome é obrigatório
                  </span>)}
              </div>

              <div className="space-y-2">
                <react_label_1.Label htmlFor="codigoBarras">Código de Barras *</react_label_1.Label>
                <input_1.Input id="codigoBarras" {...register("codigoBarras", { required: true })} placeholder="1234567890123" className="h-11 bg-input border-border"/>
              </div>

              <div className="space-y-2">
                <react_label_1.Label htmlFor="quantidade">Quantidade</react_label_1.Label>
                <input_1.Input id="quantidade" type="number" {...register("quantidade", { valueAsNumber: true })} placeholder="0" min="0" className="h-11 bg-input border-border"/>
              </div>

              <div className="space-y-2 w-auto">
                <react_label_1.Label htmlFor="tamanho">Tamanho</react_label_1.Label>
                <select_1.Select value={tamanhoSelecionado} onValueChange={(val) => setValue("tamanho", val)}>
                  <select_1.SelectTrigger className="h-11 bg-input border-border">
                    <select_1.SelectValue placeholder="Selecione o tamanho"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    {tamanhos.map((tamanho) => (<select_1.SelectItem key={tamanho} value={tamanho}>
                        {tamanho}
                      </select_1.SelectItem>))}
                  </select_1.SelectContent>
                </select_1.Select>
              </div>

              <div className="space-y-2">
                <react_label_1.Label htmlFor="categoria">Categoria *</react_label_1.Label>
                <select_1.Select value={categoriaSelecionada} onValueChange={(val) => setValue("categoria", val)}>
                  <select_1.SelectTrigger className="h-11 bg-input border-border">
                    <select_1.SelectValue placeholder="Selecione uma categoria"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    {categorias.map((categoria) => (<select_1.SelectItem key={categoria} value={categoria}>
                        {categoria}
                      </select_1.SelectItem>))}
                  </select_1.SelectContent>
                </select_1.Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <react_label_1.Label htmlFor="precoCusto">Preço de Custo (R$)</react_label_1.Label>
                <input_1.Input id="precoCusto" type="number" step="0.01" {...register("precoCusto", { valueAsNumber: true })} placeholder="0,00" min="0" className="h-11 bg-input border-border"/>
              </div>

              <div className="space-y-2">
                <react_label_1.Label htmlFor="precoVenda">Preço de Venda (R$)</react_label_1.Label>
                <input_1.Input id="precoVenda" type="number" step="0.01" {...register("precoVenda", { valueAsNumber: true })} placeholder="0,00" min="0" className="h-11 bg-input border-border"/>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <react_label_1.Label htmlFor="descricao">Descrição do Produto</react_label_1.Label>
            <textarea_1.Textarea id="descricao" {...register("descricao")} placeholder="Descreva as características, materiais, cores disponíveis..." className="min-h-[100px] bg-input border-border resize-none"/>
          </div>

          {precoCusto > 0 && precoVenda > 0 && (<div className="p-4 bg-accent rounded-lg border border-border">
              <div className="text-sm text-accent-foreground">
                <strong>Margem de Lucro:</strong>{" "}
                {(((precoVenda - precoCusto) / precoCusto) * 100).toFixed(1)}%
                (R$ {(precoVenda - precoCusto).toFixed(2)})
              </div>
            </div>)}

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
              Alterar produto
            </button_1.Button>
            <button_1.Button type="button" variant="outline" onClick={() => reset()} className="border-border hover:bg-muted h-11 px-8">
              Limpar
            </button_1.Button>
          </div>
        </form>
      </card_1.CardContent>
    </dialog_1.DialogContent>);
}
