"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FluxoCaixaService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class FluxoCaixaService {
    // Obter resumo geral do fluxo de caixa
    async obterResumo(filtros) {
        const { data_inicio, data_fim } = this.calcularDatas(filtros.periodo);
        const [entradas, saidas, saldo_atual] = await Promise.all([
            this.calcularTotalEntradas(data_inicio, data_fim),
            this.calcularTotalSaidas(data_inicio, data_fim),
            this.calcularSaldoAtual(),
        ]);
        const saldo_periodo = entradas - saidas;
        const projecao_30_dias = await this.calcularProjecao30Dias();
        return {
            saldo_atual,
            total_entradas_periodo: entradas,
            total_saidas_periodo: saidas,
            saldo_periodo,
            projecao_30_dias,
        };
    }
    // Obter fluxo de caixa histórico
    async obterFluxoHistorico(filtros) {
        const { data_inicio, data_fim } = this.calcularDatas(filtros.periodo);
        const movimentacoes = await prisma.movimentacaoFinanceira.findMany({
            where: {
                data_movimentacao: {
                    gte: data_inicio,
                    lte: data_fim,
                },
                status: "pago",
            },
            orderBy: {
                data_movimentacao: "asc",
            },
        });
        return this.agruparPorPeriodo(movimentacoes, filtros.tipo_visualizacao);
    }
    // Obter projeção futura
    async obterProjecaoFutura() {
        const data_hoje = new Date();
        const data_fim = new Date();
        data_fim.setDate(data_fim.getDate() + 30);
        const movimentacoes = await prisma.movimentacaoFinanceira.findMany({
            where: {
                data_vencimento: {
                    gte: data_hoje,
                    lte: data_fim,
                },
                status: "pendente",
            },
            orderBy: {
                data_vencimento: "asc",
            },
        });
        return this.agruparPorPeriodo(movimentacoes, "diario").map((item) => ({
            ...item,
            tipo: "projecao",
        }));
    }
    // Obter categorias de entrada
    async obterCategoriasEntrada(filtros) {
        const { data_inicio, data_fim } = this.calcularDatas(filtros.periodo);
        const categorias = await prisma.$queryRaw `
      SELECT 
        c.nome as categoria,
        SUM(mf.valor) as valor,
        ROUND((SUM(mf.valor) / (SELECT SUM(valor) FROM MovimentacaoFinanceira 
               WHERE tipo = 'entrada' AND status = 'pago' 
               AND data_movimentacao BETWEEN ${data_inicio} AND ${data_fim})) * 100, 1) as percentual
      FROM MovimentacaoFinanceira mf
      JOIN Categoria c ON mf.categoria_id = c.id
      WHERE mf.tipo = 'entrada' 
        AND mf.status = 'pago'
        AND mf.data_movimentacao BETWEEN ${data_inicio} AND ${data_fim}
        AND c.tipo = 'receita'
      GROUP BY c.id, c.nome
      ORDER BY valor DESC
    `;
        return categorias;
    }
    // Obter categorias de saída
    async obterCategoriasSaida(filtros) {
        const { data_inicio, data_fim } = this.calcularDatas(filtros.periodo);
        const categorias = await prisma.$queryRaw `
      SELECT 
        c.nome as categoria,
        SUM(mf.valor) as valor,
        ROUND((SUM(mf.valor) / (SELECT SUM(valor) FROM MovimentacaoFinanceira 
               WHERE tipo = 'saida' AND status = 'pago' 
               AND data_movimentacao BETWEEN ${data_inicio} AND ${data_fim})) * 100, 1) as percentual
      FROM MovimentacaoFinanceira mf
      JOIN Categoria c ON mf.categoria_id = c.id
      WHERE mf.tipo = 'saida' 
        AND mf.status = 'pago'
        AND mf.data_movimentacao BETWEEN ${data_inicio} AND ${data_fim}
        AND c.tipo = 'despesa'
      GROUP BY c.id, c.nome
      ORDER BY valor DESC
    `;
        return categorias;
    }
    // Obter comparativo entre períodos
    async obterComparativoPeriodos() {
        const hoje = new Date();
        const mes_atual = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const mes_anterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
        const mes_ano_anterior = new Date(hoje.getFullYear() - 1, hoje.getMonth(), 1);
        const [este_mes, mes_anterior_data, mesmo_mes_ano_anterior] = await Promise.all([
            this.calcularPeriodo(mes_atual, hoje),
            this.calcularPeriodo(mes_anterior, new Date(hoje.getFullYear(), hoje.getMonth(), 0)),
            this.calcularPeriodo(mes_ano_anterior, new Date(hoje.getFullYear() - 1, hoje.getMonth() + 1, 0)),
        ]);
        return [
            { periodo: "Este Mês", ...este_mes },
            { periodo: "Mês Anterior", ...mes_anterior_data },
            { periodo: "Mesmo Mês Ano Anterior", ...mesmo_mes_ano_anterior },
        ];
    }
    // Criar nova movimentação financeira
    async criarMovimentacao(dados) {
        const movimentacao = await prisma.movimentacaoFinanceira.create({
            data: dados,
        });
        return {
            ...movimentacao,
            valor: Number(movimentacao.valor)
        };
    }
    // Atualizar movimentação financeira
    async atualizarMovimentacao(id, dados) {
        const movimentacao = await prisma.movimentacaoFinanceira.update({
            where: { id },
            data: dados,
        });
        return {
            ...movimentacao,
            valor: Number(movimentacao.valor)
        };
    }
    // Excluir movimentação financeira
    async excluirMovimentacao(id) {
        await prisma.movimentacaoFinanceira.delete({
            where: { id },
        });
    }
    // Métodos privados auxiliares
    calcularDatas(periodo) {
        const hoje = new Date();
        const data_fim = new Date(hoje);
        const data_inicio = new Date(hoje);
        switch (periodo) {
            case "7dias":
                data_inicio.setDate(hoje.getDate() - 7);
                break;
            case "30dias":
                data_inicio.setDate(hoje.getDate() - 30);
                break;
            case "90dias":
                data_inicio.setDate(hoje.getDate() - 90);
                break;
            case "1ano":
                data_inicio.setFullYear(hoje.getFullYear() - 1);
                break;
        }
        return { data_inicio, data_fim };
    }
    async calcularTotalEntradas(data_inicio, data_fim) {
        const resultado = await prisma.movimentacaoFinanceira.aggregate({
            where: {
                tipo: "entrada",
                status: "pago",
                data_movimentacao: {
                    gte: data_inicio,
                    lte: data_fim,
                },
            },
            _sum: {
                valor: true,
            },
        });
        return Number(resultado._sum.valor) || 0;
    }
    async calcularTotalSaidas(data_inicio, data_fim) {
        const resultado = await prisma.movimentacaoFinanceira.aggregate({
            where: {
                tipo: "saida",
                status: "pago",
                data_movimentacao: {
                    gte: data_inicio,
                    lte: data_fim,
                },
            },
            _sum: {
                valor: true,
            },
        });
        return Number(resultado._sum.valor) || 0;
    }
    async calcularSaldoAtual() {
        const [entradas, saidas] = await Promise.all([
            prisma.movimentacaoFinanceira.aggregate({
                where: {
                    tipo: "entrada",
                    status: "pago",
                },
                _sum: { valor: true },
            }),
            prisma.movimentacaoFinanceira.aggregate({
                where: {
                    tipo: "saida",
                    status: "pago",
                },
                _sum: { valor: true },
            }),
        ]);
        return Number(entradas._sum.valor || 0) - Number(saidas._sum.valor || 0);
    }
    async calcularProjecao30Dias() {
        const data_hoje = new Date();
        const data_fim = new Date();
        data_fim.setDate(data_fim.getDate() + 30);
        const [entradas_futuras, saidas_futuras] = await Promise.all([
            prisma.movimentacaoFinanceira.aggregate({
                where: {
                    tipo: "entrada",
                    data_vencimento: {
                        gte: data_hoje,
                        lte: data_fim,
                    },
                },
                _sum: { valor: true },
            }),
            prisma.movimentacaoFinanceira.aggregate({
                where: {
                    tipo: "saida",
                    data_vencimento: {
                        gte: data_hoje,
                        lte: data_fim,
                    },
                },
                _sum: { valor: true },
            }),
        ]);
        const saldo_atual = await this.calcularSaldoAtual();
        const entradas = Number(entradas_futuras._sum.valor || 0);
        const saidas = Number(saidas_futuras._sum.valor || 0);
        return saldo_atual + entradas - saidas;
    }
    async calcularPeriodo(data_inicio, data_fim) {
        const [entradas, saidas] = await Promise.all([
            this.calcularTotalEntradas(data_inicio, data_fim),
            this.calcularTotalSaidas(data_inicio, data_fim),
        ]);
        return {
            entradas,
            saidas,
            saldo: entradas - saidas,
        };
    }
    agruparPorPeriodo(movimentacoes, tipo_visualizacao) {
        const agrupado = new Map();
        movimentacoes.forEach((mov) => {
            let chave;
            if (tipo_visualizacao === "diario") {
                chave = mov.data_movimentacao.toISOString().split("T")[0];
            }
            else if (tipo_visualizacao === "semanal") {
                const data = new Date(mov.data_movimentacao);
                const semana = this.obterSemana(data);
                chave = semana;
            }
            else {
                const data = new Date(mov.data_movimentacao);
                chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
            }
            if (!agrupado.has(chave)) {
                agrupado.set(chave, { entradas: 0, saidas: 0 });
            }
            const atual = agrupado.get(chave);
            if (mov.tipo === "entrada") {
                atual.entradas += Number(mov.valor);
            }
            else {
                atual.saidas += Number(mov.valor);
            }
        });
        const resultado = [];
        let saldo_acumulado = 0;
        Array.from(agrupado.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .forEach(([data, valores]) => {
            saldo_acumulado += valores.entradas - valores.saidas;
            resultado.push({
                data: this.formatarData(data, tipo_visualizacao),
                entradas: valores.entradas,
                saidas: valores.saidas,
                saldo: saldo_acumulado,
            });
        });
        return resultado;
    }
    obterSemana(data) {
        const inicio_semana = new Date(data);
        inicio_semana.setDate(data.getDate() - data.getDay());
        return inicio_semana.toISOString().split("T")[0];
    }
    formatarData(data, tipo_visualizacao) {
        if (tipo_visualizacao === "diario") {
            const [ano, mes, dia] = data.split("-");
            return `${dia}/${mes}`;
        }
        else if (tipo_visualizacao === "semanal") {
            const data_obj = new Date(data);
            return `Sem ${Math.ceil((data_obj.getDate() + data_obj.getDay()) / 7)}`;
        }
        else {
            const [ano, mes] = data.split("-");
            return `${mes}/${ano}`;
        }
    }
}
exports.FluxoCaixaService = FluxoCaixaService;
