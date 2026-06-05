// pages/Estoque.tsx
import { useState } from "react";

// Hooks
import { useProdutos } from "../../hooks/useProdutos";

// Componentes
import { Header } from "../../components/header";
import { ProductTable } from "./Components/ProductTable";
import { SearchBar } from "./Components/SearchFilter";
import { PageLoading } from "@/components/PageLoading";

export function Estoque() {
  const { data: products, isLoading, error } = useProdutos();
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) return <PageLoading message="Carregando produtos..." />;
  if (error) return <p className="p-6 text-red-600">{error.message}</p>;

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Bem vindo à página de produtos!"
        text="Aqui você pode cadastrar novos produtos no seu estoque"
      />
      <SearchBar searchTerm={searchTerm} onChange={setSearchTerm} />
      <ProductTable products={products ?? []} />
    </div>
  );
}
