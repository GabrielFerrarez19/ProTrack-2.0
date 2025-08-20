import { useEffect, useState } from "react";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";

interface ResumoVendasProps {
  valorAPagar: number | string | null; // valor vindo do banco
  valorPago: number;
  setValorPago: (valor: number) => void;
  setTotalRestantePai: (valor: number) => void; // callback para o pai
}

export const ResumoVendas = ({
  valorAPagar,
  valorPago,
  setValorPago,
  setTotalRestantePai,
}: ResumoVendasProps) => {
  const [totalRestante, setTotalRestante] = useState<number>(0);

  // Função para garantir número e formatar
  const formatarDinheiro = (
    valor: number | string | null | undefined
  ): string => {
    return (Number(valor) || 0).toFixed(2);
  };

  useEffect(() => {
    const restante = (Number(valorAPagar) || 0) - (Number(valorPago) || 0);
    setTotalRestante(restante);
    setTotalRestantePai(restante); // envia para o pai
  }, [valorAPagar, valorPago, setTotalRestantePai]);

  return (
    <div className="mt-10">
      <div className="mb-4 font-semibold">
        Valor a Pagar: R$ {formatarDinheiro(valorAPagar)}
      </div>

      <div className="flex gap-6 items-end">
        <div className="flex-1">
          <Label htmlFor="valorPago" className="pb-3">
            Valor Pago
          </Label>
          <Input
            id="valorPago"
            type="number"
            value={valorPago}
            onChange={(e) => setValorPago(Number(e.target.value))}
            step="0.01"
          />
        </div>

        <div className="flex-1">
          <Label className="pb-3">Total Restante</Label>
          <div className="h-9 flex items-center px-3 border border-gray-300 rounded bg-gray-100 font-semibold">
            R$ {formatarDinheiro(totalRestante)}
          </div>
        </div>
      </div>
    </div>
  );
};
