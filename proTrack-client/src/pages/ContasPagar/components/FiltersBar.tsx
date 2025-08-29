import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Search, Filter, Download } from "lucide-react";

interface FiltersBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  categoriaFilter: string;
  setCategoriaFilter: (value: string) => void;
  categorias: string[];
}

export function FiltersBar({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  categoriaFilter,
  setCategoriaFilter,
  categorias,
}: FiltersBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por fornecedor ou descrição..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="pendente">Pendente</SelectItem>
          <SelectItem value="agendado">Agendado</SelectItem>
          <SelectItem value="pago">Pago</SelectItem>
          <SelectItem value="vencido">Vencido</SelectItem>
        </SelectContent>
      </Select>
      <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas</SelectItem>
          {categorias.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline">
        <Filter className="h-4 w-4 mr-2" />
        Filtros Avançados
      </Button>
      <Button variant="outline">
        <Download className="h-4 w-4 mr-2" />
        Exportar
      </Button>
    </div>
  );
}
