import { Request, Response } from "express";
import {
  getFluxoCaixaHistoricoDb,
  getFluxoCaixaProjecaoDb,
  getCategoriasFluxoCaixaDb,
  getComparativoPeriodosDb,
  getResumoFluxoCaixaDb,
} from "../services/fluxoCaixa.service";

export const getFluxoCaixaHistorico = async (req: Request, res: Response) => {
  try {
    const { periodo = "30dias", tipoVisualizacao = "diario" } = req.query;
    
    const historico = await getFluxoCaixaHistoricoDb(
      periodo as string,
      tipoVisualizacao as string
    );
    
    res.status(200).json(historico);
  } catch (err: any) {
    console.error("Erro ao buscar histórico de fluxo de caixa:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const getFluxoCaixaProjecao = async (req: Request, res: Response) => {
  try {
    const { dias = 30 } = req.query;
    
    const projecao = await getFluxoCaixaProjecaoDb(Number(dias));
    
    res.status(200).json(projecao);
  } catch (err: any) {
    console.error("Erro ao buscar projeção de fluxo de caixa:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const getCategoriasFluxoCaixa = async (req: Request, res: Response) => {
  try {
    const { periodo = "30dias" } = req.query;
    
    const categorias = await getCategoriasFluxoCaixaDb(periodo as string);
    
    res.status(200).json(categorias);
  } catch (err: any) {
    console.error("Erro ao buscar categorias de fluxo de caixa:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const getComparativoPeriodos = async (req: Request, res: Response) => {
  try {
    const comparativo = await getComparativoPeriodosDb();
    
    res.status(200).json(comparativo);
  } catch (err: any) {
    console.error("Erro ao buscar comparativo de períodos:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const getResumoFluxoCaixa = async (req: Request, res: Response) => {
  try {
    const { periodo = "30dias" } = req.query;
    
    const resumo = await getResumoFluxoCaixaDb(periodo as string);
    
    res.status(200).json(resumo);
  } catch (err: any) {
    console.error("Erro ao buscar resumo de fluxo de caixa:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
