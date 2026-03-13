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
  const { clientes, loading, error, reload } = useClientes();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClientes = (clientes ?? []).filter((cliente) => {
    const term = searchTerm.toLowerCase();
    return (
      cliente.full_name.toLowerCase().includes(term) ||
      cliente.cpf.toLowerCase().includes(term) ||
      cliente.email.toLowerCase().includes(term) ||
      cliente.whatsapp?.toLowerCase().includes(term) ||
      cliente.mobile_phone?.toLowerCase().includes(term) ||
      cliente.home_phone?.toLowerCase().includes(term) ||
      cliente.address_street?.toLowerCase().includes(term) ||
      cliente.address_city?.toLowerCase().includes(term) ||
      cliente.address_neighborhood?.toLowerCase().includes(term)
    );
  });

  if (loading)
    return <PageLoading message="Carregando clientes..." />;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Bem-vindo à página clientes!"
        text="Aqui você pode visualizar todos os clientes cadastrados no sistema."
      />
      <SearchBar searchTerm={searchTerm} onChange={setSearchTerm} />
      <ClientTable clientes={filteredClientes} onClienteUpdated={reload} />
    </div>
  );
}
