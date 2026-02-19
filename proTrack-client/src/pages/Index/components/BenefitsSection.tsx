import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  Target,
  Lightbulb,
  Award,
  HeartHandshake,
  Globe,
  Smartphone,
} from "lucide-react";

const BENEFIT_CARDS = [
  {
    icon: Clock,
    title: "Economia de Tempo",
    description:
      "Automatize tarefas repetitivas e ganhe até 8 horas por semana",
    iconColor: "text-primary",
  },
  {
    icon: Target,
    title: "Decisões Precisas",
    description:
      "Dados em tempo real para decisões estratégicas certeiras",
    iconColor: "text-accent",
  },
  {
    icon: Lightbulb,
    title: "Inovação Contínua",
    description:
      "Atualizações constantes com as últimas tecnologias",
    iconColor: "text-secondary",
  },
  {
    icon: Award,
    title: "Excelência Garantida",
    description:
      "Padrão internacional de qualidade e segurança",
    iconColor: "text-primary",
  },
];

const RESULTS = [
  { label: "Redução de Custos Operacionais", value: 35, color: "text-primary" },
  { label: "Aumento na Produtividade", value: 52, color: "text-accent" },
  { label: "Melhoria na Precisão dos Dados", value: 89, color: "text-secondary" },
  { label: "Satisfação dos Usuários", value: 96, color: "text-primary" },
];

const HIGHLIGHT_CARDS = [
  {
    icon: HeartHandshake,
    title: "Suporte Especializado",
    description:
      "Equipe dedicada 24/7 com especialistas em gestão empresarial para garantir seu sucesso.",
    borderColor: "border-l-primary",
    iconColor: "text-primary",
  },
  {
    icon: Globe,
    title: "Acesso Global",
    description:
      "Gerencie seu negócio de qualquer lugar do mundo com sincronização em tempo real.",
    borderColor: "border-l-accent",
    iconColor: "text-accent",
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description:
      "Interface otimizada para dispositivos móveis, permitindo gestão completa no smartphone.",
    borderColor: "border-l-secondary",
    iconColor: "text-secondary",
  },
];

export function BenefitsSection() {
  return (
    <section id="benefits" className="px-4 py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Vantagens Competitivas
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Por Que Escolher o GestãoPro?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Mais que um sistema, uma transformação digital completa para seu
            negócio
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {BENEFIT_CARDS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <Card
                key={benefit.title}
                className="text-center border-2 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <Icon
                    className={`w-12 h-12 ${benefit.iconColor} mx-auto mb-4`}
                  />
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-foreground mb-6">
              Resultados Comprovados
            </h3>
            <div className="space-y-6">
              {RESULTS.map((result) => (
                <div key={result.label}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-medium">{result.label}</span>
                    <span
                      className={`text-2xl font-bold ${result.color}`}
                    >
                      {result.value}%
                    </span>
                  </div>
                  <Progress value={result.value} className="h-3" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {HIGHLIGHT_CARDS.map((highlight) => {
              const Icon = highlight.icon;
              return (
                <Card
                  key={highlight.title}
                  className={`p-6 border-l-4 ${highlight.borderColor}`}
                >
                  <div className="flex items-start space-x-4">
                    <Icon
                      className={`w-8 h-8 ${highlight.iconColor} flex-shrink-0 mt-1`}
                    />
                    <div>
                      <h4 className="text-xl font-bold text-foreground mb-2">
                        {highlight.title}
                      </h4>
                      <p className="text-muted-foreground">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
