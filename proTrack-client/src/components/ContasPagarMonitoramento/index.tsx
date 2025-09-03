import React, { useState, useEffect } from "react";
import { useContasPagarMonitoramento } from "../../hooks/useContasPagarMonitoramento";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { Badge } from "../ui/badge";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  RefreshCw,
  Trash2,
  Activity,
} from "lucide-react";

// Interfaces para os estados
interface Estatisticas {
  totalVencidas: number;
  valorTotalVencido: number;
}

interface StatusSistema {
  status: "ativo" | "inativo";
  sistema: {
    versao: string;
  };
  timestamp: string | Date;
}

export const ContasPagarMonitoramento: React.FC = () => {
  const {
    loading,
    error,
    executarMonitoramento,
    obterEstatisticas,
    verificarStatus,
    limparContasAntigas,
    limparErro,
  } = useContasPagarMonitoramento();

  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [statusSistema, setStatusSistema] = useState<StatusSistema | null>(
    null
  );
  const [ultimaExecucao, setUltimaExecucao] = useState<Date | null>(null);
  const [diasLimpeza, setDiasLimpeza] = useState<number>(365);

  // Carregar dados iniciais
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const [stats, status] = await Promise.all([
      obterEstatisticas(),
      verificarStatus(),
    ]);

    if (stats) setEstatisticas(stats);
    if (status) setStatusSistema(status as StatusSistema);
  };

  const handleExecutarMonitoramento = async () => {
    const resultado = await executarMonitoramento();
    if (resultado) {
      setUltimaExecucao(new Date());
      await carregarDados(); // Recarrega dados após execução
    }
  };

  const handleLimparContasAntigas = async () => {
    const contasArquivadas = await limparContasAntigas(diasLimpeza);
    if (contasArquivadas !== null) {
      await carregarDados(); // Recarrega dados após limpeza
      alert(`${contasArquivadas} contas vencidas foram arquivadas`);
    }
  };

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const formatarData = (data: string | Date) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Monitoramento de Contas a Pagar
          </h1>
          <p className="text-gray-600 mt-2">
            Sistema automático para identificar e gerenciar contas vencidas
          </p>
        </div>

        <Button
          onClick={handleExecutarMonitoramento}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Activity className="w-4 h-4 mr-2" />
          )}
          Executar Monitoramento
        </Button>
      </div>

      {/* Status do Sistema */}
      {statusSistema && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Status do Sistema
            </CardTitle>
            <CardDescription>
              Informações sobre o sistema de monitoramento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <Badge
                  variant={
                    statusSistema.status === "ativo" ? "default" : "destructive"
                  }
                  className="text-sm"
                >
                  {statusSistema.status === "ativo" ? "Ativo" : "Inativo"}
                </Badge>
                <p className="text-xs text-gray-500 mt-1">Status</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">
                  {statusSistema.sistema.versao}
                </p>
                <p className="text-xs text-gray-500 mt-1">Versão</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">
                  {formatarData(statusSistema.timestamp)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Última Verificação</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas */}
      {estatisticas && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Contas Vencidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {estatisticas.totalVencidas}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Total de contas vencidas
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                Valor Total Vencido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {formatarValor(estatisticas.valorTotalVencido)}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Soma de todas as contas vencidas
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Última Execução */}
      {ultimaExecucao && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Última Execução
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Monitoramento executado em:
                </p>
                <p className="text-lg font-medium">
                  {formatarData(ultimaExecucao)} às{" "}
                  {ultimaExecucao.toLocaleTimeString("pt-BR")}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Limpeza de Contas Antigas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Limpeza de Contas Antigas
          </CardTitle>
          <CardDescription>
            Arquivar contas vencidas antigas para otimizar performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">
                Dias para considerar como "antigo":
              </label>
              <input
                type="number"
                value={diasLimpeza}
                onChange={(e) => setDiasLimpeza(Number(e.target.value))}
                min="1"
                max="3650"
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <span className="text-sm text-gray-500">dias</span>
            </div>

            <Button
              onClick={handleLimparContasAntigas}
              disabled={loading}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Limpar Contas Antigas
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mensagens de Erro */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button
              variant="link"
              onClick={limparErro}
              className="p-0 h-auto text-red-700 underline ml-2"
            >
              Fechar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Informações Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              • O sistema executa automaticamente a cada 30 minutos via cron job
            </p>
            <p>
              • Contas vencidas são marcadas automaticamente com status
              "vencido"
            </p>
            <p>• Logs detalhados são salvos em logs/monitoramento_contas.log</p>
            <p>
              • Use o botão "Executar Monitoramento" para verificação manual
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
