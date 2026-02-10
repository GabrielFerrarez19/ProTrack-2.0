import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CompanyData } from "./types";

interface StepCompanyDataProps {
  data: CompanyData;
  onUpdate: (field: keyof CompanyData, value: string) => void;
}

export function StepCompanyData({ data, onUpdate }: StepCompanyDataProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Razão Social *</Label>
        <Input
          id="name"
          placeholder="Razão social da empresa"
          value={data.name}
          onChange={(e) => onUpdate("name", e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="trade_name">Nome Fantasia</Label>
        <Input
          id="trade_name"
          placeholder="Nome fantasia"
          value={data.trade_name}
          onChange={(e) => onUpdate("trade_name", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="document_type">Tipo de Documento *</Label>
          <Select
            value={data.document_type}
            onValueChange={(v) => onUpdate("document_type", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CNPJ">CNPJ</SelectItem>
              <SelectItem value="CPF">CPF</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="document">Documento *</Label>
          <Input
            id="document"
            placeholder={
              data.document_type === "CNPJ"
                ? "00.000.000/0000-00"
                : "000.000.000-00"
            }
            value={data.document}
            onChange={(e) => onUpdate("document", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
