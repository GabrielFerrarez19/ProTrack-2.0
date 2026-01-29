import { useState } from "react";
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
import { Filter, BarChart3, Download } from "lucide-react";
import { useRelatorios } from "../../../hooks/useRelatorios";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import type { RelatorioItem } from "../../../@types/types.components";

interface RelatorioConfigProps {
  tipoRelatorio: string;
  setTipoRelatorio: (v: string) => void;
  periodoInicio: string;
  setPeriodoInicio: (v: string) => void;
  periodoFim: string;
  setPeriodoFim: (v: string) => void;
}

// Função para nomes dos relatórios
const getTipoRelatorioNome = (tipo: string): string => {
  const nomes: Record<string, string> = {
    "lucro-produto": "Lucro por Produto",
    "lucro-categoria": "Lucro por Categoria",
    "lucro-periodo": "Lucro por Período",
    "estoque-investimento": "Estoque x Investimento",
    completo: "Relatório Completo",
  };
  return nomes[tipo] || tipo;
};

// Preparar dados para Excel
const prepararDadosParaExcel = (
  relatorio: RelatorioItem[],
): Record<string, unknown>[] => {
  return relatorio.map((item) => {
    const obj: Record<string, unknown> = {};
    Object.keys(item).forEach((key) => {
      const value = item[key];
      obj[key] =
        value === null || value === undefined
          ? ""
          : typeof value === "object"
            ? JSON.stringify(value)
            : value;
    });
    return obj;
  });
};

// Preparar dados para PDF
const prepararDadosParaPDF = (
  relatorio: RelatorioItem[],
): { headers: string[]; data: string[][] } => {
  if (!relatorio || relatorio.length === 0)
    return { headers: ["Nenhum dado disponível"], data: [] };

  const headers = Object.keys(relatorio[0]);
  const data = relatorio.map((item) =>
    headers.map((key) => {
      const value = item[key];
      return value === null || value === undefined
        ? ""
        : typeof value === "object"
          ? JSON.stringify(value)
          : String(value);
    }),
  );

  return { headers, data };
};

// Componente
export function RelatorioConfig({
  tipoRelatorio,
  setTipoRelatorio,
  periodoInicio,
  setPeriodoInicio,
  periodoFim,
  setPeriodoFim,
}: RelatorioConfigProps) {
  const { loading, gerarRelatorioCompleto, gerarRelatorioPorTipo } =
    useRelatorios();

  const fetchRelatorio = async (): Promise<RelatorioItem[]> => {
    const res =
      tipoRelatorio === "completo"
        ? await gerarRelatorioCompleto(periodoInicio, periodoFim)
        : await gerarRelatorioPorTipo(tipoRelatorio, periodoInicio, periodoFim);

    if (res && typeof res === "object" && "relatorio" in res)
      return (res as { relatorio: RelatorioItem[] }).relatorio;
    if (Array.isArray(res)) return res as RelatorioItem[];
    return [];
  };

  const gerarRelatorio = async () => {
    try {
      const relatorio = await fetchRelatorio();
      toast.success("Relatório gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast.error("Erro ao gerar relatório");
    }
  };

  const exportarExcel = async () => {
    try {
      const relatorio = await fetchRelatorio();
      const dadosParaExcel = prepararDadosParaExcel(relatorio);

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(dadosParaExcel);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");

      XLSX.writeFile(
        workbook,
        `relatorio-${tipoRelatorio}-${periodoInicio}-${periodoFim}.xlsx`,
      );
      toast.success("Relatório exportado para Excel com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar Excel:", error);
      toast.error("Erro ao exportar Excel");
    }
  };

  const exportarPDF = async () => {
    try {
      const relatorio = await fetchRelatorio();
      const { headers, data } = prepararDadosParaPDF(relatorio);

      // PDF em horizontal
      const pdf = new jsPDF({ orientation: "landscape" });
      pdf.setFontSize(16);
      pdf.text(`Relatório - ${getTipoRelatorioNome(tipoRelatorio)}`, 14, 20);
      pdf.setFontSize(12);
      pdf.text(`Período: ${periodoInicio} a ${periodoFim}`, 14, 30);

      pdf.autoTable({
        head: [headers],
        body: data,
        startY: 40,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
      });

      pdf.save(`relatorio-${tipoRelatorio}-${periodoInicio}-${periodoFim}.pdf`);
      toast.success("Relatório exportado para PDF com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      toast.error(
        `Erro ao exportar PDF: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`,
      );
    }
  };

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
                <SelectItem value="estoque-investimento">
                  Estoque x Investimento
                </SelectItem>
                <SelectItem value="completo">Relatório Completo</SelectItem>
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
            <Button
              className="w-full cursor-pointer bg-gradient-to-r from-[#628DFD] to-[#6F31FF] hover:from-[#7A9BFD] hover:to-[#B597F9]"
              onClick={gerarRelatorio}
              disabled={loading}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {loading ? "Gerando..." : "Gerar Relatório"}
            </Button>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button
            variant="outline"
            onClick={exportarExcel}
            disabled={loading}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" /> Exportar Excel
          </Button>
          <Button
            variant="outline"
            onClick={exportarPDF}
            disabled={loading}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" /> Exportar PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
