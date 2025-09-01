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
import {
  getRelatorioPorTipo,
  getRelatorioCompleto,
} from "../../../services/api";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface RelatorioConfigProps {
  tipoRelatorio: string;
  setTipoRelatorio: (v: string) => void;
  periodoInicio: string;
  setPeriodoInicio: (v: string) => void;
  periodoFim: string;
  setPeriodoFim: (v: string) => void;
}

// Funções auxiliares para formatação de dados
const getTipoRelatorioNome = (tipo: string): string => {
  const nomes = {
    "lucro-produto": "Lucro por Produto",
    "lucro-categoria": "Lucro por Categoria",
    "lucro-periodo": "Lucro por Período",
    "estoque-investimento": "Estoque x Investimento",
    completo: "Relatório Completo",
  };
  return nomes[tipo as keyof typeof nomes] || tipo;
};

const prepararDadosParaExcel = (
  relatorio: unknown
): Record<string, unknown>[] => {
  if (!relatorio || !Array.isArray(relatorio)) {
    return [];
  }

  // Se for um array simples, retornar como está
  if (relatorio.length > 0 && typeof relatorio[0] === "object") {
    return relatorio as Record<string, unknown>[];
  }

  // Se for um objeto único, converter para array
  if (typeof relatorio === "object" && !Array.isArray(relatorio)) {
    return [relatorio as Record<string, unknown>];
  }

  return [];
};

const prepararDadosParaPDF = (
  relatorio: unknown
): { headers: string[]; data: string[][] } => {
  if (!relatorio || !Array.isArray(relatorio) || relatorio.length === 0) {
    return { headers: ["Nenhum dado disponível"], data: [] };
  }

  const primeiroItem = relatorio[0];
  if (typeof primeiroItem === "object" && primeiroItem !== null) {
    const headers = Object.keys(primeiroItem as Record<string, unknown>);
    const data = relatorio.map((item) =>
      headers.map((header) => {
        const value = (item as Record<string, unknown>)[header];
        return value !== null && value !== undefined ? String(value) : "";
      })
    );
    return { headers, data };
  }

  // Se for um array simples
  return {
    headers: ["Dados"],
    data: relatorio.map((item) => [String(item)]),
  };
};

export function RelatorioConfig({
  tipoRelatorio,
  setTipoRelatorio,
  periodoInicio,
  setPeriodoInicio,
  periodoFim,
  setPeriodoFim,
}: RelatorioConfigProps) {
  const [loading, setLoading] = useState(false);

  const gerarRelatorio = async () => {
    setLoading(true);
    try {
      let relatorio;

      if (tipoRelatorio === "completo") {
        relatorio = await getRelatorioCompleto(periodoInicio, periodoFim);
      } else {
        relatorio = await getRelatorioPorTipo(
          tipoRelatorio,
          periodoInicio,
          periodoFim
        );
      }

      // Aqui você pode implementar a lógica para exportar o relatório
      console.log("Relatório gerado:", relatorio);

      // Exemplo de download como JSON
      const dataStr = JSON.stringify(relatorio, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `relatorio-${tipoRelatorio}-${periodoInicio}-${periodoFim}.json`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("Relatório gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast.error("Erro ao gerar relatório");
    } finally {
      setLoading(false);
    }
  };

  const exportarExcel = async () => {
    setLoading(true);
    try {
      let relatorio;

      if (tipoRelatorio === "completo") {
        relatorio = await getRelatorioCompleto(periodoInicio, periodoFim);
      } else {
        relatorio = await getRelatorioPorTipo(
          tipoRelatorio,
          periodoInicio,
          periodoFim
        );
      }

      // Preparar dados para Excel
      const dadosParaExcel = prepararDadosParaExcel(relatorio);

      // Criar workbook e worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(dadosParaExcel);

      // Adicionar worksheet ao workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");

      // Gerar arquivo e fazer download
      const nomeArquivo = `relatorio-${tipoRelatorio}-${periodoInicio}-${periodoFim}.xlsx`;
      XLSX.writeFile(workbook, nomeArquivo);

      toast.success("Relatório exportado para Excel com sucesso!");
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
      console.log("Iniciando exportação PDF...");

      let relatorio;

      if (tipoRelatorio === "completo") {
        console.log("Buscando relatório completo...");
        relatorio = await getRelatorioCompleto(periodoInicio, periodoFim);
      } else {
        console.log("Buscando relatório por tipo:", tipoRelatorio);
        relatorio = await getRelatorioPorTipo(
          tipoRelatorio,
          periodoInicio,
          periodoFim
        );
      }

      console.log("Dados do relatório recebidos:", relatorio);

      // Preparar dados para PDF
      const { headers, data } = prepararDadosParaPDF(relatorio);
      console.log("Headers preparados:", headers);
      console.log("Data preparada:", data);

      // Criar PDF
      console.log("Criando instância do PDF...");
      const pdf = new jsPDF();
      console.log("PDF criado com sucesso");

      // Adicionar título
      console.log("Adicionando título...");
      pdf.setFontSize(16);
      pdf.text(`Relatório - ${getTipoRelatorioNome(tipoRelatorio)}`, 14, 20);
      pdf.setFontSize(12);
      pdf.text(`Período: ${periodoInicio} a ${periodoFim}`, 14, 30);

      // Adicionar tabela usando autoTable
      console.log("Adicionando tabela...");
      const pdfWithAutoTable = pdf as jsPDF & {
        autoTable: (options: unknown) => jsPDF;
      };
      pdfWithAutoTable.autoTable({
        head: [headers],
        body: data,
        startY: 40,
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
      });

      console.log("Tabela adicionada com sucesso");

      // Salvar PDF
      const nomeArquivo = `relatorio-${tipoRelatorio}-${periodoInicio}-${periodoFim}.pdf`;
      console.log("Salvando PDF como:", nomeArquivo);
      pdf.save(nomeArquivo);

      console.log("PDF salvo com sucesso");
      toast.success("Relatório exportado para PDF com sucesso!");
    } catch (error) {
      console.error("Erro detalhado ao exportar PDF:", error);
      console.error(
        "Stack trace:",
        error instanceof Error ? error.stack : "N/A"
      );
      toast.error(
        `Erro ao exportar PDF: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    } finally {
      setLoading(false);
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
              className="w-full"
              onClick={gerarRelatorio}
              disabled={loading}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {loading ? "Gerando..." : "Gerar Relatório"}
            </Button>
          </div>
        </div>

        {/* Botões de Exportação */}
        <div className="flex gap-4 mt-6">
          <Button
            variant="outline"
            onClick={exportarExcel}
            disabled={loading}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
          <Button
            variant="outline"
            onClick={exportarPDF}
            disabled={loading}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
