import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";

type Produto = {
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
};

export function ResumoVenda({ produtos }: { produtos: Produto[] }) {
  const [desconto, setDesconto] = useState(0); // desconto em %

  const totalItens = produtos.length;
  const totalQuantidade = produtos.reduce((acc, p) => acc + p.quantidade, 0);
  const totalPreco = produtos.reduce(
    (acc, p) => acc + p.quantidade * p.precoUnitario,
    0
  );

  const valorComDesconto = totalPreco * (1 - desconto / 100);

  // Limitar desconto entre 0 e 100
  const handleDescontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Number(e.target.value);
    if (val < 0) val = 0;
    else if (val > 100) val = 100;
    setDesconto(val);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo da Venda</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Itens:</span>
          <span className="font-medium">{totalItens}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Total de Produtos:
          </span>
          <span className="font-medium">{totalQuantidade}</span>
        </div>

        <div className="flex justify-between items-center">
          <label className="text-sm text-muted-foreground" htmlFor="desconto">
            Desconto (%):
          </label>
          <Input
            id="desconto"
            type="number"
            min={0}
            max={100}
            value={desconto}
            onChange={handleDescontoChange}
            className="w-20"
          />
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-primary">
              R$ {totalPreco.toFixed(2)}
            </span>
          </div>

          {desconto > 0 && (
            <div className="flex justify-between items-center text-green-600 font-semibold">
              <span>Valor com {desconto}% de desconto:</span>
              <span>R$ {valorComDesconto.toFixed(2)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
