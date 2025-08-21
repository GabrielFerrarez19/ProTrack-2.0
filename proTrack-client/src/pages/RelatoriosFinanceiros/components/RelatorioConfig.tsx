import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Filter, BarChart3 } from "lucide-react";

interface RelatorioConfigProps {
  tipoRelatorio: string;
  setTipoRelatorio: (v: string) => void;
  periodoInicio: string;
  setPeriodoInicio: (v: string) => void;
  periodoFim: string;
  setPeriodoFim: (v: string) => void;
}

export function RelatorioConfig({
  tipoRelatorio,
  setTipoRelatorio,
  periodoInicio,
  setPeriodoInicio,
  periodoFim,
  setPeriodoFim,
}: RelatorioConfigProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Configurações do Relatório
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Tipo de Relatório</Label>
            <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lucro-produto">Lucro por Produto</SelectItem>
                <SelectItem value="lucro-categoria">
                  Lucro por Categoria
                </SelectItem>
                <SelectItem value="lucro-periodo">Lucro por Período</SelectItem>
                <SelectItem value="contas-detalhadas">
                  Contas Detalhadas
                </SelectItem>
                <SelectItem value="estoque-investimento">
                  Estoque x Investimento
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Data Início</Label>
            <Input
              type="date"
              value={periodoInicio}
              onChange={(e) => setPeriodoInicio(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Data Fim</Label>
            <Input
              type="date"
              value={periodoFim}
              onChange={(e) => setPeriodoFim(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>&nbsp;</Label>
            <Button className="w-full">
              <BarChart3 className="h-4 w-4 mr-2" />
              Gerar Relatório
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
