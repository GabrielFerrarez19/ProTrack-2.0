import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import type { ContasPagarFormData } from "../../../@types/types.components";

interface FormContasPagarProps {
  formData: ContasPagarFormData;
  handleInputChange: (field: string, value: string) => void;
  categorias: { id: string; nome: string }[];
  formasPagamento: { id: string; name: string }[];
}

export default function FormContasPagar({
  formData,
  handleInputChange,
  categorias,
  formasPagamento,
}: FormContasPagarProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Fornecedor */}
        <div className="space-y-2">
          <Label htmlFor="fornecedor">
            Fornecedor <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fornecedor"
            placeholder="Nome do fornecedor"
            value={formData.fornecedor_nome}
            onChange={(e) =>
              handleInputChange("fornecedor_nome", e.target.value)
            }
            required
          />
        </div>

        {/* Valor */}
        <div className="space-y-2">
          <Label htmlFor="valor">
            Valor <span className="text-destructive">*</span>
          </Label>
          <Input
            id="valor"
            type="number"
            step="0.01"
            placeholder="0,00"
            value={formData.valor}
            onChange={(e) => handleInputChange("valor", e.target.value)}
            required
          />
        </div>

        {/* Data de vencimento */}
        <div className="space-y-2">
          <Label htmlFor="dataVencimento">
            Data de Vencimento <span className="text-destructive">*</span>
          </Label>
          <Input
            id="dataVencimento"
            type="date"
            value={formData.data_vencimento}
            onChange={(e) =>
              handleInputChange("data_vencimento", e.target.value)
            }
            required
          />
        </div>

        {/* Categoria */}
        <div className="space-y-2">
          <Label htmlFor="categoria">
            Categoria <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.categoria_id}
            onValueChange={(value) => handleInputChange("categoria_id", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categorias.map((categoria) => (
                <SelectItem key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Forma de pagamento */}
        <div className="space-y-2">
          <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
          <Select
            value={formData.forma_pagamento}
            onValueChange={(value) => handleInputChange("forma_pagamento", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a forma de pagamento" />
            </SelectTrigger>
            <SelectContent>
              {formasPagamento.map((forma) => (
                <SelectItem key={forma.id} value={forma.id}>
                  {forma.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <Label htmlFor="descricao">
          Descrição <span className="text-destructive">*</span>
        </Label>
        <Input
          id="descricao"
          placeholder="Descrição da conta"
          value={formData.descricao || ""}
          onChange={(e) => handleInputChange("descricao", e.target.value)}
          required
        />
      </div>

      {/* Observações */}
      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          placeholder="Observações adicionais (opcional)"
          value={formData.observacoes || ""}
          onChange={(e) =>
            handleInputChange("observacoes", e.target.value || "")
          }
          rows={3}
        />
      </div>
    </>
  );
}
