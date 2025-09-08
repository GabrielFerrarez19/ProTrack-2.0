# Solução de Problemas - Geração de PDF

## Problemas Comuns e Soluções

### 1. Biblioteca jsPDF não encontrada

**Problema**: Erro "jsPDF is not defined" ou "Cannot resolve module 'jspdf'"

**Solução**:

```bash
npm install jspdf jspdf-autotable
```

**Verificação**:

```javascript
import jsPDF from "jspdf";
import "jspdf-autotable";
```

### 2. Função autoTable não reconhecida

**Problema**: Erro "doc.autoTable is not a function"

**Solução**:

```javascript
// Importar corretamente
import jsPDF from "jspdf";
import "jspdf-autotable";

// Verificar se a função está disponível
if (typeof doc.autoTable === "function") {
  doc.autoTable(columns, rows);
} else {
  console.error("autoTable não está disponível");
}
```

### 3. Dados não aparecem na tabela

**Problema**: Tabela gerada mas sem dados

**Solução**:

```javascript
// Verificar estrutura dos dados
const columns = [
  { title: "ID", dataKey: "id" },
  { title: "Nome", dataKey: "nome" },
  { title: "Valor", dataKey: "valor" },
];

const rows = dados.map((item) => ({
  id: item.id,
  nome: item.nome,
  valor: item.valor,
}));

// Verificar se os dados estão corretos
console.log("Columns:", columns);
console.log("Rows:", rows);
```

### 4. Erro de permissão ao salvar

**Problema**: "Permission denied" ao tentar salvar o PDF

**Solução**:

```javascript
// Usar download automático
const pdfBlob = doc.output("blob");
const url = URL.createObjectURL(pdfBlob);
const link = document.createElement("a");
link.href = url;
link.download = "relatorio.pdf";
link.click();
URL.revokeObjectURL(url);
```

### 5. Layout quebrado ou desalinhado

**Problema**: Tabela com layout incorreto

**Solução**:

```javascript
doc.autoTable(columns, rows, {
  startY: 20,
  margin: { top: 20, right: 20, bottom: 20, left: 20 },
  styles: {
    fontSize: 10,
    cellPadding: 5,
    overflow: "linebreak",
    halign: "left",
  },
  columnStyles: {
    0: { halign: "center", width: 50 },
    1: { halign: "left", width: 100 },
    2: { halign: "right", width: 80 },
  },
});
```

### 6. Fonte não suportada

**Problema**: Caracteres especiais não aparecem

**Solução**:

```javascript
// Usar fonte padrão
doc.setFont("helvetica");

// Ou adicionar fonte customizada
doc.addFont("path/to/font.ttf", "CustomFont", "normal");
doc.setFont("CustomFont");
```

### 7. Limite de memória

**Problema**: Erro de memória com muitos dados

**Solução**:

```javascript
// Processar dados em lotes
const processarEmLotes = (dados, tamanhoLote = 100) => {
  const lotes = [];
  for (let i = 0; i < dados.length; i += tamanhoLote) {
    lotes.push(dados.slice(i, i + tamanhoLote));
  }
  return lotes;
};

// Gerar PDF por lotes
const lotes = processarEmLotes(dados);
lotes.forEach((lote, index) => {
  if (index > 0) {
    doc.addPage();
  }
  doc.autoTable(columns, lote);
});
```

### 8. Configuração Avançada

**Exemplo completo**:

```javascript
import jsPDF from "jspdf";
import "jspdf-autotable";

const gerarPDF = (dados) => {
  try {
    const doc = new jsPDF();

    // Cabeçalho
    doc.setFontSize(16);
    doc.text("Relatório de Vendas", 20, 20);

    // Data de geração
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 20, 30);

    // Configuração da tabela
    const columns = [
      { title: "ID", dataKey: "id" },
      { title: "Cliente", dataKey: "cliente" },
      { title: "Produto", dataKey: "produto" },
      { title: "Quantidade", dataKey: "quantidade" },
      { title: "Valor", dataKey: "valor" },
      { title: "Data", dataKey: "data" },
    ];

    const rows = dados.map((item) => ({
      id: item.id,
      cliente: item.cliente,
      produto: item.produto,
      quantidade: item.quantidade,
      valor: `R$ ${item.valor.toFixed(2)}`,
      data: new Date(item.data).toLocaleDateString(),
    }));

    // Gerar tabela
    doc.autoTable(columns, rows, {
      startY: 40,
      margin: { top: 40, right: 20, bottom: 20, left: 20 },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: "linebreak",
        halign: "left",
      },
      columnStyles: {
        0: { halign: "center", width: 30 },
        1: { halign: "left", width: 60 },
        2: { halign: "left", width: 60 },
        3: { halign: "center", width: 40 },
        4: { halign: "right", width: 50 },
        5: { halign: "center", width: 50 },
      },
      didDrawPage: (data) => {
        // Rodapé
        doc.setFontSize(8);
        doc.text(
          `Página ${data.pageNumber}`,
          20,
          doc.internal.pageSize.height - 10
        );
      },
    });

    // Salvar PDF
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio_vendas_${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw new Error("Falha na geração do PDF");
  }
};
```

### 9. Tratamento de Erros

**Implementação robusta**:

```javascript
const gerarPDFComTratamento = async (dados) => {
  try {
    // Validar dados
    if (!dados || !Array.isArray(dados) || dados.length === 0) {
      throw new Error("Dados inválidos para geração do PDF");
    }

    // Verificar se as bibliotecas estão carregadas
    if (typeof jsPDF === "undefined") {
      throw new Error("Biblioteca jsPDF não encontrada");
    }

    // Gerar PDF
    const pdf = await gerarPDF(dados);
    return pdf;
  } catch (error) {
    console.error("Erro na geração do PDF:", error);

    // Retornar erro amigável
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};
```

### 10. Testes e Validação

**Teste básico**:

```javascript
// Teste de geração
const testarGeracaoPDF = () => {
  const dadosTeste = [
    {
      id: 1,
      cliente: "Cliente A",
      produto: "Produto 1",
      quantidade: 2,
      valor: 100.0,
      data: "2024-01-01",
    },
    {
      id: 2,
      cliente: "Cliente B",
      produto: "Produto 2",
      quantidade: 1,
      valor: 50.0,
      data: "2024-01-02",
    },
  ];

  try {
    gerarPDF(dadosTeste);
    console.log("Teste de geração de PDF: SUCESSO");
  } catch (error) {
    console.error("Teste de geração de PDF: FALHA", error);
  }
};
```

## Resumo das Soluções

1. **Instalar dependências**: `npm install jspdf jspdf-autotable`
2. **Importar corretamente**: Usar imports padrão
3. **Validar dados**: Verificar estrutura antes de processar
4. **Configurar layout**: Usar opções de estilo adequadas
5. **Tratar erros**: Implementar try-catch e validações
6. **Otimizar performance**: Processar dados em lotes se necessário
7. **Testar**: Validar geração com dados de teste

## Dependências Necessárias

```json
{
  "dependencies": {
    "jspdf": "^2.5.1",
    "jspdf-autotable": "^3.5.31"
  }
}
```

## Estrutura de Arquivos

```
src/
├── utils/
│   ├── pdfGenerator.js
│   ├── pdfConfig.js
│   └── pdfUtils.js
├── components/
│   ├── PDFExportButton.jsx
│   └── PDFPreview.jsx
└── services/
    └── pdfService.js
```
