# Exportação de Relatórios - ProTrack 2.0

## Funcionalidades Implementadas

O sistema agora suporta exportação de relatórios em dois formatos:

### 1. Exportação para Excel (.xlsx)

- Utiliza a biblioteca `xlsx`
- Gera arquivos Excel com formatação adequada
- Mantém a estrutura dos dados originais

### 2. Exportação para PDF (.pdf)

- Utiliza as bibliotecas `jspdf` e `jspdf-autotable`
- Gera PDFs com tabelas formatadas
- Inclui cabeçalho com informações do relatório

## Como Usar

### 1. Acesse a página de Relatórios Financeiros

- Navegue até a seção de Relatórios Financeiros
- Configure o tipo de relatório desejado
- Defina o período de análise

### 2. Configure o Relatório

- **Tipo de Relatório**: Selecione entre:

  - Lucro por Produto
  - Lucro por Categoria
  - Lucro por Período
  - Estoque x Investimento
  - Relatório Completo

- **Período**: Defina as datas de início e fim

### 3. Exporte o Relatório

- Clique em "Gerar Relatório" para visualizar os dados
- Use "Exportar Excel" para baixar em formato .xlsx
- Use "Exportar PDF" para baixar em formato .pdf

## Dependências Instaladas

```bash
npm install xlsx jspdf jspdf-autotable
```

## Estrutura dos Arquivos Exportados

### Excel

- Nome do arquivo: `relatorio-{tipo}-{data-inicio}-{data-fim}.xlsx`
- Contém uma planilha com os dados do relatório
- Mantém a estrutura original dos dados

### PDF

- Nome do arquivo: `relatorio-{tipo}-{data-inicio}-{data-fim}.pdf`
- Inclui cabeçalho com título e período
- Tabela formatada com cores e estilos
- Dados organizados em colunas

## Tipos de Relatório Suportados

1. **Lucro por Produto**: Análise de lucro individual por produto
2. **Lucro por Categoria**: Análise de lucro por categoria de produtos
3. **Lucro por Período**: Análise de lucro ao longo do tempo
4. **Estoque x Investimento**: Relação entre estoque e investimento
5. **Relatório Completo**: Visão geral completa do negócio

## Tratamento de Erros

- Mensagens de sucesso ao exportar com sucesso
- Mensagens de erro em caso de falha
- Validação de dados antes da exportação
- Tratamento de dados vazios ou inválidos

## Melhorias Futuras

- [ ] Adicionar opções de formatação personalizada
- [ ] Suporte a gráficos nos PDFs
- [ ] Exportação em outros formatos (CSV, JSON)
- [ ] Templates personalizáveis
- [ ] Agendamento de relatórios automáticos
