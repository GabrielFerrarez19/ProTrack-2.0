import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { FileText, Download, PieChart as PieChartIcon } from "lucide-react";

export function ExportarRelatorios() {
  return (
    <Card className="bg-pastel-green">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" /> Exportar Relatórios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="bg-white/30 text-gray-700 hover:bg-white/50"
          >
            <FileText className="h-4 w-4 mr-2" /> Exportar Excel
          </Button>
          <Button
            variant="outline"
            className="bg-white/30 text-gray-700 hover:bg-white/50"
          >
            <FileText className="h-4 w-4 mr-2" /> Exportar PDF
          </Button>
          <Button
            variant="outline"
            className="bg-white/30 text-gray-700 hover:bg-white/50"
          >
            <PieChartIcon className="h-4 w-4 mr-2" /> Relatório Customizado
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
