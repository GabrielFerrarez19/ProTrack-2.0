// pages/Cliente.tsx
import { useState } from "react";

// Hooks
import { useClientes } from "../../hooks/useClientes";

// Componentes
import { Header } from "../../components/header";
import { ClientTable } from "./components/ClientTable";
import { SearchBar } from "./components/SearchFilter";

export function Cliente() {
  const { clientes, loading, error, reload } = useClientes();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClientes = clientes.filter((cliente) => {
    const term = searchTerm.toLowerCase();
    return (
      cliente.nome.toLowerCase().includes(term) ||
      cliente.cpf.toLowerCase().includes(term) ||
      cliente.email.toLowerCase().includes(term) ||
      cliente.telefoneWhatsapp?.toLowerCase().includes(term) ||
      cliente.telefoneCelular?.toLowerCase().includes(term) ||
      cliente.telefoneResidencial?.toLowerCase().includes(term) ||
      cliente.endereco?.toLowerCase().includes(term) ||
      cliente.cidade?.toLowerCase().includes(term) ||
      cliente.bairro?.toLowerCase().includes(term)
    );
  });

  if (loading) return <p className="p-6">Carregando clientes...</p>;
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
