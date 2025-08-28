import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Tag, Plus, Edit, Trash2 } from "lucide-react";
import type { Categoria } from "../../../@types/types.components";
import { CategoriaDialog } from "./CategoriaDialog";

interface Props {
  categorias: Categoria[];
  onAddCategoria: (nova: Categoria) => void;
  onUpdateCategoria: (categoria: Categoria) => void;
  onDeleteCategoria: (id: string) => void; // agora string
}

export function Categorias({
  categorias,
  onAddCategoria,
  onUpdateCategoria,
  onDeleteCategoria,
}: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoriaEdit, setCategoriaEdit] = useState<Categoria | null>(null);

  console.log("categoria", categorias);

  const handleAdicionarCategoria = () => {
    setCategoriaEdit(null);
    setDialogOpen(true);
  };

  const handleEditar = (categoria: Categoria) => {
    setCategoriaEdit(categoria);
    setDialogOpen(true);
  };

  const handleSalvar = (categoria: Categoria) => {
    if (categoriaEdit) {
      onUpdateCategoria(categoria);
    } else {
      onAddCategoria(categoria);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Categorias de Receitas e Despesas
            </CardTitle>
            <Button
              onClick={handleAdicionarCategoria}
              className="cursor-pointer bg-gradient-to-r from-[#628DFD] to-[#6F31FF] text-white font-semibold hover:from-[#7A9BFD] hover:to-[#B597F9]"
            >
              <Plus className="h-4 w-4 mr-2" /> Nova Categoria
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["receita", "despesa"].map((tipoCategoria) => (
              <div key={tipoCategoria}>
                <h4 className="font-semibold text-foreground mb-3">
                  {tipoCategoria === "receita" ? "Receitas" : "Despesas"}
                </h4>
                <div className="space-y-2">
                  {categorias
                    .filter((c) => c.tipo === tipoCategoria)
                    .map((categoria) => (
                      <div
                        key={categoria.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: categoria.cor }}
                          />
                          <span className="font-medium">{categoria.nome}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditar(categoria)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDeleteCategoria(categoria.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <CategoriaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSalvar}
        categoriaEdit={categoriaEdit}
      />
    </>
  );
}
