import { Header } from "../../components/header";
import { CardsClientes } from "./CardsClientes";
import { CardsStatus } from "./CardsStatus";
import { TableData } from "./TabelaDados";
import { useStatus } from "@/hooks/useStatus";

export function Status() {
  const { dados, loading, error } = useStatus();

  return (
    <div className="p-6 space-y-6 w-full">
      <Header
        title="Bem vindo a página Status!"
        text="Aqui você pode acompanhar alguns dados da sua empresa"
      />
      {/* Stats Cards */}

      <CardsStatus dados={dados} loading={loading} error={error} />

      {/* People Cards */}
      <CardsClientes />
      {/* Table */}
      <TableData />
    </div>
  );
}
