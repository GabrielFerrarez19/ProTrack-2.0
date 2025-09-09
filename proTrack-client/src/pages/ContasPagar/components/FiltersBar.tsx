import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Search, Filter, X, RotateCcw, Calendar } from "lucide-react";

interface CategoriaOption {
  value: string;
  label: string;
}

interface StatusOption {
  value: string;
  label: string;
}

interface FiltersBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  categoriaFilter: string;
  setCategoriaFilter: (value: string) => void;
  categorias: CategoriaOption[];
  statusOptions: StatusOption[];
  onAplicarFiltros: () => void;
  onLimparFiltros: () => void;
  loading: boolean;
}

export function FiltersBar({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  categoriaFilter,
  setCategoriaFilter,
  categorias,
  statusOptions,
  onAplicarFiltros,
  onLimparFiltros,
  loading,
}: FiltersBarProps) {
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // Aplicar filtros automaticamente após digitação
    if (value.length === 0 || value.length >= 3) {
      setTimeout(() => onAplicarFiltros(), 300);
    }
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    onAplicarFiltros();
  };

  const handleCategoriaChange = (value: string) => {
    setCategoriaFilter(value);
    onAplicarFiltros();
  };

  const temFiltrosAtivos =
    searchTerm || statusFilter !== "todos" || categoriaFilter !== "todas";

  const getFiltrosAtivosCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (statusFilter !== "todos") count++;
    if (categoriaFilter !== "todas") count++;
    return count;
  };

  return (
    <div className="space-y-4">
      {/* Filtros principais */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por fornecedor, descrição ou observações..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
            disabled={loading}
          />
          {searchTerm && (
            <div className="absolute right-3 top-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm("")}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        <Select
          value={statusFilter}
          onValueChange={handleStatusChange}
          disabled={loading}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={categoriaFilter}
          onValueChange={handleCategoriaChange}
          disabled={loading}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            {categorias.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Ações dos filtros */}
      <div className="flex flex-wrap gap-2 items-center">
        {temFiltrosAtivos && (
          <Button
            variant="outline"
            size="sm"
            onClick={onLimparFiltros}
            disabled={loading}
            className="text-destructive border-destructive hover:bg-destructive hover:text-white"
          >
            <X className="h-4 w-4 mr-2" />
            Limpar Filtros ({getFiltrosAtivosCount()})
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onAplicarFiltros}
          disabled={loading}
        >
          <RotateCcw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Aplicar Filtros
        </Button>

        <Button variant="outline" size="sm" disabled={loading}>
          <Calendar className="h-4 w-4 mr-2" />
          Filtros por Data
        </Button>

        <Button variant="outline" size="sm" disabled={loading}>
          <Filter className="h-4 w-4 mr-2" />
          Filtros Avançados
        </Button>
      </div>

      {/* Indicador de filtros ativos */}
      {temFiltrosAtivos && (
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="flex flex-wrap gap-2 items-center text-sm">
            <span className="font-medium text-foreground">Filtros ativos:</span>
            {searchTerm && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-md border border-primary/20">
                🔍 Busca: "{searchTerm}"
              </span>
            )}
            {statusFilter !== "todos" && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md border border-blue-200">
                📊 Status:{" "}
                {statusOptions.find((s) => s.value === statusFilter)?.label}
              </span>
            )}
            {categoriaFilter !== "todas" && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md border border-green-200">
                🏷️ Categoria:{" "}
                {categorias.find((c) => c.value === categoriaFilter)?.label}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
