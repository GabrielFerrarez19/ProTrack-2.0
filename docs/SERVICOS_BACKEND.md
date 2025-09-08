# Serviços Backend - ProTrack 2.0

## Visão Geral

Os serviços backend do ProTrack 2.0 são responsáveis pela lógica de negócio, integração com banco de dados e processamento de dados. Eles seguem o padrão de arquitetura em camadas e implementam as melhores práticas de desenvolvimento.

## Arquitetura dos Serviços

### Padrão de Estrutura

```typescript
// Estrutura base de um serviço
export class BaseService {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  protected async handleError(error: any, context: string) {
    logger.error(`Erro em ${context}:`, error);
    throw new Error(`Erro em ${context}: ${error.message}`);
  }
}
```

## Serviços Principais

### User Service

Gerenciamento de usuários e autenticação:

```typescript
// services/user.service.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

export class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    role: "admin" | "financeiro" | "vendedor" | "operador";
  }) {
    try {
      // Verificar se email já existe
      const existingUser = await this.prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        throw new Error("Email já cadastrado");
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Criar usuário
      const user = await this.prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      this.handleError(error, "createUser");
    }
  }

  async authenticateUser(email: string, password: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user || !user.active) {
        throw new Error("Credenciais inválidas");
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Credenciais inválidas");
      }

      // Gerar JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      this.handleError(error, "authenticateUser");
    }
  }

  async getUsers() {
    try {
      return await this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      this.handleError(error, "getUsers");
    }
  }

  async updateUser(
    id: number,
    userData: Partial<{
      name: string;
      email: string;
      role: string;
      active: boolean;
    }>
  ) {
    try {
      // Verificar se usuário existe
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new Error("Usuário não encontrado");
      }

      // Verificar email único se estiver sendo alterado
      if (userData.email && userData.email !== existingUser.email) {
        const emailExists = await this.prisma.user.findUnique({
          where: { email: userData.email },
        });

        if (emailExists) {
          throw new Error("Email já cadastrado");
        }
      }

      const user = await this.prisma.user.update({
        where: { id },
        data: userData,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      this.handleError(error, "updateUser");
    }
  }

  async deleteUser(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      await this.prisma.user.delete({
        where: { id },
      });

      return { success: true };
    } catch (error) {
      this.handleError(error, "deleteUser");
    }
  }

  private handleError(error: any, context: string) {
    logger.error(`Erro em ${context}:`, error);
    throw new Error(`Erro em ${context}: ${error.message}`);
  }
}
```

### Client Service

Gerenciamento de clientes:

```typescript
// services/client.service.ts
export class ClientService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createClient(clientData: {
    name: string;
    email: string;
    phone: string;
    address: string;
  }) {
    try {
      // Verificar se email já existe
      const existingClient = await this.prisma.client.findUnique({
        where: { email: clientData.email },
      });

      if (existingClient) {
        throw new Error("Email já cadastrado");
      }

      const client = await this.prisma.client.create({
        data: clientData,
      });

      return client;
    } catch (error) {
      this.handleError(error, "createClient");
    }
  }

  async getClients(filters?: {
    search?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const { search, page = 1, limit = 10 } = filters || {};
      const skip = (page - 1) * limit;

      const where = search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          }
        : {};

      const [clients, total] = await Promise.all([
        this.prisma.client.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        this.prisma.client.count({ where }),
      ]);

      return {
        clients,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.handleError(error, "getClients");
    }
  }

  async updateClient(
    id: number,
    clientData: Partial<{
      name: string;
      email: string;
      phone: string;
      address: string;
    }>
  ) {
    try {
      const existingClient = await this.prisma.client.findUnique({
        where: { id },
      });

      if (!existingClient) {
        throw new Error("Cliente não encontrado");
      }

      // Verificar email único se estiver sendo alterado
      if (clientData.email && clientData.email !== existingClient.email) {
        const emailExists = await this.prisma.client.findUnique({
          where: { email: clientData.email },
        });

        if (emailExists) {
          throw new Error("Email já cadastrado");
        }
      }

      const client = await this.prisma.client.update({
        where: { id },
        data: clientData,
      });

      return client;
    } catch (error) {
      this.handleError(error, "updateClient");
    }
  }

  async deleteClient(id: number) {
    try {
      const client = await this.prisma.client.findUnique({
        where: { id },
      });

      if (!client) {
        throw new Error("Cliente não encontrado");
      }

      // Verificar se cliente tem vendas
      const salesCount = await this.prisma.venda.count({
        where: { clienteId: id },
      });

      if (salesCount > 0) {
        throw new Error("Não é possível deletar cliente com vendas associadas");
      }

      await this.prisma.client.delete({
        where: { id },
      });

      return { success: true };
    } catch (error) {
      this.handleError(error, "deleteClient");
    }
  }

  private handleError(error: any, context: string) {
    logger.error(`Erro em ${context}:`, error);
    throw new Error(`Erro em ${context}: ${error.message}`);
  }
}
```

### Product Service

Gerenciamento de produtos:

```typescript
// services/product.service.ts
export class ProductService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createProduct(productData: {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
  }) {
    try {
      const product = await this.prisma.product.create({
        data: productData,
      });

      return product;
    } catch (error) {
      this.handleError(error, "createProduct");
    }
  }

  async getProducts(filters?: {
    search?: string;
    category?: string;
    lowStock?: boolean;
    page?: number;
    limit?: number;
  }) {
    try {
      const {
        search,
        category,
        lowStock,
        page = 1,
        limit = 10,
      } = filters || {};
      const skip = (page - 1) * limit;

      const where: any = {};

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      if (category) {
        where.category = category;
      }

      if (lowStock) {
        where.stock = { lte: 10 }; // Estoque baixo
      }

      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        this.prisma.product.count({ where }),
      ]);

      return {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.handleError(error, "getProducts");
    }
  }

  async updateProduct(
    id: number,
    productData: Partial<{
      name: string;
      description: string;
      price: number;
      stock: number;
      category: string;
    }>
  ) {
    try {
      const existingProduct = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        throw new Error("Produto não encontrado");
      }

      const product = await this.prisma.product.update({
        where: { id },
        data: productData,
      });

      return product;
    } catch (error) {
      this.handleError(error, "updateProduct");
    }
  }

  async updateStock(id: number, newStock: number) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        throw new Error("Produto não encontrado");
      }

      if (newStock < 0) {
        throw new Error("Estoque não pode ser negativo");
      }

      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: { stock: newStock },
      });

      return updatedProduct;
    } catch (error) {
      this.handleError(error, "updateStock");
    }
  }

  async deleteProduct(id: number) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        throw new Error("Produto não encontrado");
      }

      // Verificar se produto tem vendas
      const salesCount = await this.prisma.vendaProduto.count({
        where: { produtoId: id },
      });

      if (salesCount > 0) {
        throw new Error("Não é possível deletar produto com vendas associadas");
      }

      await this.prisma.product.delete({
        where: { id },
      });

      return { success: true };
    } catch (error) {
      this.handleError(error, "deleteProduct");
    }
  }

  private handleError(error: any, context: string) {
    logger.error(`Erro em ${context}:`, error);
    throw new Error(`Erro em ${context}: ${error.message}`);
  }
}
```

### Venda Service

Gerenciamento de vendas:

```typescript
// services/venda.service.ts
export class VendaService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createVenda(vendaData: {
    clienteId: number;
    produtos: Array<{
      produtoId: number;
      quantity: number;
    }>;
    observacoes?: string;
  }) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // Verificar se cliente existe
        const cliente = await tx.client.findUnique({
          where: { id: vendaData.clienteId },
        });

        if (!cliente) {
          throw new Error("Cliente não encontrado");
        }

        // Verificar produtos e estoque
        const produtos = await tx.product.findMany({
          where: {
            id: { in: vendaData.produtos.map((p) => p.produtoId) },
          },
        });

        if (produtos.length !== vendaData.produtos.length) {
          throw new Error("Um ou mais produtos não encontrados");
        }

        // Verificar estoque disponível
        for (const produtoVenda of vendaData.produtos) {
          const produto = produtos.find((p) => p.id === produtoVenda.produtoId);
          if (produto && produto.stock < produtoVenda.quantity) {
            throw new Error(
              `Estoque insuficiente para o produto ${produto.name}`
            );
          }
        }

        // Calcular total
        let total = 0;
        for (const produtoVenda of vendaData.produtos) {
          const produto = produtos.find((p) => p.id === produtoVenda.produtoId);
          if (produto) {
            total += produto.price * produtoVenda.quantity;
          }
        }

        // Criar venda
        const venda = await tx.venda.create({
          data: {
            clienteId: vendaData.clienteId,
            total,
            status: "pendente",
            observacoes: vendaData.observacoes,
          },
        });

        // Criar produtos da venda e atualizar estoque
        for (const produtoVenda of vendaData.produtos) {
          const produto = produtos.find((p) => p.id === produtoVenda.produtoId);

          await tx.vendaProduto.create({
            data: {
              vendaId: venda.id,
              produtoId: produtoVenda.produtoId,
              quantity: produtoVenda.quantity,
              preco: produto!.price,
            },
          });

          // Atualizar estoque
          await tx.product.update({
            where: { id: produtoVenda.produtoId },
            data: {
              stock: { decrement: produtoVenda.quantity },
            },
          });
        }

        // Retornar venda com dados completos
        return await tx.venda.findUnique({
          where: { id: venda.id },
          include: {
            cliente: true,
            produtos: {
              include: {
                produto: true,
              },
            },
          },
        });
      });
    } catch (error) {
      this.handleError(error, "createVenda");
    }
  }

  async getVendas(filters?: {
    status?: string;
    clienteId?: number;
    dataInicio?: string;
    dataFim?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const {
        status,
        clienteId,
        dataInicio,
        dataFim,
        page = 1,
        limit = 10,
      } = filters || {};
      const skip = (page - 1) * limit;

      const where: any = {};

      if (status) {
        where.status = status;
      }

      if (clienteId) {
        where.clienteId = clienteId;
      }

      if (dataInicio || dataFim) {
        where.createdAt = {};
        if (dataInicio) {
          where.createdAt.gte = new Date(dataInicio);
        }
        if (dataFim) {
          where.createdAt.lte = new Date(dataFim);
        }
      }

      const [vendas, total] = await Promise.all([
        this.prisma.venda.findMany({
          where,
          skip,
          take: limit,
          include: {
            cliente: true,
            produtos: {
              include: {
                produto: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
        this.prisma.venda.count({ where }),
      ]);

      return {
        vendas,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.handleError(error, "getVendas");
    }
  }

  async updateVendaStatus(id: number, status: string) {
    try {
      const venda = await this.prisma.venda.findUnique({
        where: { id },
      });

      if (!venda) {
        throw new Error("Venda não encontrada");
      }

      const updatedVenda = await this.prisma.venda.update({
        where: { id },
        data: { status },
      });

      return updatedVenda;
    } catch (error) {
      this.handleError(error, "updateVendaStatus");
    }
  }

  private handleError(error: any, context: string) {
    logger.error(`Erro em ${context}:`, error);
    throw new Error(`Erro em ${context}: ${error.message}`);
  }
}
```

## Serviço de Contas a Pagar

### ContasPagar Service

Sistema inteligente de vencimentos:

```typescript
// services/contasPagar.service.ts
export class ContasPagarService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getContasVencidasHoje() {
    try {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const amanha = new Date(hoje);
      amanha.setDate(amanha.getDate() + 1);

      const contas = await this.prisma.contasPagar.findMany({
        where: {
          dataVencimento: {
            gte: hoje,
            lt: amanha,
          },
          status: "pendente",
        },
        include: {
          fornecedor: true,
        },
        orderBy: {
          dataVencimento: "asc",
        },
      });

      return contas;
    } catch (error) {
      this.handleError(error, "getContasVencidasHoje");
    }
  }

  async getProximosVencimentos() {
    try {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const proximos7Dias = new Date(hoje);
      proximos7Dias.setDate(proximos7Dias.getDate() + 7);

      const contas = await this.prisma.contasPagar.findMany({
        where: {
          dataVencimento: {
            gte: hoje,
            lte: proximos7Dias,
          },
          status: "pendente",
        },
        include: {
          fornecedor: true,
        },
        orderBy: {
          dataVencimento: "asc",
        },
      });

      return contas;
    } catch (error) {
      this.handleError(error, "getProximosVencimentos");
    }
  }

  async getDashboardData() {
    try {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const proximos7Dias = new Date(hoje);
      proximos7Dias.setDate(proximos7Dias.getDate() + 7);

      const [
        totalPendente,
        vencidasHoje,
        proximosVencimentos,
        contasVencidas,
        contasProximas,
      ] = await Promise.all([
        this.prisma.contasPagar.aggregate({
          where: { status: "pendente" },
          _sum: { valor: true },
        }),
        this.prisma.contasPagar.aggregate({
          where: {
            dataVencimento: {
              gte: hoje,
              lt: new Date(hoje.getTime() + 24 * 60 * 60 * 1000),
            },
            status: "pendente",
          },
          _sum: { valor: true },
        }),
        this.prisma.contasPagar.aggregate({
          where: {
            dataVencimento: {
              gte: hoje,
              lte: proximos7Dias,
            },
            status: "pendente",
          },
          _sum: { valor: true },
        }),
        this.prisma.contasPagar.count({
          where: {
            dataVencimento: {
              gte: hoje,
              lt: new Date(hoje.getTime() + 24 * 60 * 60 * 1000),
            },
            status: "pendente",
          },
        }),
        this.prisma.contasPagar.count({
          where: {
            dataVencimento: {
              gte: hoje,
              lte: proximos7Dias,
            },
            status: "pendente",
          },
        }),
      ]);

      return {
        totalPendente: totalPendente._sum.valor || 0,
        vencidasHoje: vencidasHoje._sum.valor || 0,
        proximosVencimentos: proximosVencimentos._sum.valor || 0,
        contasVencidas: contasVencidas,
        contasProximas: contasProximas,
      };
    } catch (error) {
      this.handleError(error, "getDashboardData");
    }
  }

  async createContaPagar(contaData: {
    fornecedorId: number;
    description: string;
    valor: number;
    dataVencimento: string;
  }) {
    try {
      // Verificar se fornecedor existe
      const fornecedor = await this.prisma.fornecedor.findUnique({
        where: { id: contaData.fornecedorId },
      });

      if (!fornecedor) {
        throw new Error("Fornecedor não encontrado");
      }

      const conta = await this.prisma.contasPagar.create({
        data: {
          ...contaData,
          dataVencimento: new Date(contaData.dataVencimento),
          status: "pendente",
        },
        include: {
          fornecedor: true,
        },
      });

      return conta;
    } catch (error) {
      this.handleError(error, "createContaPagar");
    }
  }

  async updateContaPagar(
    id: number,
    contaData: Partial<{
      description: string;
      valor: number;
      dataVencimento: string;
      status: string;
    }>
  ) {
    try {
      const existingConta = await this.prisma.contasPagar.findUnique({
        where: { id },
      });

      if (!existingConta) {
        throw new Error("Conta a pagar não encontrada");
      }

      const updateData = { ...contaData };
      if (contaData.dataVencimento) {
        updateData.dataVencimento = new Date(contaData.dataVencimento);
      }

      const conta = await this.prisma.contasPagar.update({
        where: { id },
        data: updateData,
        include: {
          fornecedor: true,
        },
      });

      return conta;
    } catch (error) {
      this.handleError(error, "updateContaPagar");
    }
  }

  async markAsPaid(id: number) {
    try {
      const conta = await this.prisma.contasPagar.findUnique({
        where: { id },
      });

      if (!conta) {
        throw new Error("Conta a pagar não encontrada");
      }

      const updatedConta = await this.prisma.contasPagar.update({
        where: { id },
        data: { status: "paga" },
        include: {
          fornecedor: true,
        },
      });

      return updatedConta;
    } catch (error) {
      this.handleError(error, "markAsPaid");
    }
  }

  private handleError(error: any, context: string) {
    logger.error(`Erro em ${context}:`, error);
    throw new Error(`Erro em ${context}: ${error.message}`);
  }
}
```

## Serviços de Monitoramento

### VendasMonitoramento Service

Monitoramento automático de vendas:

```typescript
// services/vendasMonitoramento.service.ts
export class VendasMonitoramentoService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async updateVendasStatus() {
    try {
      const hoje = new Date();
      const vencimentoLimite = new Date(hoje);
      vencimentoLimite.setDate(vencimentoLimite.getDate() - 30); // 30 dias atrás

      // Buscar vendas pendentes há mais de 30 dias
      const vendasVencidas = await this.prisma.venda.findMany({
        where: {
          status: "pendente",
          createdAt: {
            lte: vencimentoLimite,
          },
        },
      });

      // Atualizar status para 'vencida'
      const updatePromises = vendasVencidas.map((venda) =>
        this.prisma.venda.update({
          where: { id: venda.id },
          data: { status: "vencida" },
        })
      );

      await Promise.all(updatePromises);

      logger.info(
        `Atualizadas ${vendasVencidas.length} vendas para status 'vencida'`
      );

      return {
        success: true,
        updatedCount: vendasVencidas.length,
      };
    } catch (error) {
      this.handleError(error, "updateVendasStatus");
    }
  }

  private handleError(error: any, context: string) {
    logger.error(`Erro em ${context}:`, error);
    throw new Error(`Erro em ${context}: ${error.message}`);
  }
}
```

### ContasPagarMonitoramento Service

Monitoramento automático de contas a pagar:

```typescript
// services/contasPagarMonitoramento.service.ts
export class ContasPagarMonitoramentoService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async updateContasStatus() {
    try {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      // Buscar contas pendentes vencidas
      const contasVencidas = await this.prisma.contasPagar.findMany({
        where: {
          status: "pendente",
          dataVencimento: {
            lt: hoje,
          },
        },
      });

      // Atualizar status para 'vencida'
      const updatePromises = contasVencidas.map((conta) =>
        this.prisma.contasPagar.update({
          where: { id: conta.id },
          data: { status: "vencida" },
        })
      );

      await Promise.all(updatePromises);

      logger.info(
        `Atualizadas ${contasVencidas.length} contas para status 'vencida'`
      );

      return {
        success: true,
        updatedCount: contasVencidas.length,
      };
    } catch (error) {
      this.handleError(error, "updateContasStatus");
    }
  }

  private handleError(error: any, context: string) {
    logger.error(`Erro em ${context}:`, error);
    throw new Error(`Erro em ${context}: ${error.message}`);
  }
}
```

## Serviço de Relatórios

### Relatorio Service

Geração e exportação de relatórios:

```typescript
// services/relatorio.service.ts
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export class RelatorioService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async generateVendasRelatorio(filters: {
    dataInicio?: string;
    dataFim?: string;
    clienteId?: number;
    status?: string;
  }) {
    try {
      const where: any = {};

      if (filters.dataInicio || filters.dataFim) {
        where.createdAt = {};
        if (filters.dataInicio) {
          where.createdAt.gte = new Date(filters.dataInicio);
        }
        if (filters.dataFim) {
          where.createdAt.lte = new Date(filters.dataFim);
        }
      }

      if (filters.clienteId) {
        where.clienteId = filters.clienteId;
      }

      if (filters.status) {
        where.status = filters.status;
      }

      const vendas = await this.prisma.venda.findMany({
        where,
        include: {
          cliente: true,
          produtos: {
            include: {
              produto: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return vendas;
    } catch (error) {
      this.handleError(error, "generateVendasRelatorio");
    }
  }

  async generateContasPagarRelatorio(filters: {
    status?: string;
    fornecedorId?: number;
    dataInicio?: string;
    dataFim?: string;
  }) {
    try {
      const where: any = {};

      if (filters.status) {
        where.status = filters.status;
      }

      if (filters.fornecedorId) {
        where.fornecedorId = filters.fornecedorId;
      }

      if (filters.dataInicio || filters.dataFim) {
        where.dataVencimento = {};
        if (filters.dataInicio) {
          where.dataVencimento.gte = new Date(filters.dataInicio);
        }
        if (filters.dataFim) {
          where.dataVencimento.lte = new Date(filters.dataFim);
        }
      }

      const contas = await this.prisma.contasPagar.findMany({
        where,
        include: {
          fornecedor: true,
        },
        orderBy: { dataVencimento: "asc" },
      });

      return contas;
    } catch (error) {
      this.handleError(error, "generateContasPagarRelatorio");
    }
  }

  async exportToExcel(data: any[], filename: string) {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");

      return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    } catch (error) {
      this.handleError(error, "exportToExcel");
    }
  }

  async exportToPDF(data: any[], filename: string) {
    try {
      const doc = new jsPDF("landscape", "mm", "a4");

      doc.autoTable({
        head: [Object.keys(data[0])],
        body: data.map((row) => Object.values(row)),
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] },
      });

      return doc.output("arraybuffer");
    } catch (error) {
      this.handleError(error, "exportToPDF");
    }
  }

  private handleError(error: any, context: string) {
    logger.error(`Erro em ${context}:`, error);
    throw new Error(`Erro em ${context}: ${error.message}`);
  }
}
```

## Serviço de Configuração

### Config Service

Gerenciamento de configurações do sistema:

```typescript
// services/config.service.ts
export class ConfigService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getConfig(key: string) {
    try {
      const config = await this.prisma.config.findUnique({
        where: { key },
      });

      return config?.value || null;
    } catch (error) {
      this.handleError(error, "getConfig");
    }
  }

  async setConfig(key: string, value: string) {
    try {
      const config = await this.prisma.config.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });

      return config;
    } catch (error) {
      this.handleError(error, "setConfig");
    }
  }

  async getAllConfigs() {
    try {
      const configs = await this.prisma.config.findMany();

      return configs.reduce((acc, config) => {
        acc[config.key] = config.value;
        return acc;
      }, {} as Record<string, string>);
    } catch (error) {
      this.handleError(error, "getAllConfigs");
    }
  }

  private handleError(error: any, context: string) {
    logger.error(`Erro em ${context}:`, error);
    throw new Error(`Erro em ${context}: ${error.message}`);
  }
}
```

## Serviço de Pagamento

### Pagamento Service

Gerenciamento de pagamentos:

```typescript
// services/pagamento.service.ts
export class PagamentoService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async processarPagamento(pagamentoData: {
    contaId: number;
    valor: number;
    dataPagamento: string;
    metodo: string;
    observacoes?: string;
  }) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // Verificar se conta existe
        const conta = await tx.contasPagar.findUnique({
          where: { id: pagamentoData.contaId },
        });

        if (!conta) {
          throw new Error("Conta não encontrada");
        }

        if (conta.status === "paga") {
          throw new Error("Conta já foi paga");
        }

        // Criar registro de pagamento
        const pagamento = await tx.pagamento.create({
          data: {
            contaId: pagamentoData.contaId,
            valor: pagamentoData.valor,
            dataPagamento: new Date(pagamentoData.dataPagamento),
            metodo: pagamentoData.metodo,
            observacoes: pagamentoData.observacoes,
          },
        });

        // Atualizar status da conta
        await tx.contasPagar.update({
          where: { id: pagamentoData.contaId },
          data: { status: "paga" },
        });

        return pagamento;
      });
    } catch (error) {
      this.handleError(error, "processarPagamento");
    }
  }

  async getPagamentos(filters?: {
    contaId?: number;
    dataInicio?: string;
    dataFim?: string;
    metodo?: string;
  }) {
    try {
      const where: any = {};

      if (filters?.contaId) {
        where.contaId = filters.contaId;
      }

      if (filters?.metodo) {
        where.metodo = filters.metodo;
      }

      if (filters?.dataInicio || filters?.dataFim) {
        where.dataPagamento = {};
        if (filters.dataInicio) {
          where.dataPagamento.gte = new Date(filters.dataInicio);
        }
        if (filters.dataFim) {
          where.dataPagamento.lte = new Date(filters.dataFim);
        }
      }

      const pagamentos = await this.prisma.pagamento.findMany({
        where,
        include: {
          conta: {
            include: {
              fornecedor: true,
            },
          },
        },
        orderBy: { dataPagamento: "desc" },
      });

      return pagamentos;
    } catch (error) {
      this.handleError(error, "getPagamentos");
    }
  }

  private handleError(error: any, context: string) {
    logger.error(`Erro em ${context}:`, error);
    throw new Error(`Erro em ${context}: ${error.message}`);
  }
}
```

## Conclusão

Os serviços backend do ProTrack 2.0 implementam uma arquitetura robusta e escalável, com separação clara de responsabilidades, tratamento de erros consistente e otimizações de performance. O sistema inteligente de vencimentos é uma das principais inovações, proporcionando gestão financeira proativa e eficiente.

Cada serviço é tipado com TypeScript, inclui validações adequadas e implementa transações de banco de dados quando necessário. A estrutura modular permite fácil manutenção e extensão do sistema.

### Características Principais:

- **Arquitetura em Camadas**: Separação clara entre lógica de negócio e acesso a dados
- **Transações de Banco**: Uso de transações para operações críticas
- **Tratamento de Erros**: Sistema consistente de tratamento e logging de erros
- **Validações**: Validações robustas de dados e regras de negócio
- **Performance**: Otimizações de consultas e uso de índices
- **Segurança**: Validação de permissões e sanitização de dados
- **Monitoramento**: Sistema de logs e métricas para acompanhamento
