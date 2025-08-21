import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Tag, Plus, Edit, Trash2 } from "lucide-react";
import type { Categoria } from "../../../@types/types.components";

interface Props {
  categorias: Categoria[];
}

export function Categorias({ categorias }: Props) {
  const handleAdicionarCategoria = () =>
    console.log("Funcionalidade para adicionar nova categoria.");

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Categorias de Receitas e Despesas
          </CardTitle>
          <Button onClick={handleAdicionarCategoria}>
            <Plus className="h-4 w-4 mr-2" /> Nova Categoria
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-foreground mb-3">Receitas</h4>
            <div className="space-y-2">
              {categorias
                .filter((c) => c.tipo === "receita")
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
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3">Despesas</h4>
            <div className="space-y-2">
              {categorias
                .filter((c) => c.tipo === "despesa")
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
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
