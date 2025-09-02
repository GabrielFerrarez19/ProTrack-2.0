import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
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

interface Props {
  searchTerm: string;
  onSearch: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

export function FiltrosContas({
  searchTerm,
  onSearch,
  statusFilter,
  onStatusChange,
}: Props) {
  return (
    <Card className="bg-white border-pastel-blue/30">
      <CardHeader>
        <CardTitle>Filtros e Pesquisa</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente ou descrição..."
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-9 bg-pastel-blue/10"
              />
            </div>
          </div>

          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[180px] bg-pastel-green/10">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="parcial">Parcial</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
              <SelectItem value="vencido">Vencido</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="bg-pastel-yellow/20">
            <Filter className="h-4 w-4 mr-2" />
            Mais Filtros
          </Button>
          <Button variant="outline" className="bg-pastel-purple/20">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
