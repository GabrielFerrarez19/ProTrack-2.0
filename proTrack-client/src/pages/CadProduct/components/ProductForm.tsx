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
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Package } from "lucide-react";
import type { ProductFormData } from "../../../@types/types.components";

// Sonner Toast
import { toast } from "sonner";

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

export function ProductForm() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>();

  const precoCusto = watch("precoCusto");
  const precoVenda = watch("precoVenda");

  const onSubmit = async (data: ProductFormData) => {
    try {
      toast.success("Produto cadastrado com sucesso!", {
        style: { background: "#4ade80", color: "#065f46" }, // verde pastel
      });

      reset(); // limpa o formulário
    } catch (err) {
      console.error("Erro ao cadastrar produto:", err);
      toast.error("Erro ao cadastrar produto. Verifique os dados!", {
        style: { background: "#f87171", color: "#7f1d1d" }, // vermelho pastel
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-elegant border-2 bg-card border-[var(--bluePast-500)] p-0">
      <CardHeader className=" flex bg-[var(--bluePast-500)] h-20 text-primary-foreground rounded-t-lg items-center">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Package className="w-6 h-6" />
          Cadastro de Produtos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-rows-1 gap-6">
            <div className="grid grid-cols-3 gap-6">
              {/* Nome do Produto */}
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Produto *</Label>
                <Input
                  id="nome"
                  {...register("nome", { required: true })}
                  placeholder="Ex: Camiseta Polo Azul"
                  className="h-11 bg-input border-border"
                />
                {errors.nome && (
                  <span className="text-red-500 text-sm">
                    Nome é obrigatório
                  </span>
                )}
              </div>

              {/* Código de Barras */}
              <div className="space-y-2">
                <Label htmlFor="codigoBarras">Código de Barras *</Label>
                <Input
                  id="codigoBarras"
                  {...register("codigoBarras", { required: true })}
                  placeholder="1234567890123"
                  className="h-11 bg-input border-border"
                />
              </div>

              {/* Quantidade */}
              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade</Label>
                <Input
                  id="quantidade"
                  type="number"
                  {...register("quantidade", { valueAsNumber: true })}
                  placeholder="0"
                  min="0"
                  className="h-11 bg-input border-border"
                />
              </div>

              {/* Tamanho */}
              <div className="space-y-2 w-auto">
                <Label htmlFor="tamanho">Tamanho</Label>
                <Select onValueChange={(val) => setValue("tamanho", val)}>
                  <SelectTrigger className="h-11 bg-input border-border">
                    <SelectValue placeholder="Selecione o tamanho" />
                  </SelectTrigger>
                  <SelectContent>
                    {tamanhos.map((tamanho) => (
                      <SelectItem key={tamanho} value={tamanho}>
                        {tamanho}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Categoria */}
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria *</Label>
                <Select onValueChange={(val) => setValue("categoria", val)}>
                  <SelectTrigger className="h-11 bg-input border-border">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {/* Preço de Custo */}
              <div className="space-y-2">
                <Label htmlFor="precoCusto">Preço de Custo (R$)</Label>
                <Input
                  id="precoCusto"
                  type="number"
                  step="0.01"
                  {...register("precoCusto", { valueAsNumber: true })}
                  placeholder="0,00"
                  min="0"
                  className="h-11 bg-input border-border"
                />
              </div>

              {/* Preço de Venda */}
              <div className="space-y-2">
                <Label htmlFor="precoVenda">Preço de Venda (R$)</Label>
                <Input
                  id="precoVenda"
                  type="number"
                  step="0.01"
                  {...register("precoVenda", { valueAsNumber: true })}
                  placeholder="0,00"
                  min="0"
                  className="h-11 bg-input border-border"
                />
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição do Produto</Label>
            <Textarea
              id="descricao"
              {...register("descricao")}
              placeholder="Descreva as características, materiais, cores disponíveis..."
              className="min-h-[100px] bg-input border-border resize-none"
            />
          </div>

          {/* Margem de Lucro */}
          {precoCusto > 0 && precoVenda > 0 && (
            <div className="p-4 bg-accent rounded-lg border border-border">
              <div className="text-sm text-accent-foreground">
                <strong>Margem de Lucro:</strong>{" "}
                {(((precoVenda - precoCusto) / precoCusto) * 100).toFixed(1)}%
                (R$ {(precoVenda - precoCusto).toFixed(2)})
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="cursor-pointer text-primary-foreground font-medium px-8 h-11 shadow-soft bg-gradient-to-r from-[#628DFD] to-[#6F31FF] hover:from-[#7A9BFD] hover:to-[#B597F9]"
            >
              Cadastrar Produto
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
