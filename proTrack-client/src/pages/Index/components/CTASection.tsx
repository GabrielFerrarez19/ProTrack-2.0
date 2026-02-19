import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Package, BarChart3, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const CTA_STATS = [
  { label: "Setup", value: "5 min" },
  { label: "Suporte", value: "24/7" },
  { label: "Garantia", value: "30 dias" },
  { label: "Teste", value: "Grátis" },
];

export function CTASection() {
  return (
    <section className="px-4 py-20">
      <div className="max-w-5xl mx-auto text-center">
        <Badge variant="secondary" className="mb-6 px-4 py-2">
          <Zap className="w-4 h-4 mr-2" />
          Comece Agora Mesmo
        </Badge>

        <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
          Transforme Seu Negócio
          <br />
          <span className="text-primary">Hoje Mesmo</span>
        </h2>

        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          Junte-se a milhares de empresas que já revolucionaram sua gestão.
          Comece gratuitamente e veja os resultados em dias, não meses.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
          <Button
            asChild
            size="lg"
            className="text-xl px-12 py-8 h-auto hover-scale"
          >
            <Link to="/produtos">
              <Package className="w-6 h-6 mr-3" />
              Começar Gratuitamente
              <ArrowRight className="w-6 h-6 ml-3" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="text-xl px-12 py-8 h-auto hover-scale"
          >
            <Link to="/financeiro">
              <BarChart3 className="w-6 h-6 mr-3" />
              Ver Demo Interativa
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
          {CTA_STATS.map((stat) => (
            <div key={stat.label}>
              <div className="text-lg font-medium text-muted-foreground mb-2">
                {stat.label}
              </div>
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
