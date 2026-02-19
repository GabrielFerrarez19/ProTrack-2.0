import { Package } from "lucide-react";

export function IndexFooter() {
  return (
    <footer className="bg-muted/50 border-t px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Package className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground">GestãoPro</span>
          </div>
          <div className="flex items-center space-x-6 text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              Termos
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Privacidade
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Suporte
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Contato
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
          <p>
            &copy; 2024 GestãoPro. Todos os direitos reservados. Desenvolvido
            para impulsionar o seu sucesso.
          </p>
        </div>
      </div>
    </footer>
  );
}
