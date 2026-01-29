import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { AlertTriangle } from "lucide-react";
import type { Alerta } from "../../../@types/types.components";

export function AlertasDashboard() {
  const [alertas] = useState<Alerta[]>([]);
  const loading = false;

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-400">
          <AlertTriangle className="h-5 w-5 text-red-300" />
          Alertas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <span className="text-sm text-gray-500">Carregando alertas...</span>
        ) : alertas.length === 0 ? (
          <span className="text-sm text-gray-500">
            Nenhum alerta no momento
          </span>
        ) : (
          alertas.map((alerta, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-2 rounded-lg ${
                alerta.urgencia === "alta" ? "bg-red-50" : "bg-yellow-50"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  alerta.urgencia === "alta" ? "bg-red-300" : "bg-yellow-300"
                }`}
              />
              <span className="text-sm text-gray-700">{alerta.mensagem}</span>
            </div>
          ))
        )}
        <Button variant="outline" size="sm" className="w-full mt-4">
          Ver Todos os Alertas
        </Button>
      </CardContent>
    </Card>
  );
}
