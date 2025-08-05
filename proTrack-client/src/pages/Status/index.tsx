import { Header } from "../../components/header";
import { CardsClientes } from "./CardsClientes";
import { CardsStatus } from "./CardsStatus";
import { TableData } from "./TabelaDados";

export function Status() {
  return (
    <div className="p-6 space-y-6 w-full">
      <Header
        title="Bem vindo a página Status!"
        text="Aqui você pode acompanhar alguns dados da sua empresa"
      />
      {/* Stats Cards */}

      <CardsStatus />

      {/* People Cards */}
      <CardsClientes />
      {/* Table */}
      <TableData />
    </div>
  );
}
