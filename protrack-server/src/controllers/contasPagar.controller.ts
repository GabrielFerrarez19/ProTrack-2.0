import { Request, Response } from "express";
import {
  criarConta,
  listarContas,
  buscarContaPorId,
  atualizarConta,
  excluirConta,
  marcarComoPaga,
  obterResumo,
  criarFornecedor,
  listarFornecedores,
  buscarFornecedorPorId,
  atualizarFornecedor,
  excluirFornecedor,
  atualizarStatusContas,
  buscarContasVencimento,
} from "../services/contasPagar.service";
import {
  ContaPagarCreateRequest,
  ContaPagarUpdateRequest,
  ContaPagarFiltros,
  FornecedorCreateRequest,
  FornecedorUpdateRequest,
} from "../@types/types.service";

// ===== CONTAS A PAGAR =====

export const criarContaController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data: ContaPagarCreateRequest = req.body;

    // Validações básicas
    if (
      !data.fornecedor_nome ||
      !data.valor ||
      !data.data_vencimento ||
      !data.categoria_id ||
      !data.descricao
    ) {
      res.status(400).json({
        success: false,
        message:
          "Campos obrigatórios: fornecedor_nome, valor, data_vencimento, categoria_id, descricao",
      });
      return;
    }

    if (data.valor <= 0) {
      res.status(400).json({
        success: false,
        message: "Valor deve ser maior que zero",
      });
      return;
    }

    const conta = await criarConta(data);

    res.status(201).json({
      success: true,
      message: "Conta criada com sucesso",
      data: conta,
    });
  } catch (error) {
    console.error("Erro ao criar conta:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const listarContasController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const filtros: ContaPagarFiltros = {
      search: req.query.search as string,
      status: req.query.status as string,
      categoria_id: req.query.categoria_id as string,
      data_inicio: req.query.data_inicio as string,
      data_fim: req.query.data_fim as string,
      fornecedor_id: req.query.fornecedor_id as string,
    };

    const contas = await listarContas(filtros);

    res.status(200).json({
      success: true,
      message: "Contas listadas com sucesso",
      data: contas,
      total: contas.length,
    });
  } catch (error) {
    console.error("Erro ao listar contas:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const buscarContaPorIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "ID da conta é obrigatório",
      });
      return;
    }

    const conta = await buscarContaPorId(id);

    if (!conta) {
      res.status(404).json({
        success: false,
        message: "Conta não encontrada",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Conta encontrada com sucesso",
      data: conta,
    });
  } catch (error) {
    console.error("Erro ao buscar conta:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const atualizarContaController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const data: ContaPagarUpdateRequest = req.body;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "ID da conta é obrigatório",
      });
      return;
    }

    if (Object.keys(data).length === 0) {
      res.status(400).json({
        success: false,
        message: "Nenhum campo para atualizar",
      });
      return;
    }

    const conta = await atualizarConta(id, data);

    res.status(200).json({
      success: true,
      message: "Conta atualizada com sucesso",
      data: conta,
    });
  } catch (error) {
    console.error("Erro ao atualizar conta:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const excluirContaController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "ID da conta é obrigatório",
      });
      return;
    }

    const sucesso = await excluirConta(id);

    if (!sucesso) {
      res.status(404).json({
        success: false,
        message: "Conta não encontrada",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Conta excluída com sucesso",
    });
  } catch (error) {
    console.error("Erro ao excluir conta:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const marcarComoPagaController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { valor_pago, forma_pagamento } = req.body;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "ID da conta é obrigatório",
      });
      return;
    }

    if (!valor_pago || valor_pago <= 0) {
      res.status(400).json({
        success: false,
        message: "Valor pago deve ser maior que zero",
      });
      return;
    }

    if (!forma_pagamento) {
      res.status(400).json({
        success: false,
        message: "Forma de pagamento é obrigatória",
      });
      return;
    }

    const conta = await marcarComoPaga(id, {
      valor_pago,
      forma_pagamento,
    });

    res.status(200).json({
      success: true,
      message: "Conta marcada como paga com sucesso",
      data: conta,
    });
  } catch (error) {
    console.error("Erro ao marcar conta como paga:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const obterResumoController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const resumo = await obterResumo();

    res.status(200).json({
      success: true,
      message: "Resumo obtido com sucesso",
      data: resumo,
    });
  } catch (error) {
    console.error("Erro ao obter resumo:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

// ===== FORNECEDORES =====

export const criarFornecedorController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data: FornecedorCreateRequest = req.body;

    if (!data.nome) {
      res.status(400).json({
        success: false,
        message: "Nome do fornecedor é obrigatório",
      });
      return;
    }

    const fornecedor = await criarFornecedor(data);

    res.status(201).json({
      success: true,
      message: "Fornecedor criado com sucesso",
      data: fornecedor,
    });
  } catch (error) {
    console.error("Erro ao criar fornecedor:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const listarFornecedoresController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const fornecedores = await listarFornecedores();

    res.status(200).json({
      success: true,
      message: "Fornecedores listados com sucesso",
      data: fornecedores,
      total: fornecedores.length,
    });
  } catch (error) {
    console.error("Erro ao listar fornecedores:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const buscarFornecedorPorIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "ID do fornecedor é obrigatório",
      });
      return;
    }

    const fornecedor = await buscarFornecedorPorId(id);

    if (!fornecedor) {
      res.status(404).json({
        success: false,
        message: "Fornecedor não encontrado",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Fornecedor encontrado com sucesso",
      data: fornecedor,
    });
  } catch (error) {
    console.error("Erro ao buscar fornecedor:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const atualizarFornecedorController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const data: FornecedorUpdateRequest = req.body;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "ID do fornecedor é obrigatório",
      });
      return;
    }

    if (Object.keys(data).length === 0) {
      res.status(400).json({
        success: false,
        message: "Nenhum campo para atualizar",
      });
      return;
    }

    const fornecedor = await atualizarFornecedor(id, data);

    res.status(200).json({
      success: true,
      message: "Fornecedor atualizado com sucesso",
      data: fornecedor,
    });
  } catch (error) {
    console.error("Erro ao atualizar fornecedor:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const excluirFornecedorController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "ID do fornecedor é obrigatório",
      });
      return;
    }

    const sucesso = await excluirFornecedor(id);

    if (!sucesso) {
      res.status(404).json({
        success: false,
        message: "Fornecedor não encontrado",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Fornecedor excluído com sucesso",
    });
  } catch (error) {
    console.error("Erro ao excluir fornecedor:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

// ===== ROTAS UTILITÁRIAS =====

export const atualizarStatusContasController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await atualizarStatusContas();

    res.status(200).json({
      success: true,
      message: "Status das contas atualizado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao atualizar status das contas:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const buscarContasVencimentoController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const contas = await buscarContasVencimento();

    res.status(200).json({
      success: true,
      message: "Contas por vencimento obtidas com sucesso",
      data: contas,
    });
  } catch (error) {
    console.error("Erro ao buscar contas por vencimento:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};
