import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { Link } from "react-router-dom";

export function IndexHeader() {
  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Package className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold text-foreground">GestãoPro</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Funcionalidades
          </a>
          <a
            href="#how-it-works"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Como Funciona
          </a>
          <a
            href="#benefits"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Benefícios
          </a>
          <Button asChild variant="outline" size="sm">
            <Link to="/login">Acessar Sistema</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
