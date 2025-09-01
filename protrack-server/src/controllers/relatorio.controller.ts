import { Request, Response } from "express";
import {
  getRelatorioLucroProduto,
  getRelatorioLucroCategoria,
  getRelatorioLucroPeriodo,
  getRelatorioEstoqueInvestimento,
  getRelatorioCompleto,
} from "../services/relatorio.service";

// Relatório de Lucro por Produto
export const getRelatorioLucroProdutoController = async (
  req: Request,
  res: Response
) => {
  try {
    const relatorio = await getRelatorioLucroProduto();
    res.status(200).json({ relatorio });
  } catch (err) {
    console.error("Erro ao gerar relatório de lucro por produto:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// Relatório de Lucro por Categoria
export const getRelatorioLucroCategoriaController = async (
  req: Request,
  res: Response
) => {
  try {
    const relatorio = await getRelatorioLucroCategoria();
    res.status(200).json({ relatorio });
  } catch (err) {
    console.error("Erro ao gerar relatório de lucro por categoria:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// Relatório de Lucro por Período
export const getRelatorioLucroPeriodoController = async (
  req: Request,
  res: Response
) => {
  try {
    const { dataInicio, dataFim } = req.query;

    if (!dataInicio || !dataFim) {
      return res.status(400).json({
        error: "Data de início e data de fim são obrigatórias",
      });
    }

    const relatorio = await getRelatorioLucroPeriodo(
      dataInicio as string,
      dataFim as string
    );
    res.status(200).json({ relatorio });
  } catch (err) {
    console.error("Erro ao gerar relatório de lucro por período:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// Relatório de Estoque x Investimento
export const getRelatorioEstoqueInvestimentoController = async (
  req: Request,
  res: Response
) => {
  try {
    const relatorio = await getRelatorioEstoqueInvestimento();
    res.status(200).json({ relatorio });
  } catch (err) {
    console.error("Erro ao gerar relatório de estoque x investimento:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// Relatório Completo
export const getRelatorioCompletoController = async (
  req: Request,
  res: Response
) => {
  try {
    const { dataInicio, dataFim } = req.query;

    if (!dataInicio || !dataFim) {
      return res.status(400).json({
        error: "Data de início e data de fim são obrigatórias",
      });
    }

    const relatorio = await getRelatorioCompleto(
      dataInicio as string,
      dataFim as string
    );
    res.status(200).json(relatorio);
  } catch (err) {
    console.error("Erro ao gerar relatório completo:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// Relatório por Tipo (endpoint genérico)
export const getRelatorioPorTipoController = async (
  req: Request,
  res: Response
) => {
  try {
    const { tipo, dataInicio, dataFim } = req.query;

    if (!tipo) {
      return res.status(400).json({
        error: "Tipo de relatório é obrigatório",
      });
    }

    let relatorio;

    switch (tipo) {
      case "lucro-produto":
        relatorio = await getRelatorioLucroProduto();
        break;
      case "lucro-categoria":
        relatorio = await getRelatorioLucroCategoria();
        break;
      case "lucro-periodo":
        if (!dataInicio || !dataFim) {
          return res.status(400).json({
            error:
              "Data de início e data de fim são obrigatórias para este tipo de relatório",
          });
        }
        relatorio = await getRelatorioLucroPeriodo(
          dataInicio as string,
          dataFim as string
        );
        break;
      case "estoque-investimento":
        relatorio = await getRelatorioEstoqueInvestimento();
        break;
      case "completo":
        if (!dataInicio || !dataFim) {
          return res.status(400).json({
            error:
              "Data de início e data de fim são obrigatórias para este tipo de relatório",
          });
        }
        relatorio = await getRelatorioCompleto(
          dataInicio as string,
          dataFim as string
        );
        break;
      default:
        return res.status(400).json({
          error: "Tipo de relatório inválido",
        });
    }

    res.status(200).json({ relatorio });
  } catch (err) {
    console.error("Erro ao gerar relatório:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

