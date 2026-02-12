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
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";

import type { ProductRequest, ProductResponse } from "@/@types/product";
import type { ProductCategoryResponse } from "@/@types/product_categories";
import { getProductCategories } from "@/services/product_categories";
import { toast } from "sonner";

const tamanhos = ["PP", "P", "M", "G", "GG", "XG", "Único"];

interface DialogAlterProps {
  setOpen: (value: boolean) => void;
  product: ProductResponse;
  onProductUpdated?: () => void; // Nova prop para callback
}

export function DialogAlter({
  product,
  /*   setOpen,
  onProductUpdated, */
}: DialogAlterProps) {
  const {
    register,
    reset,
    setValue,
    watch,
    /* handleSubmit, */
    formState: { errors },
  } = useForm<ProductRequest>();

  const precoCusto = watch("cost_price");
  const precoVenda = watch("sale_price");

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description || "",
        category_id: product.category_id || "",
        barcode: product.barcode || "",
        quantity: product.quantity ?? 0,
        size: product.size || "",
        cost_price: product.cost_price ?? 0,
        sale_price: product.sale_price ?? 0,
      });
    }
  }, [product, reset]);

  /*   const onSubmit = async (data: ProductRequest) => {
    try {
      const updatedProduct: ProductResponse = {
        id: product.id,
        name: data.name,
        description: data.description,
        category_id: data.category_id,
        barcode: data.barcode,
        quantity: data.quantity,
        size: data.size,
        cost_price: data.cost_price,
        sale_price: data.sale_price,
      };

      setOpen(false);
      toast.success("Produto alterado com sucesso!");
      if (onProductUpdated) onProductUpdated();
    } catch (error: unknown) {
      console.error("Erro ao atualizar produto:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao atualizar produto",
      );
    }
  }; */

  const categoriaSelecionada =
    watch("category_id") || product?.category_id || "";
  const tamanhoSelecionado = watch("size");
  const [categories, setCategories] = useState<ProductCategoryResponse[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getProductCategories();
        setCategories(data);
      } catch (err) {
        console.error("Erro ao buscar categorias", err);
        toast.error("Erro ao carregar categorias");
      } finally {
        setIsLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);

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
        <form /* onSubmit={handleSubmit(onSubmit)} */ className="space-y-6">
          <div className="grid grid-cols-1 md:grid-rows-1 gap-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Produto * </Label>
                <Input
                  id="nome"
                  {...register("name", { required: true })}
                  placeholder="Ex: Camiseta Polo Azul"
                  className="h-11 bg-input border-border"
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">
                    Nome é obrigatório
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="codigoBarras">Código de Barras *</Label>
                <Input
                  id="codigoBarras"
                  {...register("barcode", { required: true })}
                  placeholder="1234567890123"
                  className="h-11 bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade</Label>
                <Input
                  id="quantidade"
                  type="number"
                  {...register("quantity", { valueAsNumber: true })}
                  placeholder="0"
                  min="0"
                  className="h-11 bg-input border-border"
                />
              </div>

              <div className="space-y-2 w-auto">
                <Label htmlFor="tamanho">Tamanho</Label>
                <Select
                  value={tamanhoSelecionado}
                  onValueChange={(val) => setValue("size", val)}
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
                  onValueChange={(val) => setValue("category_id", val)}
                  disabled={isLoadingCategories}
                >
                  <SelectTrigger className="h-11 bg-input border-border">
                    <SelectValue
                      placeholder={
                        isLoadingCategories
                          ? "Carregando..."
                          : "Selecione uma categoria"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {(categories ?? []).map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
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
                  {...register("cost_price", { valueAsNumber: true })}
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
                  {...register("sale_price", { valueAsNumber: true })}
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
              {...register("description")}
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
              onClick={() =>
                product &&
                reset({
                  name: product.name,
                  description: product.description || "",
                  category_id: product.category_id || "",
                  barcode: product.barcode || "",
                  quantity: product.quantity ?? 0,
                  size: product.size || "",
                  cost_price: product.cost_price ?? 0,
                  sale_price: product.sale_price ?? 0,
                })
              }
              className="border-border hover:bg-muted h-11 px-8"
            >
              Desfazer alterações
            </Button>
          </div>
        </form>
      </CardContent>
    </DialogContent>
  );
}
