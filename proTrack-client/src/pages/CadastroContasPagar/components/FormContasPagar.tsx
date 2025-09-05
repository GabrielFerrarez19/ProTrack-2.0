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
  categorias: string[];
  statusOptions: string[];
  formasPagamento: string[];
}

export default function FormContasPagar({
  formData,
  handleInputChange,
  categorias,
  statusOptions,
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
                <SelectItem key={categoria} value={categoria}>
                  {categoria}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">
            Status <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.status.toLowerCase()}
            onValueChange={(value) => handleInputChange("status", value)}
            required
            disabled
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Data de agendamento */}
        <div className="space-y-2">
          <Label htmlFor="dataAgendamento">Data de Agendamento</Label>
          <Input
            id="dataAgendamento"
            type="date"
            value={formData.data_agendamento}
            onChange={(e) =>
              handleInputChange("data_agendamento", e.target.value)
            }
          />
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
