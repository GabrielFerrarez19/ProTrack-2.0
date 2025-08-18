import { useState, useEffect } from "react";
import type { VendaResponse } from "../../../@types/types.components";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

interface ResumoVendasProps {
  vendas: VendaResponse[];
}

export const ResumoVendas = ({ vendas }: ResumoVendasProps) => {
  const [valorPago, setValorPago] = useState<number>(0);
  const [totalVendas, setTotalVendas] = useState<number>(0);
  const [totalRestante, setTotalRestante] = useState<number>(0);

  useEffect(() => {
    const total = vendas.reduce(
      (acc, venda) => acc + Number(venda.total_com_desconto ?? 0),
      0
    );
    setTotalVendas(total);
    setTotalRestante(total - valorPago);
  }, [vendas]);

  useEffect(() => {
    setTotalRestante(totalVendas - valorPago);
  }, [valorPago, totalVendas]);

  return (
    <div className="mt-10">
      <div className="mb-4 font-semibold">
        Total das Vendas: R$ {totalVendas.toFixed(2)}
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
