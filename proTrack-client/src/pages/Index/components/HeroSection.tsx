import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Eye, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const STATS = [
  { value: "99.9%", label: "Disponibilidade" },
  { value: "50+", label: "Funcionalidades" },
  { value: "24/7", label: "Suporte" },
  { value: "100%", label: "Seguro" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pt-32 pb-20 md:pt-40 md:pb-32">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-2 text-sm font-medium animate-fade-in"
          >
            <Zap className="w-4 h-4 mr-2" />
            Sistema Completo de Gestão Empresarial
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent mb-6 leading-tight animate-fade-in">
            Revolucione a Gestão
            <br />
            do Seu <span className="text-primary">Negócio</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed animate-fade-in">
            Uma plataforma integrada e intuitiva que centraliza controle de
            estoque, gestão financeira, relatórios avançados e muito mais.
            Transforme dados em decisões inteligentes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
            <Button
              asChild
              size="lg"
              className="text-lg px-8 py-6 h-auto hover-scale"
            >
              <Link to="/produtos">
                Começar Gratuitamente
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 h-auto hover-scale"
            >
              <Link to="/financeiro">
                <Eye className="w-5 h-5 mr-2" />
                Demo ao Vivo
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
