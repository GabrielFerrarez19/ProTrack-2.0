import { Badge } from "../../../components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "pago":
      return <Badge className="bg-pastel-green text-green-900">Pago</Badge>;
    case "parcial":
      return (
        <Badge className="bg-pastel-yellow text-yellow-900">Parcial</Badge>
      );
    case "vencido":
      return <Badge className="bg-pastel-red text-red-900">Vencido</Badge>;
    default:
      return <Badge className="bg-pastel-blue text-blue-900">Pendente</Badge>;
  }
}
