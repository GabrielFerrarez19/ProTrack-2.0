import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import type { Categoria } from "../../../@types/types.components";

interface CategoriaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (categoria: Categoria) => void;
  categoriaEdit?: Categoria | null;
}

export function CategoriaDialog({
  open,
  onOpenChange,
  onSave,
  categoriaEdit,
}: CategoriaDialogProps) {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<"receita" | "despesa">("receita");
  const [cor, setCor] = useState("#000000");

  useEffect(() => {
    if (categoriaEdit) {
      setNome(categoriaEdit.nome);
      setTipo(categoriaEdit.tipo);
      setCor(categoriaEdit.cor);
    } else {
      setNome("");
      setTipo("receita");
      setCor("#000000");
    }
  }, [categoriaEdit]);

  const handleSalvar = () => {
    const novaCategoria: Categoria = categoriaEdit
      ? { ...categoriaEdit, nome, tipo, cor }
      : { id: crypto.randomUUID(), nome, tipo, cor }; // gera um id string único

    onSave(novaCategoria);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {categoriaEdit ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              value={tipo}
              onValueChange={(v) => setTipo(v as "receita" | "despesa")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="receita">Receita</SelectItem>
                <SelectItem value="despesa">Despesa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Cor</Label>
            <Input
              className="w-30"
              type="color"
              value={cor}
              onChange={(e) => setCor(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancelar
          </Button>
          <Button onClick={handleSalvar}>
            {categoriaEdit ? "Salvar Alterações" : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
