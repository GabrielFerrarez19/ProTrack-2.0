import { Filter, Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

interface SearchBarProps {
  searchTerm: string;
  onChange: (value: string) => void;
}

export function SearchBar({ searchTerm, onChange }: SearchBarProps) {
  return (
    <div className="flex gap-3 items-center">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Pesquise um cliente..."
          value={searchTerm}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 bg-input border-border"
        />
      </div>
      <Button
        variant="outline"
        className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
      >
        <Filter className="w-4 h-4" />
        Filtro
      </Button>
    </div>
  );
}
