import { Request, Response } from "express";
import {
  executarMonitoramentoContasPagar,
  obterEstatisticasContasVencidas,
  limparContasVencidasAntigas,
} from "../services/contasPagarMonitoramento.service";

// Endpoint para executar monitoramento manual
export const executarMonitoramento = async (req: Request, res: Response) => {
  try {
    const resultado = await executarMonitoramentoContasPagar();

    res.status(200).json({
      success: true,
      message: "Monitoramento de contas a pagar executado com sucesso",
      resultado,
    });
  } catch (error: any) {
    console.error("Erro ao executar monitoramento de contas:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
      message: error.message,
    });
  }
};

// Endpoint para obter estatísticas de contas vencidas
export const getEstatisticasContasVencidas = async (
  req: Request,
  res: Response
) => {
  try {
    const estatisticas = await obterEstatisticasContasVencidas();

    res.status(200).json({
      success: true,
      estatisticas,
    });
  } catch (error: any) {
    console.error("Erro ao obter estatísticas de contas:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
      message: error.message,
    });
  }
};

// Endpoint para limpar contas vencidas antigas
export const limparContasAntigas = async (req: Request, res: Response) => {
  try {
    const { dias = 365 } = req.query;
    const diasAntigos = Number(dias);

    if (isNaN(diasAntigos) || diasAntigos < 1) {
      return res.status(400).json({
        success: false,
        error: "Parâmetro 'dias' deve ser um número válido maior que 0",
      });
    }

    const contasArquivadas = await limparContasVencidasAntigas(diasAntigos);

    res.status(200).json({
      success: true,
      message: `${contasArquivadas} contas vencidas foram arquivadas`,
      contasArquivadas,
      diasAntigos,
    });
  } catch (error: any) {
    console.error("Erro ao limpar contas antigas:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
      message: error.message,
    });
  }
};

// Endpoint para verificar status do sistema de monitoramento
export const getStatusMonitoramento = async (req: Request, res: Response) => {
  try {
    const estatisticas = await obterEstatisticasContasVencidas();

    res.status(200).json({
      success: true,
      status: "ativo",
      timestamp: new Date(),
      estatisticas,
      sistema: {
        nome: "Monitoramento de Contas a Pagar Vencidas",
        versao: "1.0.0",
        descricao:
          "Sistema automático para identificar e marcar contas a pagar vencidas",
      },
    });
  } catch (error: any) {
    console.error("Erro ao verificar status:", error);
    res.status(500).json({
      success: false,
      status: "erro",
      error: "Erro interno do servidor",
      message: error.message,
    });
  }
};
