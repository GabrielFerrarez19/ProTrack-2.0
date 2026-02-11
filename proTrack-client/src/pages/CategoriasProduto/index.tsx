import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Plus, Package, Edit, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Header } from "../../components/header";
import {
  getProductCategories,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
} from "../../services/product_categories";
import type { ProductCategoryResponse } from "@/@types/product_categories";

export function CategoriasProduto() {
  const [categoriasProduto, setCategoriasProduto] = useState<
    ProductCategoryResponse[]
  >([]);
  const [novaCatProduto, setNovaCatProduto] = useState({
    name: "",
    color: "#6366f1",
  });
  const [editandoCatProduto, setEditandoCatProduto] = useState<string | null>(
    null,
  );
  const [editCatProdutoData, setEditCatProdutoData] = useState({
    name: "",
    color: "#6366f1",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategorias = async () => {
    try {
      setIsLoading(true);
      const categorias = await getProductCategories();
      setCategoriasProduto(categorias);
    } catch {
      toast.error("Erro ao carregar categorias de produto");
      setCategoriasProduto([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleAdicionarCatProduto = async () => {
    const nomeTrimmed = novaCatProduto.name.trim();
    if (!nomeTrimmed) {
      toast.error("Informe o nome da categoria");
      return;
    }

    try {
      setIsSubmitting(true);
      const nova = await createProductCategory({
        name: nomeTrimmed,
        color: novaCatProduto.color,
      });
      setCategoriasProduto((prev) => [...prev, nova]);
      setNovaCatProduto({ name: "", color: "#6366f1" });
      toast.success("Categoria adicionada com sucesso");
    } catch {
      toast.error("Erro ao adicionar categoria");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditarCatProduto = (cat: ProductCategoryResponse) => {
    setEditandoCatProduto(cat.id);
    setEditCatProdutoData({ name: cat.name, color: cat.color || "#6366f1" });
  };

  const handleSalvarEditCatProduto = async (id: string) => {
    const nomeTrimmed = editCatProdutoData.name.trim();
    if (!nomeTrimmed) {
      toast.error("Informe o nome da categoria");
      return;
    }

    try {
      setIsSubmitting(true);
      const atualizada = await updateProductCategory(id, {
        name: nomeTrimmed,
        color: editCatProdutoData.color,
      });
      setCategoriasProduto((prev) =>
        prev.map((c) => (c.id === id ? atualizada : c)),
      );
      setEditandoCatProduto(null);
      toast.success("Categoria atualizada com sucesso");
    } catch {
      toast.error("Erro ao atualizar categoria");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExcluirCatProduto = async (id: string) => {
    if (!window.confirm("Deseja excluir esta categoria?")) return;

    try {
      setIsSubmitting(true);
      await deleteProductCategory(id);
      setCategoriasProduto((prev) => prev.filter((c) => c.id !== id));
      toast.success("Categoria excluída com sucesso");
    } catch {
      toast.error("Erro ao excluir categoria");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Categorias de Produto"
        text="Cadastre e gerencie as categorias dos seus produtos"
      />

      {/* Adicionar nova categoria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nova Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end flex-wrap">
            <div className="flex-1 min-w-[200px] space-y-2">
              <Label>Nome</Label>
              <Input
                placeholder="Ex: Vestimenta, Calçados..."
                value={novaCatProduto.name}
                onChange={(e) =>
                  setNovaCatProduto((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={novaCatProduto.color}
                  onChange={(e) =>
                    setNovaCatProduto((prev) => ({
                      ...prev,
                      color: e.target.value,
                    }))
                  }
                  className="w-10 h-10 rounded-md border border-border cursor-pointer"
                />
              </div>
            </div>
            <Button onClick={handleAdicionarCatProduto} disabled={isSubmitting}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de categorias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Categorias Cadastradas ({categoriasProduto.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">
              Carregando categorias...
            </p>
          ) : categoriasProduto.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma categoria cadastrada. Adicione a primeira acima.
            </p>
          ) : (
            <div className="space-y-3">
              {categoriasProduto.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  {editandoCatProduto === cat.id ? (
                    <div className="flex items-center gap-3 flex-1 mr-4">
                      <input
                        type="color"
                        value={editCatProdutoData.color}
                        onChange={(e) =>
                          setEditCatProdutoData((prev) => ({
                            ...prev,
                            color: e.target.value,
                          }))
                        }
                        className="w-8 h-8 rounded-md border border-border cursor-pointer"
                      />
                      <Input
                        value={editCatProdutoData.name}
                        onChange={(e) =>
                          setEditCatProdutoData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="flex-1"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full border border-border shrink-0"
                        style={{ backgroundColor: cat.color || "#6366f1" }}
                      />
                      <span className="font-medium text-foreground">
                        {cat.name}
                      </span>
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor: (cat.color || "#6366f1") + "20",
                          color: cat.color || "#6366f1",
                          borderColor: cat.color || "#6366f1",
                        }}
                      >
                        {cat.name}
                      </Badge>
                    </div>
                  )}
                  <div className="flex gap-2 shrink-0">
                    {editandoCatProduto === cat.id ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSalvarEditCatProduto(cat.id)}
                          disabled={isSubmitting}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditandoCatProduto(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditarCatProduto(cat)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleExcluirCatProduto(cat.id)}
                          disabled={isSubmitting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
