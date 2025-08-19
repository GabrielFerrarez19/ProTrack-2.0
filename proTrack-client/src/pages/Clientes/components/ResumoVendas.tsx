import { useEffect, useState } from "react";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";

interface ResumoVendasProps {
  valorAPagar: number; // valor vindo do banco
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

  useEffect(() => {
    const restante = valorAPagar - valorPago;
    setTotalRestante(restante);
    setTotalRestantePai(restante); // envia para o pai
  }, [valorAPagar, valorPago, setTotalRestantePai]);

  return (
    <div className="mt-10">
      <div className="mb-4 font-semibold">
        Valor a Pagar: R$ {valorAPagar.toFixed(2)}
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
            R$ {totalRestante.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};
