import { CardsClientes } from "./CardsClientes";
import { CardsStatus } from "./CardsStatus";
import { TableData } from "./TabelaDados";

export function Status() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Bem vindo a página Status!
        </h1>
        <p className="text-muted-foreground">
          Aqui você pode acompanhar alguns dados da sua empresa.
        </p>
      </div>

      {/* Stats Cards */}

      <CardsStatus />

      {/* People Cards */}
      <CardsClientes />
      {/* Table */}
      <TableData />
    </div>
  );
}
