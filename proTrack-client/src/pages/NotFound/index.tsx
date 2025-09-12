import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, AlertTriangle } from "lucide-react";
import { useNotFound } from "@/hooks/useNotFound";

export function NotFound() {
  const location = useLocation();
  const { goHome, goBack } = useNotFound();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardContent className="p-8 text-center">
          {/* Ícone de erro */}
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-red-100 to-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
          </div>

          {/* Título principal */}
          <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Página não encontrada
          </h2>

          {/* Descrição */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            A página que você está procurando não existe ou foi movida para
            outro local.
          </p>

          {/* Informações técnicas (apenas em desenvolvimento) */}
          {import.meta.env.DEV && (
            <div className="mb-6 p-3 bg-gray-100 rounded-lg text-left">
              <p className="text-sm text-gray-500 mb-1">Rota tentada:</p>
              <code className="text-sm text-red-600 font-mono break-all">
                {location.pathname}
              </code>
            </div>
          )}

          {/* Botões de ação */}
          <div className="space-y-3">
            <Button
              onClick={goHome}
              className="w-full bg-gradient-to-r cursor-pointer from-[#628DFD] to-[#6F31FF] hover:from-[#7A9BFD] hover:to-[#B597F9] text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Ir para o Início
            </Button>

            <Button
              onClick={goBack}
              variant="outline"
              className="w-full cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-xs text-gray-400">
            <p>ProTrack 2.0 - Sistema de Gestão</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
