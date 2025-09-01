import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { FileText, Download, PieChart as PieChartIcon } from "lucide-react";
import { getRelatorioCompleto } from "../../../services/api";
import { toast } from "sonner";

export function ExportarRelatorios() {
  const [loading, setLoading] = useState(false);

  const exportarRelatorioCompleto = async () => {
    setLoading(true);
    try {
      // Usar período atual (último mês)
      const hoje = new Date();
      const dataFim = hoje.toISOString().split("T")[0];
      const dataInicio = new Date(
        hoje.getFullYear(),
        hoje.getMonth() - 1,
        hoje.getDate()
      )
        .toISOString()
        .split("T")[0];

      const relatorio = await getRelatorioCompleto(dataInicio, dataFim);

      // Download como JSON
      const dataStr = JSON.stringify(relatorio, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `relatorio-completo-${dataInicio}-${dataFim}.json`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("Relatório completo exportado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar relatório:", error);
      toast.error("Erro ao exportar relatório");
    } finally {
      setLoading(false);
    }
  };

  const exportarExcel = async () => {
    setLoading(true);
    try {
      toast.info("Funcionalidade de exportação Excel em desenvolvimento");
    } catch (error) {
      console.error("Erro ao exportar Excel:", error);
      toast.error("Erro ao exportar Excel");
    } finally {
      setLoading(false);
    }
  };

  const exportarPDF = async () => {
    setLoading(true);
    try {
      toast.info("Funcionalidade de exportação PDF em desenvolvimento");
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      toast.error("Erro ao exportar PDF");
    } finally {
      setLoading(false);
    }
  };

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
            onClick={exportarExcel}
            disabled={loading}
          >
            <FileText className="h-4 w-4 mr-2" />
            {loading ? "Exportando..." : "Exportar Excel"}
          </Button>
          <Button
            variant="outline"
            className="bg-white/30 text-gray-700 hover:bg-white/50"
            onClick={exportarPDF}
            disabled={loading}
          >
            <FileText className="h-4 w-4 mr-2" />
            {loading ? "Exportando..." : "Exportar PDF"}
          </Button>
          <Button
            variant="outline"
            className="bg-white/30 text-gray-700 hover:bg-white/50"
            onClick={exportarRelatorioCompleto}
            disabled={loading}
          >
            <PieChartIcon className="h-4 w-4 mr-2" />
            {loading ? "Gerando..." : "Relatório Completo"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
