import { Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Card } from "../../../components/ui/card";

interface SearchBarProps {
  searchTerm: string;
  onChange: (value: string) => void;
}

export function SearchBar({ searchTerm, onChange }: SearchBarProps) {
  return (
    <Card className="p-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, CPF, email, telefone, endereço, cidade ou bairro..."
            value={searchTerm}
            onChange={(e) => onChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </Card>
  );
}
