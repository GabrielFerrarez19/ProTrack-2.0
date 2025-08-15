"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductForm = ProductForm;
const react_hook_form_1 = require("react-hook-form");
const button_1 = require("../../../components/ui/button");
const card_1 = require("../../../components/ui/card");
const input_1 = require("../../../components/ui/input");
const label_1 = require("../../../components/ui/label");
const textarea_1 = require("../../../components/ui/textarea");
const select_1 = require("../../../components/ui/select");
const lucide_react_1 = require("lucide-react");
const api_1 = require("../../../services/api");
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
function ProductForm() {
    const { register, handleSubmit, reset, setValue, watch, formState: { errors }, } = (0, react_hook_form_1.useForm)();
    const precoCusto = watch("precoCusto");
    const precoVenda = watch("precoVenda");
    const onSubmit = async (data) => {
        try {
            await (0, api_1.cadastrarProduto)({
                nome: data.nome,
                descricao: data.descricao,
                categoria: data.categoria,
                codigo_barras: data.codigoBarras,
                quantidade: data.quantidade,
                tamanho: data.tamanho,
                preco_custo: data.precoCusto,
                preco_venda: data.precoVenda,
            });
            alert("Produto cadastrado com sucesso!");
            reset(); // limpa o formulário
        }
        catch (err) {
            console.error("Erro ao cadastrar produto:", err);
        }
    };
    return (<card_1.Card className="w-full max-w-4xl mx-auto shadow-elegant border-2 bg-card border-[var(--bluePast-500)] p-0">
      <card_1.CardHeader className=" flex bg-[var(--bluePast-500)] h-20 text-primary-foreground rounded-t-lg items-center">
        <card_1.CardTitle className="flex items-center gap-2 text-2xl">
          <lucide_react_1.Package className="w-6 h-6"/>
          Cadastro de Produtos
        </card_1.CardTitle>
      </card_1.CardHeader>
      <card_1.CardContent className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-rows-1 gap-6">
            <div className="grid grid-cols-3 gap-6">
              {/* Nome do Produto */}
              <div className="space-y-2">
                <label_1.Label htmlFor="nome">Nome do Produto *</label_1.Label>
                <input_1.Input id="nome" {...register("nome", { required: true })} placeholder="Ex: Camiseta Polo Azul" className="h-11 bg-input border-border"/>
                {errors.nome && (<span className="text-red-500 text-sm">
                    Nome é obrigatório
                  </span>)}
              </div>

              {/* Código de Barras */}
              <div className="space-y-2">
                <label_1.Label htmlFor="codigoBarras">Código de Barras *</label_1.Label>
                <input_1.Input id="codigoBarras" {...register("codigoBarras", { required: true })} placeholder="1234567890123" className="h-11 bg-input border-border"/>
              </div>

              {/* Quantidade */}
              <div className="space-y-2">
                <label_1.Label htmlFor="quantidade">Quantidade</label_1.Label>
                <input_1.Input id="quantidade" type="number" {...register("quantidade", { valueAsNumber: true })} placeholder="0" min="0" className="h-11 bg-input border-border"/>
              </div>

              {/* Tamanho */}
              <div className="space-y-2 w-auto">
                <label_1.Label htmlFor="tamanho">Tamanho</label_1.Label>
                <select_1.Select onValueChange={(val) => setValue("tamanho", val)}>
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

              {/* Categoria */}
              <div className="space-y-2">
                <label_1.Label htmlFor="categoria">Categoria *</label_1.Label>
                <select_1.Select onValueChange={(val) => setValue("categoria", val)}>
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
              {/* Preço de Custo */}
              <div className="space-y-2">
                <label_1.Label htmlFor="precoCusto">Preço de Custo (R$)</label_1.Label>
                <input_1.Input id="precoCusto" type="number" step="0.01" {...register("precoCusto", { valueAsNumber: true })} placeholder="0,00" min="0" className="h-11 bg-input border-border"/>
              </div>

              {/* Preço de Venda */}
              <div className="space-y-2">
                <label_1.Label htmlFor="precoVenda">Preço de Venda (R$)</label_1.Label>
                <input_1.Input id="precoVenda" type="number" step="0.01" {...register("precoVenda", { valueAsNumber: true })} placeholder="0,00" min="0" className="h-11 bg-input border-border"/>
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <label_1.Label htmlFor="descricao">Descrição do Produto</label_1.Label>
            <textarea_1.Textarea id="descricao" {...register("descricao")} placeholder="Descreva as características, materiais, cores disponíveis..." className="min-h-[100px] bg-input border-border resize-none"/>
          </div>

          {/* Margem de Lucro */}
          {precoCusto > 0 && precoVenda > 0 && (<div className="p-4 bg-accent rounded-lg border border-border">
              <div className="text-sm text-accent-foreground">
                <strong>Margem de Lucro:</strong>{" "}
                {(((precoVenda - precoCusto) / precoCusto) * 100).toFixed(1)}%
                (R$ {(precoVenda - precoCusto).toFixed(2)})
              </div>
            </div>)}

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <button_1.Button type="submit" className="bg-green-500 cursor-pointer hover:bg-gradient-secondary text-primary-foreground font-medium px-8 h-11 shadow-soft">
              Cadastrar Produto
            </button_1.Button>
            <button_1.Button type="button" variant="outline" onClick={() => reset()} className="border-border hover:bg-muted h-11 px-8">
              Limpar
            </button_1.Button>
          </div>
        </form>
      </card_1.CardContent>
    </card_1.Card>);
}
