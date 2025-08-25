// pages/Estoque.tsx
import { useState } from "react";

// Hooks
import { useProdutos } from "../../hooks/useProdutos";

// Componentes
import { Header } from "../../components/header";
import { ProductTable } from "./Components/ProductTable";
import { SearchBar } from "./Components/SearchFilter";

export function Estoque() {
  const { products, loading, error, reload } = useProdutos();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.nome.toLowerCase().includes(term) ||
      (product.codigo_barras?.includes(searchTerm) ?? false) ||
      (product.categoria?.toLowerCase().includes(term) ?? false)
    );
  });

  if (loading) return <p className="p-6">Carregando produtos...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Bem vindo à página de produtos!"
        text="Aqui você pode cadastrar novos produtos no seu estoque"
      />
      <SearchBar searchTerm={searchTerm} onChange={setSearchTerm} />
      <ProductTable products={filteredProducts} onProductUpdated={reload} />
    </div>
  );
}
