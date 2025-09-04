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
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";

import type {
  ProductFormData,
  Product,
} from "../../../@types/types.components";
import { atualizarProduto } from "../../../services/api"; // ajuste o caminho se necessário
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

interface DialogAlterProps {
  setOpen: (value: boolean) => void;
  product: Product;
  onProductUpdated?: () => void; // Nova prop para callback
}

export function DialogAlter({
  product,
  setOpen,
  onProductUpdated,
}: DialogAlterProps) {
  const {
    register,
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>();

  const precoCusto = watch("precoCusto");
  const precoVenda = watch("precoVenda");

  useEffect(() => {
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

  const onSubmit = async (data: ProductFormData) => {
    try {
      const updatedProduct: Product = {
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

      await atualizarProduto(updatedProduct);
      setOpen(false);
      // Chama o callback para atualizar os dados da tabela
      toast.success("Produto alterado com sucesso!");
      if (onProductUpdated) {
        onProductUpdated();
      }
    } catch (error: unknown) {
      console.error("Erro ao atualizar produto:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao atualizar produto"
      );
    }
  };

  const categoriaSelecionada = watch("categoria");
  const tamanhoSelecionado = watch("tamanho");

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
        <DialogTitle>Dados do Produto</DialogTitle>
      </DialogHeader>

      <CardContent className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-rows-1 gap-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Produto * </Label>
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

              <div className="space-y-2">
                <Label htmlFor="codigoBarras">Código de Barras *</Label>
                <Input
                  id="codigoBarras"
                  {...register("codigoBarras", { required: true })}
                  placeholder="1234567890123"
                  className="h-11 bg-input border-border"
                />
              </div>

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

              <div className="space-y-2 w-auto">
                <Label htmlFor="tamanho">Tamanho</Label>
                <Select
                  value={tamanhoSelecionado}
                  onValueChange={(val) => setValue("tamanho", val)}
                >
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

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria *</Label>
                <Select
                  value={categoriaSelecionada}
                  onValueChange={(val) => setValue("categoria", val)}
                >
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

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição do Produto</Label>
            <Textarea
              id="descricao"
              {...register("descricao")}
              placeholder="Descreva as características, materiais, cores disponíveis..."
              className="min-h-[100px] bg-input border-border resize-none"
            />
          </div>

          {precoCusto > 0 && precoVenda > 0 && (
            <div className="p-4 bg-accent rounded-lg border border-border">
              <div className="text-sm text-accent-foreground">
                <strong>Margem de Lucro:</strong>{" "}
                {(((precoVenda - precoCusto) / precoCusto) * 100).toFixed(1)}%
                (R$ {(precoVenda - precoCusto).toFixed(2)})
              </div>
            </div>
          )}

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
              Alterar produto
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
