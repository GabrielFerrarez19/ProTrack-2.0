# Exportação e Relatórios - ProTrack 2.0

## Visão Geral

O sistema ProTrack 2.0 oferece funcionalidades avançadas de exportação de relatórios, permitindo que os usuários exportem dados em diferentes formatos (Excel e PDF) para análise externa, apresentações e arquivamento.

## Dependências

### Frontend

```json
{
  "xlsx": "^0.18.5",
  "jspdf": "^2.5.1",
  "jspdf-autotable": "^3.5.31"
}
```

### Backend

```json
{
  "xlsx": "^0.18.5",
  "puppeteer": "^21.5.2"
}
```

## Configuração

### Instalação das Dependências

```bash
# Frontend
npm install xlsx jspdf jspdf-autotable

# Backend
npm install xlsx puppeteer
```

### Configuração do Ambiente

```typescript
// config/export.ts
export const exportConfig = {
  excel: {
    defaultSheetName: "Relatório",
    dateFormat: "DD/MM/YYYY",
    currencyFormat: "R$ #,##0.00",
  },
  pdf: {
    pageSize: "A4",
    orientation: "landscape",
    margin: 20,
    fontSize: 10,
  },
};
```

## Estrutura de Exportação

### Serviço de Exportação

```typescript
// services/export.service.ts
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export class ExportService {
  async exportToExcel(data: any[], filename: string): Promise<Buffer> {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");

    return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  }

  async exportToPDF(data: any[], filename: string): Promise<Buffer> {
    const doc = new jsPDF("landscape", "mm", "a4");

    doc.autoTable({
      head: [Object.keys(data[0])],
      body: data.map((row) => Object.values(row)),
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    return doc.output("arraybuffer");
  }
}
```

### Controller de Exportação

```typescript
// controllers/export.controller.ts
export class ExportController {
  async exportVendas(req: Request, res: Response) {
    try {
      const { formato, filtros } = req.body;
      const vendas = await vendaService.getVendas(filtros);

      let buffer: Buffer;
      let contentType: string;
      let filename: string;

      if (formato === "excel") {
        buffer = await exportService.exportToExcel(vendas, "vendas");
        contentType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        filename = "vendas.xlsx";
      } else {
        buffer = await exportService.exportToPDF(vendas, "vendas");
        contentType = "application/pdf";
        filename = "vendas.pdf";
      }

      res.setHeader("Content-Type", contentType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      res.send(buffer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
```

## Tipos de Relatórios

### 1. Relatório de Vendas

#### Estrutura dos Dados

```typescript
interface VendaExportData {
  id: number;
  cliente: string;
  produtos: string;
  total: number;
  status: string;
  dataVenda: string;
  vendedor: string;
}
```

#### Exportação Excel

```typescript
const exportVendasExcel = (vendas: VendaExportData[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    vendas.map((venda) => ({
      ID: venda.id,
      Cliente: venda.cliente,
      Produtos: venda.produtos,
      Total: venda.total,
      Status: venda.status,
      "Data da Venda": venda.dataVenda,
      Vendedor: venda.vendedor,
    }))
  );

  // Formatação
  worksheet["!cols"] = [
    { width: 10 }, // ID
    { width: 25 }, // Cliente
    { width: 40 }, // Produtos
    { width: 15 }, // Total
    { width: 15 }, // Status
    { width: 20 }, // Data
    { width: 20 }, // Vendedor
  ];

  return worksheet;
};
```

#### Exportação PDF

```typescript
const exportVendasPDF = (vendas: VendaExportData[]) => {
  const doc = new jsPDF("landscape", "mm", "a4");

  // Cabeçalho
  doc.setFontSize(16);
  doc.text("Relatório de Vendas", 20, 15);

  // Tabela
  doc.autoTable({
    head: [
      ["ID", "Cliente", "Produtos", "Total", "Status", "Data", "Vendedor"],
    ],
    body: vendas.map((venda) => [
      venda.id,
      venda.cliente,
      venda.produtos,
      `R$ ${venda.total.toFixed(2)}`,
      venda.status,
      venda.dataVenda,
      venda.vendedor,
    ]),
    startY: 25,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  return doc;
};
```

### 2. Relatório de Contas a Pagar

#### Estrutura dos Dados

```typescript
interface ContaPagarExportData {
  id: number;
  fornecedor: string;
  descricao: string;
  valor: number;
  dataVencimento: string;
  status: string;
  diasVencimento: number;
}
```

#### Exportação com Formatação

```typescript
const exportContasPagar = (contas: ContaPagarExportData[], formato: string) => {
  if (formato === "excel") {
    const worksheet = XLSX.utils.json_to_sheet(
      contas.map((conta) => ({
        ID: conta.id,
        Fornecedor: conta.fornecedor,
        Descrição: conta.descricao,
        Valor: conta.valor,
        Vencimento: conta.dataVencimento,
        Status: conta.status,
        "Dias Vencimento": conta.diasVencimento,
      }))
    );

    // Formatação condicional para contas vencidas
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      const statusCell = worksheet[XLSX.utils.encode_cell({ r: row, c: 5 })];
      if (statusCell && statusCell.v === "vencida") {
        // Aplicar formatação vermelha
        statusCell.s = { fill: { fgColor: { rgb: "FF0000" } } };
      }
    }

    return worksheet;
  } else {
    // Exportação PDF
    const doc = new jsPDF("landscape", "mm", "a4");

    doc.autoTable({
      head: [
        [
          "ID",
          "Fornecedor",
          "Descrição",
          "Valor",
          "Vencimento",
          "Status",
          "Dias",
        ],
      ],
      body: contas.map((conta) => [
        conta.id,
        conta.fornecedor,
        conta.descricao,
        `R$ ${conta.valor.toFixed(2)}`,
        conta.dataVencimento,
        conta.status,
        conta.diasVencimento,
      ]),
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
      didParseCell: (data) => {
        if (data.column.index === 5 && data.cell.text[0] === "vencida") {
          data.cell.styles.fillColor = [255, 0, 0];
        }
      },
    });

    return doc;
  }
};
```

### 3. Relatório de Estoque

#### Estrutura dos Dados

```typescript
interface EstoqueExportData {
  id: number;
  produto: string;
  categoria: string;
  estoqueAtual: number;
  estoqueMinimo: number;
  preco: number;
  status: string;
}
```

#### Exportação com Alertas

```typescript
const exportEstoque = (produtos: EstoqueExportData[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    produtos.map((produto) => ({
      ID: produto.id,
      Produto: produto.produto,
      Categoria: produto.categoria,
      "Estoque Atual": produto.estoqueAtual,
      "Estoque Mínimo": produto.estoqueMinimo,
      Preço: produto.preco,
      Status:
        produto.estoqueAtual <= produto.estoqueMinimo
          ? "Estoque Baixo"
          : "Normal",
    }))
  );

  // Formatação para produtos com estoque baixo
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  for (let row = range.s.r + 1; row <= range.e.r; row++) {
    const statusCell = worksheet[XLSX.utils.encode_cell({ r: row, c: 6 })];
    if (statusCell && statusCell.v === "Estoque Baixo") {
      statusCell.s = { fill: { fgColor: { rgb: "FFA500" } } };
    }
  }

  return worksheet;
};
```

## Funcionalidades Avançadas

### 1. Exportação com Filtros

#### Filtros Disponíveis

```typescript
interface ExportFilters {
  dataInicio?: string;
  dataFim?: string;
  clienteId?: number;
  fornecedorId?: number;
  status?: string;
  categoria?: string;
}
```

#### Aplicação de Filtros

```typescript
const applyFilters = (data: any[], filters: ExportFilters) => {
  return data.filter((item) => {
    if (filters.dataInicio && item.data < filters.dataInicio) return false;
    if (filters.dataFim && item.data > filters.dataFim) return false;
    if (filters.clienteId && item.clienteId !== filters.clienteId) return false;
    if (filters.fornecedorId && item.fornecedorId !== filters.fornecedorId)
      return false;
    if (filters.status && item.status !== filters.status) return false;
    if (filters.categoria && item.categoria !== filters.categoria) return false;
    return true;
  });
};
```

### 2. Exportação Agendada

#### Configuração de Agendamento

```typescript
// services/scheduledExport.service.ts
export class ScheduledExportService {
  async scheduleExport(config: {
    tipo: string;
    formato: string;
    filtros: ExportFilters;
    email: string;
    frequencia: "diario" | "semanal" | "mensal";
  }) {
    // Salvar configuração no banco
    const scheduledExport = await prisma.scheduledExport.create({
      data: config,
    });

    // Agendar execução
    this.scheduleExecution(scheduledExport.id, config.frequencia);
  }

  private scheduleExecution(exportId: number, frequencia: string) {
    const cronExpression = this.getCronExpression(frequencia);
    cron.schedule(cronExpression, async () => {
      await this.executeScheduledExport(exportId);
    });
  }
}
```

### 3. Exportação em Lote

#### Processamento em Lote

```typescript
const exportBatch = async (exports: ExportRequest[]) => {
  const results = [];

  for (const exportReq of exports) {
    try {
      const result = await processExport(exportReq);
      results.push({ success: true, data: result });
    } catch (error) {
      results.push({ success: false, error: error.message });
    }
  }

  return results;
};
```

## Tratamento de Erros

### Erros Comuns

```typescript
export class ExportError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "ExportError";
  }
}

const handleExportError = (error: Error) => {
  if (error instanceof ExportError) {
    switch (error.code) {
      case "NO_DATA":
        return "Nenhum dado encontrado para exportação";
      case "INVALID_FORMAT":
        return "Formato de exportação inválido";
      case "FILE_TOO_LARGE":
        return "Arquivo muito grande para exportação";
      default:
        return "Erro na exportação";
    }
  }
  return "Erro interno do servidor";
};
```

### Validação de Dados

```typescript
const validateExportData = (data: any[]) => {
  if (!data || data.length === 0) {
    throw new ExportError("Nenhum dado encontrado", "NO_DATA");
  }

  if (data.length > 10000) {
    throw new ExportError("Muitos dados para exportação", "FILE_TOO_LARGE");
  }

  return true;
};
```

## Performance e Otimização

### Otimizações de Memória

```typescript
const exportLargeDataset = async (data: any[], chunkSize: number = 1000) => {
  const chunks = [];

  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }

  const results = [];
  for (const chunk of chunks) {
    const result = await processChunk(chunk);
    results.push(result);
  }

  return results;
};
```

### Cache de Exportação

```typescript
const cacheExport = async (key: string, data: any[]) => {
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }

  const result = await processExport(data);
  await redis.setex(key, 3600, JSON.stringify(result));

  return result;
};
```

## Configurações Avançadas

### Personalização de Templates

```typescript
const customTemplate = {
  excel: {
    headerStyle: {
      font: { bold: true, color: "FFFFFF" },
      fill: { fgColor: "2E86AB" },
      alignment: { horizontal: "center" },
    },
    dataStyle: {
      font: { size: 10 },
      alignment: { horizontal: "left" },
    },
  },
  pdf: {
    headerStyle: {
      fillColor: [46, 134, 171],
      textColor: [255, 255, 255],
      fontSize: 12,
    },
    dataStyle: {
      fontSize: 10,
      textColor: [0, 0, 0],
    },
  },
};
```

### Configuração de Logs

```typescript
const logExport = (
  userId: number,
  tipo: string,
  formato: string,
  sucesso: boolean
) => {
  logger.info("Exportação realizada", {
    userId,
    tipo,
    formato,
    sucesso,
    timestamp: new Date(),
  });
};
```

## Exemplos de Uso

### Frontend (React)

```typescript
const handleExport = async (tipo: string, formato: string) => {
  try {
    const response = await api.post("/export", {
      tipo,
      formato,
      filtros: currentFilters,
    });

    const blob = new Blob([response.data], {
      type:
        formato === "excel"
          ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          : "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${tipo}.${formato === "excel" ? "xlsx" : "pdf"}`;
    link.click();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erro na exportação:", error);
  }
};
```

### Backend (Express)

```typescript
app.post("/api/export", async (req, res) => {
  try {
    const { tipo, formato, filtros } = req.body;

    const data = await getDataForExport(tipo, filtros);
    const buffer = await exportService.export(data, formato);

    res.setHeader(
      "Content-Type",
      formato === "excel"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "application/pdf"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${tipo}.${formato === "excel" ? "xlsx" : "pdf"}"`
    );
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Relatórios Específicos

### Relatório de Fluxo de Caixa

```typescript
interface FluxoCaixaData {
  data: string;
  receitas: number;
  despesas: number;
  saldo: number;
  saldoAcumulado: number;
}

const exportFluxoCaixa = (dados: FluxoCaixaData[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    dados.map((item) => ({
      Data: item.data,
      Receitas: item.receitas,
      Despesas: item.despesas,
      Saldo: item.saldo,
      "Saldo Acumulado": item.saldoAcumulado,
    }))
  );

  // Formatação de moeda
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  for (let row = range.s.r + 1; row <= range.e.r; row++) {
    for (let col = 1; col <= 4; col++) {
      const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })];
      if (cell) {
        cell.z = "R$ #,##0.00";
      }
    }
  }

  return worksheet;
};
```

### Relatório de Performance de Vendas

```typescript
interface PerformanceVendasData {
  vendedor: string;
  totalVendas: number;
  quantidadeVendas: number;
  ticketMedio: number;
  comissao: number;
}

const exportPerformanceVendas = (dados: PerformanceVendasData[]) => {
  const doc = new jsPDF("landscape", "mm", "a4");

  // Cabeçalho
  doc.setFontSize(16);
  doc.text("Relatório de Performance de Vendas", 20, 15);

  // Tabela
  doc.autoTable({
    head: [
      ["Vendedor", "Total Vendas", "Quantidade", "Ticket Médio", "Comissão"],
    ],
    body: dados.map((item) => [
      item.vendedor,
      `R$ ${item.totalVendas.toFixed(2)}`,
      item.quantidadeVendas,
      `R$ ${item.ticketMedio.toFixed(2)}`,
      `R$ ${item.comissao.toFixed(2)}`,
    ]),
    startY: 25,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  return doc;
};
```

## Integração com Sistema de Notificações

### Notificação de Exportação Concluída

```typescript
const notifyExportComplete = async (
  userId: number,
  tipo: string,
  formato: string,
  filename: string
) => {
  await notificationService.create({
    userId,
    type: "export_complete",
    title: "Exportação Concluída",
    message: `Seu relatório de ${tipo} em formato ${formato} foi gerado com sucesso.`,
    data: { filename },
  });
};
```

### Envio por Email

```typescript
const sendExportByEmail = async (
  email: string,
  filename: string,
  buffer: Buffer
) => {
  await emailService.send({
    to: email,
    subject: "Relatório Exportado - ProTrack 2.0",
    text: "Segue em anexo o relatório solicitado.",
    attachments: [
      {
        filename,
        content: buffer,
      },
    ],
  });
};
```

## Conclusão

O sistema de exportação do ProTrack 2.0 oferece funcionalidades robustas e flexíveis para geração de relatórios em diferentes formatos. Com suporte a Excel e PDF, filtros avançados, agendamento automático e tratamento de erros, o sistema atende às necessidades de exportação de dados de forma eficiente e confiável.

### Características Principais:

- **Múltiplos Formatos**: Suporte a Excel (.xlsx) e PDF
- **Filtros Avançados**: Filtros por data, cliente, fornecedor, status, etc.
- **Formatação Inteligente**: Formatação condicional e estilos personalizados
- **Exportação Agendada**: Relatórios automáticos por email
- **Performance Otimizada**: Processamento em lotes e cache
- **Tratamento de Erros**: Sistema robusto de tratamento de erros
- **Logs e Auditoria**: Rastreamento completo de exportações
- **Integração**: Notificações e envio por email
