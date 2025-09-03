# Backend do Fluxo de Caixa - ProTrack 2.0

## 📋 Visão Geral

Este backend foi criado para suportar a página de Fluxo de Caixa do ProTrack 2.0, fornecendo APIs para gerenciar movimentações financeiras, categorias, e análises de fluxo de caixa.

## 🗄️ Estrutura do Banco de Dados

### Tabelas Criadas

#### 1. `movimentacoes_financeiras`

- Gerencia entradas e saídas financeiras
- Campos: tipo, categoria, descrição, valor, datas, status, forma de pagamento
- Relacionamentos com vendas, clientes e fornecedores

#### 2. `fornecedores`

- Cadastro de fornecedores para despesas
- Campos: nome, CNPJ, email, telefone, endereço

#### 3. `contas_bancarias`

- Controle de contas bancárias
- Campos: nome, banco, agência, conta, saldo inicial

#### 4. `categorias` (estendida)

- Categorias para receitas e despesas
- Campos: nome, tipo, cor, datas de criação/atualização

## 🚀 APIs Disponíveis

### Base URL: `/fluxo-caixa`

#### 📊 Dados de Análise

- `GET /resumo` - Resumo geral do fluxo de caixa
- `GET /historico` - Fluxo de caixa histórico
- `GET /projecao` - Projeção futura
- `GET /categorias-entrada` - Categorias de entrada
- `GET /categorias-saida` - Categorias de saída
- `GET /comparativo-periodos` - Comparativo entre períodos
- `GET /dados-completos` - Todos os dados de uma vez (otimizado)

#### 🔧 Gerenciamento de Movimentações

- `POST /movimentacoes` - Criar nova movimentação
- `PUT /movimentacoes/:id` - Atualizar movimentação
- `DELETE /movimentacoes/:id` - Excluir movimentação

## 📝 Parâmetros de Filtro

### Filtros Disponíveis

- `periodo`: `7dias` | `30dias` | `90dias` | `1ano`
- `tipo_visualizacao`: `diario` | `semanal` | `mensal`

### Exemplo de Uso

```typescript
// Obter dados para os últimos 30 dias com visualização diária
GET /fluxo-caixa/dados-completos?periodo=30dias&tipo_visualizacao=diario
```

## 🔌 Integração com Frontend

### Hook React (`useFluxoCaixa`)

```typescript
import { useFluxoCaixa } from "../hooks/useFluxoCaixa";

const { dados, loading, error, obterDadosCompletos } = useFluxoCaixa();
```

### Exemplo de Uso no Componente

```typescript
useEffect(() => {
  obterDadosCompletos({
    periodo: "30dias",
    tipo_visualizacao: "diario",
  });
}, [periodo, tipoVisualizacao]);
```

## 🛠️ Instalação e Configuração

### 1. Executar Scripts SQL

```bash
# Executar o arquivo protrack.sql no seu banco MySQL
mysql -u usuario -p protrack < protrack.sql
```

### 2. Instalar Dependências

```bash
cd protrack-server
npm install
```

### 3. Configurar Variáveis de Ambiente

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/protrack"
```

### 4. Executar Migrações (se usar Prisma)

```bash
npx prisma migrate dev
```

## 📊 Funcionalidades Principais

### 1. **Resumo do Fluxo de Caixa**

- Saldo atual
- Total de entradas e saídas no período
- Projeção para os próximos 30 dias

### 2. **Fluxo Histórico**

- Dados agrupados por período (diário/semanal/mensal)
- Cálculo automático de saldo acumulado
- Filtros por período de tempo

### 3. **Projeção Futura**

- Baseada em movimentações pendentes
- Projeção de saldo para os próximos 30 dias
- Considera vencimentos futuros

### 4. **Análise por Categorias**

- Percentual de cada categoria no total
- Separação entre receitas e despesas
- Cálculo automático de percentuais

### 5. **Comparativo de Períodos**

- Este mês vs. mês anterior
- Comparação com mesmo mês do ano anterior
- Análise de tendências

## 🔒 Segurança e Validações

- Validação de dados obrigatórios
- Tratamento de erros robusto
- Logs de erro para debugging
- Validação de tipos de dados

## 📈 Performance

- Queries otimizadas com agregações
- Endpoint `/dados-completos` para carregar tudo de uma vez
- Cache de dados no frontend
- Filtros aplicados no banco de dados

## 🐛 Troubleshooting

### Erros Comuns

1. **Erro de Conexão com Banco**

   - Verificar DATABASE_URL
   - Confirmar se o banco está rodando

2. **Erro de Tabela Não Encontrada**

   - Executar scripts SQL
   - Verificar se as migrações foram aplicadas

3. **Dados Não Carregando**
   - Verificar logs do servidor
   - Confirmar se as rotas estão registradas

### Logs Úteis

```bash
# Ver logs do servidor
tail -f protrack-server/logs/app.log

# Ver erros específicos
grep "Erro ao obter" protrack-server/logs/app.log
```

## 🔄 Próximos Passos

1. **Implementar Autenticação**

   - Middleware de autenticação
   - Controle de acesso por usuário

2. **Adicionar Cache**

   - Redis para cache de dados
   - Invalidação automática

3. **Relatórios Avançados**

   - Exportação para PDF/Excel
   - Gráficos mais detalhados

4. **Notificações**
   - Alertas de saldo baixo
   - Lembretes de vencimentos

## 📞 Suporte

Para dúvidas ou problemas:

- Verificar logs do servidor
- Consultar documentação da API
- Abrir issue no repositório

---

**Desenvolvido para ProTrack 2.0** 🚀
