import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CompanyData } from "./types";

interface StepContactProps {
  data: CompanyData;
  onUpdate: (field: keyof CompanyData, value: string) => void;
}

export function StepContact({ data, onUpdate }: StepContactProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">E-mail *</Label>
        <Input
          id="email"
          type="email"
          placeholder="empresa@email.com"
          value={data.email}
          onChange={(e) => onUpdate("email", e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Telefone *</Label>
        <Input
          id="phone"
          placeholder="(00) 00000-0000"
          value={data.phone}
          onChange={(e) => onUpdate("phone", e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          placeholder="https://www.empresa.com.br"
          value={data.website}
          onChange={(e) => onUpdate("website", e.target.value)}
        />
      </div>
    </div>
  );
}
