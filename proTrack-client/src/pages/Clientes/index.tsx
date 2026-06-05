// pages/Cliente.tsx
import { useState } from "react";

// Hooks
import { useClientes } from "../../hooks/useClientes";

// Componentes
import { Header } from "../../components/header";
import { ClientTable } from "./components/ClientTable";
import { SearchBar } from "./components/SearchFilter";
import { PageLoading } from "@/components/PageLoading";

export function Cliente() {
  const { data: clientes, isLoading, error } = useClientes();
  const [searchTerm, setSearchTerm] = useState("");

  console.log("clientes", clientes);

  if (isLoading) return <PageLoading message="Carregando clientes..." />;
  if (error) return <p className="p-6 text-red-600">{error.message}</p>;

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Bem-vindo à página clientes!"
        text="Aqui você pode visualizar todos os clientes cadastrados no sistema."
      />
      <SearchBar searchTerm={searchTerm} onChange={setSearchTerm} />
      <ClientTable clientes={clientes ?? []} />
    </div>
  );
}
