import { Request, Response } from "express";
import {
  executarMonitoramentoVendas,
  obterEstatisticasVendasVencidas,
  limparVendasVencidasAntigas,
} from "../services/vendasMonitoramento.service";

// Endpoint para executar monitoramento manual
export const executarMonitoramento = async (req: Request, res: Response) => {
  try {
    const resultado = await executarMonitoramentoVendas();

    res.status(200).json({
      success: true,
      message: "Monitoramento executado com sucesso",
      resultado,
    });
  } catch (error: any) {
    console.error("Erro ao executar monitoramento:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
      message: error.message,
    });
  }
};

// Endpoint para obter estatísticas de vendas vencidas
export const getEstatisticasVendasVencidas = async (
  req: Request,
  res: Response
) => {
  try {
    const estatisticas = await obterEstatisticasVendasVencidas();

    res.status(200).json({
      success: true,
      estatisticas,
    });
  } catch (error: any) {
    console.error("Erro ao obter estatísticas:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
      message: error.message,
    });
  }
};

// Endpoint para limpar vendas vencidas antigas
export const limparVendasAntigas = async (req: Request, res: Response) => {
  try {
    const { dias = 365 } = req.query;
    const diasAntigos = Number(dias);

    if (isNaN(diasAntigos) || diasAntigos < 1) {
      return res.status(400).json({
        success: false,
        error: "Parâmetro 'dias' deve ser um número válido maior que 0",
      });
    }

    const vendasArquivadas = await limparVendasVencidasAntigas(diasAntigos);

    res.status(200).json({
      success: true,
      message: `${vendasArquivadas} vendas vencidas foram arquivadas`,
      vendasArquivadas,
      diasAntigos,
    });
  } catch (error: any) {
    console.error("Erro ao limpar vendas antigas:", error);
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
    const estatisticas = await obterEstatisticasVendasVencidas();

    res.status(200).json({
      success: true,
      status: "ativo",
      timestamp: new Date(),
      estatisticas,
      sistema: {
        nome: "Monitoramento de Vendas Vencidas",
        versao: "1.0.0",
        descricao:
          "Sistema automático para identificar e marcar vendas vencidas",
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
