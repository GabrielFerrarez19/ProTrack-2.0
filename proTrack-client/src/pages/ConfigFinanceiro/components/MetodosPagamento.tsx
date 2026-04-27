import React, { useEffect } from "react";
import type { MetodoPagamento } from "../../../@types/types.components";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Switch } from "../../../components/ui/switch";
import { CreditCard } from "lucide-react";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
interface Props {
  metodosPagamento: MetodoPagamento[];
  setMetodosPagamento: React.Dispatch<React.SetStateAction<MetodoPagamento[]>>;
}

export function MetodosPagamento({
  metodosPagamento,
  setMetodosPagamento,
}: Props) {
  const { paymentMethods, loading, error } = usePaymentMethods();

  // Sincroniza os dados vindos da API com o estado do componente pai
  useEffect(() => {
    if (paymentMethods.length > 0) {
      // Mapeia o tipo da API para o tipo esperado pelo seu componente pai (MetodoPagamento)
      const formatados = paymentMethods.map((m) => ({
        id: m.id,
        nome: m.name,
        tipo: m.type,
        ativo: m.is_active, // ou o valor que vier da API
      }));
      setMetodosPagamento(formatados as any); // Use o cast necessário se os tipos forem levemente diferentes
    }
  }, [paymentMethods, setMetodosPagamento]);

  const handleToggleMetodo = (id: string, ativo: boolean) => {
    // Atualiza o estado no componente pai
    setMetodosPagamento((metodos) =>
      metodos.map((m) => (m.id === id ? { ...m, ativo } : m)),
    );
  };

  const getTipoMetodoIcon = (tipo: string) => {
    switch (tipo) {
      case "dinheiro":
        return "💵";
      case "cartao":
        return "💳";
      case "pix":
        return "📱";
      case "transferencia":
        return "🏦";
      case "aprazo":
        return "🕒";
      default:
        return "💰";
    }
  };

  console.log("metodosPagamento", metodosPagamento);

  // Se não houver métodos carregados ainda
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" /> Métodos de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-block h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Carregando métodos de pagamento...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" /> Métodos de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-bold text-red-500">
              Erro ao carregar metodos de pagamento
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" /> Métodos de Pagamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paymentMethods.map((metodo) => (
            <div
              key={metodo.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {getTipoMetodoIcon(metodo.type)}
                </span>
                <div>
                  <p className="font-medium text-foreground">{metodo.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {metodo.type}
                  </p>
                </div>
              </div>
              <Switch
                checked={metodo.is_active}
                onCheckedChange={(checked) =>
                  handleToggleMetodo(metodo.id, checked)
                }
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
