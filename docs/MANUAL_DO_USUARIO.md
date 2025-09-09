# Manual do Usuário - ProTrack 2.0

## Introdução

Bem-vindo ao ProTrack 2.0! Este manual irá guiá-lo através de todas as funcionalidades do sistema, desde o primeiro acesso até o uso avançado de todas as ferramentas disponíveis.

## Primeiros Passos

### Acesso ao Sistema

1. **Login**: Acesse o sistema através do navegador
2. **Credenciais**: Use seu email e senha fornecidos pelo administrador
3. **Primeiro Acesso**: Altere sua senha no primeiro login

### Interface Principal

A interface do ProTrack 2.0 é intuitiva e responsiva, adaptando-se a diferentes tamanhos de tela:

- **Menu Lateral (Sidebar)**: Navegação principal do sistema com ícones e permissões por role
- **Barra Superior (Header)**: Informações do usuário, notificações e logout
- **Área de Trabalho**: Conteúdo principal de cada módulo
- **Sistema de Notificações**: Toast notifications com Sonner para feedback do usuário
- **Design Responsivo**: Interface adaptável para desktop, tablet e mobile

## Sistema de Permissões

O ProTrack 2.0 possui um sistema robusto de permissões baseado em roles (funções):

### Tipos de Usuário

#### **Administrador (Admin)**

- Acesso completo a todas as funcionalidades
- Gerenciamento de usuários e configurações
- Relatórios e análises avançadas

#### **Financeiro**

- Acesso ao módulo financeiro
- Gestão de contas a pagar e receber
- Relatórios financeiros
- Dashboard com métricas financeiras

#### **Vendedor**

- Acesso ao módulo de vendas
- Criação e gestão de vendas
- Visualização de relatórios de vendas
- Acesso ao dashboard de vendas

#### **Operador**

- Cadastro de produtos e clientes
- Gestão de estoque
- Visualização de relatórios básicos
- Acesso limitado ao dashboard

### Controle de Acesso

- **Rotas Protegidas**: Cada página verifica as permissões do usuário
- **Menu Dinâmico**: Apenas funcionalidades permitidas aparecem no menu
- **Validação de Ações**: Operações são validadas no backend
- **Sessão Segura**: Autenticação JWT com renovação automática

## Módulos do Sistema

### 1. Dashboard

O Dashboard é sua central de informações, fornecendo uma visão geral do negócio:

#### Visão Geral (Status)

- **Resumo de Vendas**: Total de vendas do período com vendas em aberto
- **Clientes Ativos**: Número de clientes cadastrados
- **Produtos em Estoque**: Valor total investido em estoque
- **Contas a Pagar**: Resumo financeiro com vencimentos
- **Giro de Estoque**: Análise de rotatividade de produtos
- **Margem de Lucro**: Produtos com melhor margem e distribuição

#### Gráficos e Relatórios

- **Evolução de Lucro Mensal**: Gráfico de lucros por mês
- **Valor Investido por Categoria**: Distribuição de investimento
- **Distribuição de Margem de Lucro**: Análise de rentabilidade
- **Top Produtos**: Produtos mais vendidos e com melhor margem
- **Vendas em Aberto**: Controle de vendas pendentes

### 2. Módulo de Vendas

#### Gerenciar Vendas

1. **Nova Venda**:

   - Selecione o cliente
   - Adicione produtos
   - Defina quantidades
   - Aplique descontos (se autorizado)
   - Confirme a venda

2. **Listar Vendas**:

   - Visualize todas as vendas
   - Use filtros para encontrar vendas específicas
   - Ordene por data, valor ou status
   - Exporte relatórios

3. **Editar Venda**:
   - Clique na venda desejada
   - Modifique os dados necessários
   - Salve as alterações

#### Status de Vendas

- **Pendente**: Venda criada, aguardando confirmação
- **Confirmada**: Venda confirmada pelo cliente
- **Enviada**: Produto enviado
- **Entregue**: Produto entregue
- **Cancelada**: Venda cancelada

### 3. Módulo de Clientes

#### Cadastro de Clientes

1. **Novo Cliente**:

   - Nome completo
   - Email e telefone
   - Endereço completo
   - Observações (opcional)

2. **Editar Cliente**:
   - Acesse a lista de clientes
   - Clique no cliente desejado
   - Modifique as informações
   - Salve as alterações

#### Histórico do Cliente

- **Vendas Realizadas**: Histórico completo de compras
- **Valor Total**: Total gasto pelo cliente
- **Última Compra**: Data da última venda
- **Status**: Cliente ativo ou inativo

### 4. Módulo de Produtos

#### Gerenciar Produtos

1. **Novo Produto**:

   - Nome do produto
   - Descrição detalhada
   - Preço de venda
   - Quantidade em estoque
   - Categoria
   - Código de barras (opcional)

2. **Controle de Estoque**:
   - Visualize produtos com estoque baixo
   - Atualize quantidades
   - Receba alertas de reposição

#### Categorias

- **Organize Produtos**: Agrupe por categoria
- **Filtros**: Encontre produtos rapidamente
- **Relatórios**: Análise por categoria

### 5. Módulo de Contas a Pagar

#### Sistema Inteligente de Vencimentos

O ProTrack 2.0 inclui um sistema inovador para gestão de contas a pagar:

##### Dashboard de Contas

- **Cards de Resumo**: Total pendente, vencido, agendado e total geral
- **Monitoramento de Vencimentos**: Contas que vencem hoje e nos próximos 7 dias
- **Status de Monitoramento**: Sistema automático de atualização de status
- **Filtros Avançados**: Por status, categoria, fornecedor e período

##### Contas Vencidas Hoje

- **Identificação Automática**: Sistema identifica contas vencidas hoje
- **Alertas Visuais**: Destaque especial para contas vencidas
- **Ações Rápidas**: Marcar como paga ou reagendar
- **Cálculo de Dias de Atraso**: Contagem automática de dias em atraso

##### Próximos Vencimentos (7 dias)

- **Prevenção**: Identifica contas que vencem nos próximos 7 dias
- **Planejamento**: Permite planejamento antecipado de pagamentos
- **Alertas**: Notificações automáticas de vencimentos próximos
- **Projeções**: Análise de fluxo de caixa futuro

##### Dashboard Proativo

- **Visão Consolidada**: Resumo de todas as obrigações financeiras
- **Métricas em Tempo Real**: Valores atualizados automaticamente
- **Tendências**: Gráficos de vencimentos
- **Exportação**: Relatórios em PDF e Excel

#### Gerenciar Contas a Pagar

1. **Nova Conta**:

   - Selecione o fornecedor
   - Descrição da conta
   - Valor a pagar
   - Data de vencimento
   - Observações

2. **Marcar como Paga**:

   - Acesse a conta
   - Clique em "Marcar como Paga"
   - Confirme o pagamento

3. **Reagendar Vencimento**:
   - Acesse a conta
   - Clique em "Reagendar"
   - Defina nova data
   - Salve as alterações

#### Gestão de Fornecedores

- **Cadastro Completo**: Dados do fornecedor
- **Histórico**: Contas pagas e pendentes
- **Contato**: Informações de contato
- **Relatórios**: Análise por fornecedor

### 6. Módulo de Relatórios

#### Tipos de Relatórios

1. **Relatório de Vendas**:

   - Vendas por período
   - Vendas por cliente
   - Vendas por produto
   - Análise de performance

2. **Relatório de Contas a Pagar**:

   - Contas vencidas
   - Próximos vencimentos
   - Análise por fornecedor
   - Fluxo de pagamentos

3. **Relatório de Estoque**:
   - Produtos em estoque
   - Produtos com estoque baixo
   - Movimentação de estoque
   - Análise de rotatividade

#### Exportação de Relatórios

- **Excel**: Exporte para planilhas
- **PDF**: Gere relatórios em PDF
- **Filtros**: Personalize os dados
- **Agendamento**: Configure relatórios automáticos

### 7. Módulo de Usuários

#### Gerenciar Usuários

1. **Novo Usuário**:

   - Nome completo
   - Email
   - Senha temporária
   - Nível de acesso

2. **Níveis de Acesso**:
   - **Admin**: Acesso total ao sistema
   - **Financeiro**: Acesso a módulos financeiros
   - **Vendedor**: Acesso a vendas e clientes
   - **Operador**: Acesso limitado

## Sistema de Permissões

### Níveis de Acesso

#### Admin

- **Acesso Completo**: Todos os módulos e funcionalidades
- **Gerenciamento de Usuários**: Criar, editar e excluir usuários
- **Configurações do Sistema**: Acesso a configurações avançadas
- **Relatórios Avançados**: Todos os tipos de relatórios
- **Auditoria**: Visualizar logs de atividades

#### Financeiro

- **Contas a Pagar**: Acesso completo ao módulo financeiro
- **Relatórios Financeiros**: Relatórios de vendas e contas a pagar
- **Dashboard Financeiro**: Visão geral das finanças
- **Exportação**: Exportar relatórios em Excel e PDF
- **Fornecedores**: Gerenciar cadastro de fornecedores

#### Vendedor

- **Vendas**: Criar, editar e visualizar vendas
- **Clientes**: Gerenciar cadastro de clientes
- **Produtos**: Visualizar produtos e estoque
- **Relatórios de Vendas**: Relatórios específicos de vendas
- **Dashboard de Vendas**: Visão geral das vendas

#### Operador

- **Consulta**: Visualizar dados (sem edição)
- **Relatórios Básicos**: Relatórios simples
- **Dashboard Limitado**: Visão básica do sistema

### Controle de Acesso

#### Rotas Protegidas

- **Middleware de Autenticação**: Verificação de token JWT
- **Verificação de Permissões**: Validação de nível de acesso
- **Redirecionamento**: Usuários sem permissão são redirecionados

#### Funcionalidades por Nível

- **Interface Adaptativa**: Menu e botões baseados em permissões
- **Validação Frontend**: Controle de acesso na interface
- **Validação Backend**: Verificação de permissões na API

#### Auditoria

- **Log de Ações**: Registro de todas as ações do usuário
- **Timestamp**: Data e hora de cada ação
- **Detalhes**: Informações sobre a ação realizada
- **Rastreabilidade**: Histórico completo de atividades

## Funcionalidades Avançadas

### Monitoramento Automático

#### Alertas Automáticos

- **Contas Vencidas**: Notificações de contas vencidas
- **Estoque Baixo**: Alertas de reposição
- **Vendas Pendentes**: Lembrete de follow-up
- **Sistema**: Notificações de manutenção

#### Scripts de Automação

- **Atualização de Status**: Status automático de vendas
- **Contas a Pagar**: Atualização de status de vencimento
- **Relatórios**: Geração automática de relatórios
- **Backup**: Backup automático de dados

### Sistema Inteligente de Vencimentos

#### Funcionalidades Principais

1. **Cálculo Automático de Vencimentos**:

   - Identifica contas vencidas hoje
   - Calcula próximos vencimentos (7 dias)
   - Atualiza status automaticamente
   - Gera alertas preventivos

2. **Dashboard Proativo**:

   - Resumo visual da situação financeira
   - Gráficos de vencimentos
   - Alertas coloridos por prioridade
   - Ações rápidas disponíveis

3. **Gestão de Fornecedores**:
   - Cadastro completo de fornecedores
   - Histórico de pagamentos
   - Análise de relacionamento
   - Relatórios por fornecedor

#### Benefícios para o Usuário

- **Prevenção de Multas**: Evita pagamentos em atraso
- **Planejamento Financeiro**: Organiza pagamentos antecipadamente
- **Eficiência Operacional**: Reduz tempo de gestão financeira
- **Tomada de Decisão**: Informações em tempo real

## Dicas e Boas Práticas

### Organização de Dados

1. **Mantenha Dados Atualizados**: Sempre atualize informações
2. **Use Categorias**: Organize produtos e clientes
3. **Documente Observações**: Adicione notas importantes
4. **Backup Regular**: Faça backup dos dados

### Uso Eficiente

1. **Filtros**: Use filtros para encontrar informações rapidamente
2. **Exportação**: Exporte relatórios regularmente
3. **Alertas**: Configure alertas para não perder prazos
4. **Treinamento**: Mantenha a equipe treinada

### Segurança

1. **Senhas Fortes**: Use senhas seguras
2. **Logout**: Sempre faça logout ao terminar
3. **Permissões**: Mantenha permissões adequadas
4. **Auditoria**: Monitore ações dos usuários

## Solução de Problemas

### Problemas Comuns

1. **Não Consigo Fazer Login**:

   - Verifique email e senha
   - Contate o administrador
   - Verifique conexão com internet

2. **Dados Não Aparecem**:

   - Verifique filtros aplicados
   - Atualize a página
   - Verifique permissões

3. **Relatórios Não Geram**:

   - Verifique dados disponíveis
   - Tente formato diferente
   - Contate suporte técnico

4. **Permissões Insuficientes**:
   - Verifique seu nível de acesso
   - Contate o administrador
   - Solicite permissões necessárias

### Contato de Suporte

- **Email**: suporte@protrack.com
- **Telefone**: (11) 99999-9999
- **Horário**: Segunda a Sexta, 8h às 18h
- **Documentação**: Consulte a documentação técnica

## Atualizações e Novidades

### Versão 2.0

- **Sistema Inteligente de Vencimentos**: Nova funcionalidade
- **Interface Modernizada**: Design mais intuitivo
- **Performance Melhorada**: Sistema mais rápido
- **Novos Relatórios**: Mais opções de análise
- **Sistema de Permissões Aprimorado**: Controle mais granular

### Próximas Atualizações

- **App Mobile**: Versão para dispositivos móveis
- **Integração com E-commerce**: Conexão com lojas online
- **IA para Previsões**: Inteligência artificial para previsões
- **API Pública**: Integração com outros sistemas

## Fluxos de Trabalho

### Fluxo de Vendas

1. **Cadastro do Cliente** (se necessário)
2. **Seleção de Produtos**
3. **Cálculo de Total**
4. **Aplicação de Descontos** (se autorizado)
5. **Confirmação da Venda**
6. **Atualização de Estoque**
7. **Geração de Relatório**

### Fluxo de Contas a Pagar

1. **Cadastro do Fornecedor** (se necessário)
2. **Criação da Conta**
3. **Definição de Vencimento**
4. **Monitoramento Automático**
5. **Alertas de Vencimento**
6. **Pagamento**
7. **Atualização de Status**

### Fluxo de Relatórios

1. **Seleção do Tipo de Relatório**
2. **Definição de Filtros**
3. **Configuração de Período**
4. **Geração do Relatório**
5. **Visualização**
6. **Exportação** (se necessário)

## Personalização

### Configurações do Usuário

- **Perfil**: Atualizar dados pessoais
- **Senha**: Alterar senha de acesso
- **Preferências**: Configurar interface
- **Notificações**: Definir alertas

### Configurações do Sistema

- **Empresa**: Dados da empresa
- **Moeda**: Configurar moeda padrão
- **Formato de Data**: Definir formato de datas
- **Backup**: Configurar backup automático

## Integração com Outros Sistemas

### APIs Disponíveis

- **REST API**: Integração com sistemas externos
- **Webhooks**: Notificações em tempo real
- **Exportação**: Dados em formatos padrão
- **Importação**: Carregamento de dados externos

### Formatos Suportados

- **Excel**: Importação e exportação
- **CSV**: Dados tabulares
- **JSON**: Dados estruturados
- **PDF**: Relatórios formatados

## Conclusão

O ProTrack 2.0 é uma ferramenta poderosa para gestão empresarial. Com este manual, você tem todas as informações necessárias para aproveitar ao máximo todas as funcionalidades do sistema.

O sistema de permissões garante que cada usuário tenha acesso apenas às funcionalidades necessárias para seu trabalho, mantendo a segurança e organização dos dados.

Para dúvidas específicas ou suporte técnico, não hesite em entrar em contato com nossa equipe de suporte.
