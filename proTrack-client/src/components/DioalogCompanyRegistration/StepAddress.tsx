import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CompanyData } from "./types";

interface StepAddressProps {
  data: CompanyData;
  onUpdate: (field: keyof CompanyData, value: string) => void;
}

export function StepAddress({ data, onUpdate }: StepAddressProps) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-[1fr_100px] gap-4">
        <div className="grid gap-2">
          <Label htmlFor="address_street">Rua *</Label>
          <Input
            id="address_street"
            placeholder="Nome da rua"
            value={data.address_street}
            onChange={(e) => onUpdate("address_street", e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="address_number">Número</Label>
          <Input
            id="address_number"
            placeholder="Nº"
            value={data.address_number}
            onChange={(e) => onUpdate("address_number", e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="address_complement">Complemento</Label>
          <Input
            id="address_complement"
            placeholder="Sala, andar..."
            value={data.address_complement}
            onChange={(e) => onUpdate("address_complement", e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="address_neighborhood">Bairro</Label>
          <Input
            id="address_neighborhood"
            placeholder="Bairro"
            value={data.address_neighborhood}
            onChange={(e) => onUpdate("address_neighborhood", e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="address_city">Cidade *</Label>
          <Input
            id="address_city"
            placeholder="Cidade"
            value={data.address_city}
            onChange={(e) => onUpdate("address_city", e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="address_state">Estado *</Label>
          <Input
            id="address_state"
            placeholder="UF"
            value={data.address_state}
            onChange={(e) => onUpdate("address_state", e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="address_zipcode">CEP *</Label>
          <Input
            id="address_zipcode"
            placeholder="00000-000"
            value={data.address_zipcode}
            onChange={(e) => onUpdate("address_zipcode", e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="address_country">País</Label>
          <Input
            id="address_country"
            placeholder="País"
            value={data.address_country}
            onChange={(e) => onUpdate("address_country", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
