import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Package, DollarSign, TrendingUp, BarChart3 } from "lucide-react";

const STEPS = [
  {
    step: 1,
    title: "Configure Rapidamente",
    description:
      "Importe seus dados existentes ou comece do zero. Nosso assistente guia você em cada etapa da configuração inicial.",
    gradientClass: "from-primary to-primary/80",
    textClass: "text-primary-foreground",
  },
  {
    step: 2,
    title: "Gerencie Intuitivamente",
    description:
      "Interface intuitiva que sua equipe aprende em minutos. Automatize processos e elimine tarefas repetitivas.",
    gradientClass: "from-accent to-accent/80",
    textClass: "text-accent-foreground",
  },
  {
    step: 3,
    title: "Cresça Exponencialmente",
    description:
      "Use insights inteligentes para tomar decisões estratégicas e acelerar o crescimento do seu negócio.",
    gradientClass: "from-secondary to-secondary/80",
    textClass: "text-secondary-foreground",
  },
];

const TAB_CONTENT = [
  {
    value: "estoque",
    label: "Estoque",
    title: "Controle Total do Estoque",
    description:
      "Gerencie produtos, fornecedores e movimentações em uma interface única e intuitiva.",
    items: [
      "Cadastro rápido com código de barras",
      "Alertas automáticos de reposição",
      "Inventário em tempo real",
    ],
    icon: Package,
    stat: "2.5s",
    statLabel: "Tempo médio para cadastrar produto",
    iconColor: "text-primary",
    statColor: "text-primary",
  },
  {
    value: "financeiro",
    label: "Financeiro",
    title: "Finanças Inteligentes",
    description:
      "Controle completo do fluxo de caixa com previsões precisas e automações financeiras.",
    items: [
      "Fluxo de caixa projetado",
      "Conciliação bancária automática",
      "Análise de lucratividade",
    ],
    icon: DollarSign,
    stat: "87%",
    statLabel: "Redução no tempo de fechamento",
    iconColor: "text-accent",
    statColor: "text-accent",
  },
  {
    value: "vendas",
    label: "Vendas",
    title: "Vendas Otimizadas",
    description:
      "Acelere suas vendas com automações inteligentes e análises de comportamento.",
    items: [
      "PDV integrado completo",
      "Análise de padrões de compra",
      "Campanhas automáticas",
    ],
    icon: TrendingUp,
    stat: "43%",
    statLabel: "Aumento médio nas vendas",
    iconColor: "text-secondary",
    statColor: "text-secondary",
  },
  {
    value: "relatorios",
    label: "Relatórios",
    title: "Insights Poderosos",
    description:
      "Relatórios interativos e dashboards personalizáveis para decisões estratégicas.",
    items: [
      "Dashboards personalizáveis",
      "Relatórios automáticos",
      "Previsões com IA",
    ],
    icon: BarChart3,
    stat: "92%",
    statLabel: "Precisão nas previsões",
    iconColor: "text-primary",
    statColor: "text-primary",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Processo Simples
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Como Funciona
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Em poucos passos, você transforma completamente a gestão do seu
            negócio
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {STEPS.map(({ step, title, description, gradientClass, textClass }) => (
            <div key={step} className="text-center group">
              <div
                className={`w-20 h-20 bg-gradient-to-br ${gradientClass} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <span className={`text-3xl font-bold ${textClass}`}>{step}</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {title}
              </h3>
              <p className="text-muted-foreground text-lg">{description}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="estoque" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            {TAB_CONTENT.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {TAB_CONTENT.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsContent key={tab.value} value={tab.value} className="mt-8">
                <Card className="border-2">
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                      <div>
                        <h3 className="text-3xl font-bold text-foreground mb-4">
                          {tab.title}
                        </h3>
                        <p className="text-lg text-muted-foreground mb-6">
                          {tab.description}
                        </p>
                        <ul className="space-y-3">
                          {tab.items.map((item) => (
                            <li
                              key={item}
                              className="flex items-center text-lg"
                            >
                              <CheckCircle className="w-5 h-5 text-primary mr-3" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-muted/50 rounded-xl p-8 text-center">
                        <Icon
                          className={`w-24 h-24 ${tab.iconColor} mx-auto mb-4`}
                        />
                        <div
                          className={`text-6xl font-bold ${tab.statColor} mb-2`}
                        >
                          {tab.stat}
                        </div>
                        <div className="text-muted-foreground">
                          {tab.statLabel}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
}
