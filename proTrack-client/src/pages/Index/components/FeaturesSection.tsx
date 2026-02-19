import { Badge } from "@/components/ui/badge";
import {
  Package,
  DollarSign,
  BarChart3,
  Users,
  Shield,
  Zap,
} from "lucide-react";
import { FeatureCard } from "./FeatureCard";

const FEATURES = [
  {
    icon: Package,
    title: "Controle Inteligente de Estoque",
    description:
      "Gestão completa de produtos com alertas automáticos e rastreamento em tempo real",
    items: [
      "Cadastro detalhado com códigos de barras",
      "Movimentações automatizadas de entrada/saída",
      "Alertas personalizáveis de estoque mínimo",
      "Relatórios de giro e rentabilidade",
    ],
    progress: 95,
    progressLabel: "95% de precisão no controle",
    iconWrapperClassName: "from-primary to-primary/80",
    iconColorClassName: "text-primary-foreground",
  },
  {
    icon: DollarSign,
    title: "Gestão Financeira Avançada",
    description:
      "Controle total do fluxo de caixa com análises preditivas e planejamento",
    items: [
      "Contas a pagar/receber automatizadas",
      "Fluxo de caixa projetado até 12 meses",
      "Conciliação bancária automática",
      "Análise de lucratividade por produto",
    ],
    progress: 98,
    progressLabel: "98% de precisão financeira",
    iconWrapperClassName: "from-accent to-accent/80",
    iconColorClassName: "text-accent-foreground",
  },
  {
    icon: BarChart3,
    title: "Analytics & Inteligência",
    description:
      "Dashboards interativos com insights acionáveis para decisões estratégicas",
    items: [
      "Dashboard em tempo real personalizável",
      "KPIs automáticos e alertas inteligentes",
      "Relatórios exportáveis em múltiplos formatos",
      "Previsões baseadas em machine learning",
    ],
    progress: 92,
    progressLabel: "92% de acurácia nas previsões",
    iconWrapperClassName: "from-secondary to-secondary/80",
    iconColorClassName: "text-secondary-foreground",
  },
  {
    icon: Users,
    title: "Gestão de Equipe",
    description:
      "Controle total de usuários, permissões e produtividade da equipe",
    items: [
      "Perfis personalizados por função",
      "Controle granular de permissões",
      "Log completo de atividades",
      "Métricas de produtividade individual",
    ],
    progress: 96,
    progressLabel: "96% de satisfação da equipe",
    iconWrapperClassName: "from-primary to-primary/80",
    iconColorClassName: "text-primary-foreground",
  },
  {
    icon: Shield,
    title: "Segurança Empresarial",
    description: "Proteção militar dos seus dados com compliance total",
    items: [
      "Criptografia AES-256 end-to-end",
      "Backup automático multi-região",
      "Conformidade LGPD e ISO 27001",
      "Monitoramento 24/7 com IA",
    ],
    progress: 100,
    progressLabel: "100% de proteção garantida",
    iconWrapperClassName: "from-accent to-accent/80",
    iconColorClassName: "text-accent-foreground",
  },
  {
    icon: Zap,
    title: "Performance Extrema",
    description:
      "Sistema otimizado para máxima velocidade e disponibilidade",
    items: [
      "Interface responsiva ultra-rápida",
      "Sincronização instantânea global",
      "Atualizações automáticas sem downtime",
      "Escalabilidade infinita na nuvem",
    ],
    progress: 99,
    progressLabel: "99.9% de uptime garantido",
    iconWrapperClassName: "from-secondary to-secondary/80",
    iconColorClassName: "text-secondary-foreground",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="px-4 py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Funcionalidades Completas
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Tudo que Seu Negócio Precisa
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Uma suite completa de ferramentas integradas para gerenciar todos os
            aspectos da sua empresa com eficiência e precisão
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              items={feature.items}
              progress={feature.progress}
              progressLabel={feature.progressLabel}
              iconWrapperClassName={feature.iconWrapperClassName}
              iconColorClassName={feature.iconColorClassName}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
