import { useState, useEffect } from "react";
import type { Cliente } from "../../@types/types.components";

import { fetchAllClientes } from "../../services/api";
import { Header } from "../../components/header";
import { ClientTable } from "./components/ClientTable";
import { normalizeCliente } from "../../utils/functions";
import { SearchBar } from "./components/SearchFilter";

export function Cliente() {
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadClientes = async () => {
    try {
      setLoading(true);
      const data = await fetchAllClientes();

      const clientesNormalizados = data.clientes.map(normalizeCliente);

      setClientes(clientesNormalizados);
      console.log(clientesNormalizados);
    } catch {
      setError("Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

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

  if (loading) return <p>Carregando clientes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Bem-vindo à página de cadastro de clientes!"
        text="Aqui você pode visualizar todos os clientes cadastrados no sistema."
      />
      <SearchBar searchTerm={searchTerm} onChange={setSearchTerm} />
      <ClientTable
        clientes={filteredClientes}
        onClienteUpdated={loadClientes}
      />
    </div>
  );
}
