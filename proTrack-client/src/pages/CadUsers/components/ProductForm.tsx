import { useState } from "react";
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
import { Package, DollarSign, Hash, Ruler } from "lucide-react";

interface ProductFormData {
  nome: string;
  descricao: string;
  categoria: string;
  codigoBarras: string;
  quantidade: number;
  tamanho: string;
  precoCusto: number;
  precoVenda: number;
}

const ProductForm = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    nome: "",
    descricao: "",
    categoria: "",
    codigoBarras: "",
    quantidade: 0,
    tamanho: "",
    precoCusto: 0,
    precoVenda: 0,
  });

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

  const handleInputChange = (
    field: keyof ProductFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset do formulário
    setFormData({
      nome: "",
      descricao: "",
      categoria: "",
      codigoBarras: "",
      quantidade: 0,
      tamanho: "",
      precoCusto: 0,
      precoVenda: 0,
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-elegant border-0 bg-card">
      <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Package className="w-6 h-6" />
          Cadastro de Produtos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome do Produto */}
            <div className="space-y-2">
              <Label
                htmlFor="nome"
                className="text-sm font-medium text-foreground"
              >
                Nome do Produto *
              </Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                placeholder="Ex: Camiseta Polo Azul"
                className="h-11 bg-input border-border focus:ring-2 focus:ring-primary transition-all"
                required
              />
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <Label
                htmlFor="categoria"
                className="text-sm font-medium text-foreground"
              >
                Categoria *
              </Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) => handleInputChange("categoria", value)}
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

            {/* Código de Barras */}
            <div className="space-y-2">
              <Label
                htmlFor="codigoBarras"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <Hash className="w-4 h-4" />
                Código de Barras *
              </Label>
              <Input
                id="codigoBarras"
                value={formData.codigoBarras}
                onChange={(e) =>
                  handleInputChange("codigoBarras", e.target.value)
                }
                placeholder="1234567890123"
                className="h-11 bg-input border-border focus:ring-2 focus:ring-primary transition-all"
                required
              />
            </div>

            {/* Tamanho */}
            <div className="space-y-2">
              <Label
                htmlFor="tamanho"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <Ruler className="w-4 h-4" />
                Tamanho
              </Label>
              <Select
                value={formData.tamanho}
                onValueChange={(value) => handleInputChange("tamanho", value)}
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

            {/* Quantidade */}
            <div className="space-y-2">
              <Label
                htmlFor="quantidade"
                className="text-sm font-medium text-foreground"
              >
                Quantidade em Estoque
              </Label>
              <Input
                id="quantidade"
                type="number"
                value={formData.quantidade}
                onChange={(e) =>
                  handleInputChange("quantidade", parseInt(e.target.value) || 0)
                }
                placeholder="0"
                min="0"
                className="h-11 bg-input border-border focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            {/* Preço de Custo */}
            <div className="space-y-2">
              <Label
                htmlFor="precoCusto"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <DollarSign className="w-4 h-4" />
                Preço de Custo (R$)
              </Label>
              <Input
                id="precoCusto"
                type="number"
                step="0.01"
                value={formData.precoCusto}
                onChange={(e) =>
                  handleInputChange(
                    "precoCusto",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder="0,00"
                min="0"
                className="h-11 bg-input border-border focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            {/* Preço de Venda */}
            <div className="space-y-2">
              <Label
                htmlFor="precoVenda"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <DollarSign className="w-4 h-4" />
                Preço de Venda (R$)
              </Label>
              <Input
                id="precoVenda"
                type="number"
                step="0.01"
                value={formData.precoVenda}
                onChange={(e) =>
                  handleInputChange(
                    "precoVenda",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder="0,00"
                min="0"
                className="h-11 bg-input border-border focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label
              htmlFor="descricao"
              className="text-sm font-medium text-foreground"
            >
              Descrição do Produto
            </Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => handleInputChange("descricao", e.target.value)}
              placeholder="Descreva as características, materiais, cores disponíveis..."
              className="min-h-[100px] bg-input border-border focus:ring-2 focus:ring-primary transition-all resize-none"
            />
          </div>

          {/* Margem de Lucro */}
          {formData.precoCusto > 0 && formData.precoVenda > 0 && (
            <div className="p-4 bg-accent rounded-lg border border-border">
              <div className="text-sm text-accent-foreground">
                <strong>Margem de Lucro:</strong>{" "}
                {(
                  ((formData.precoVenda - formData.precoCusto) /
                    formData.precoCusto) *
                  100
                ).toFixed(1)}
                % (R$ {(formData.precoVenda - formData.precoCusto).toFixed(2)})
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="bg-gradient-primary hover:bg-gradient-secondary text-primary-foreground font-medium px-8 h-11 shadow-soft hover:shadow-elegant transition-all"
            >
              Cadastrar Produto
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setFormData({
                  nome: "",
                  descricao: "",
                  categoria: "",
                  codigoBarras: "",
                  quantidade: 0,
                  tamanho: "",
                  precoCusto: 0,
                  precoVenda: 0,
                })
              }
              className="border-border hover:bg-muted h-11 px-8"
            >
              Limpar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
