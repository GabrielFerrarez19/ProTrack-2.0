# 🔧 Solução de Problemas - Exportação PDF

## ❌ Problemas Comuns e Soluções

### 1. **Erro: "jsPDF não está disponível"**

**Sintoma**: Erro ao tentar criar PDF
**Solução**:

```bash
# Reinstalar dependências
npm install jspdf@2.5.1 jspdf-autotable@3.8.2 --save
```

### 2. **Erro: "autoTable não está disponível"**

**Sintoma**: Erro ao tentar adicionar tabela
**Solução**:

```bash
# Verificar se o import está correto
import jsPDF from "jspdf";
import "jspdf-autotable";
```

### 3. **PDF não é gerado**

**Sintoma**: Nenhum arquivo é baixado
**Solução**:

1. Verificar se o navegador permite downloads
2. Verificar se há dados no relatório
3. Verificar console do navegador para erros

### 4. **Erro de CORS**

**Sintoma**: Erro de Cross-Origin
**Solução**:

1. Verificar se o servidor está rodando
2. Verificar configurações de CORS no backend

## 🧪 Teste Manual

### 1. **Teste Básico**

Abra o arquivo `test-pdf.html` no navegador e clique em "Gerar PDF de Teste"

### 2. **Verificar Console**

Abra o DevTools (F12) e verifique:

- Erros no console
- Logs de debug
- Network requests

### 3. **Verificar Dados**

Certifique-se de que:

- As datas estão preenchidas
- O tipo de relatório está selecionado
- Há dados para o período selecionado

## 🔍 Debugging

### 1. **Logs de Debug**

O sistema agora inclui logs detalhados:

```
Iniciando exportação PDF...
Buscando relatório por tipo: lucro-produto
Dados do relatório recebidos: [...]
Headers preparados: [...]
Data preparada: [...]
Criando instância do PDF...
PDF criado com sucesso
Adicionando título...
Adicionando tabela...
Tabela adicionada com sucesso
Salvando PDF como: relatorio-lucro-produto-2024-01-01-2024-01-31.pdf
PDF salvo com sucesso
```

### 2. **Verificar Dependências**

```bash
# Verificar versões instaladas
npm list jspdf jspdf-autotable
```

### 3. **Limpar Cache**

```bash
# Limpar cache do npm
npm cache clean --force

# Reinstalar node_modules
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Soluções Rápidas

### 1. **Reiniciar Servidor**

```bash
# Parar servidor (Ctrl+C)
# Reiniciar
npm run dev
```

### 2. **Verificar Navegador**

- Use Chrome ou Firefox
- Desabilite bloqueadores de popup
- Permita downloads

### 3. **Verificar Dados**

- Selecione um período com dados
- Teste com "Relatório Completo"
- Verifique se há produtos/clientes cadastrados

## 📞 Suporte

Se o problema persistir:

1. **Capture os logs** do console
2. **Anote o erro exato** que aparece
3. **Verifique se há dados** no período selecionado
4. **Teste com o arquivo HTML** de teste

### Contatos

- **Email**: suporte@protrack.com
- **WhatsApp**: (11) 99999-9999

---

**ProTrack 2.0** - Solução de problemas PDF 🔧
