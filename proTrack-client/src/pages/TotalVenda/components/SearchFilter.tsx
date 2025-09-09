import { Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Card } from "../../../components/ui/card";

interface SearchFilterProps {
  searchTerm: string;
  onChange: (value: string) => void;
}

export function SearchFilter({ searchTerm, onChange }: SearchFilterProps) {
  return (
    <Card className="p-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID da venda, cliente, data, valor ou status..."
            value={searchTerm}
            onChange={(e) => onChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </Card>
  );
}
