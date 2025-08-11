import { useState, useEffect } from "react";
import type { Product } from "../../@types/types.components";
import { ProductTable } from "./Components/ProductTable";
import { SearchBar } from "./Components/SearchFilter";
import { fetchAllProdutos } from "../../services/api";
import { Header } from "../../components/header";

const Estoque = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchAllProdutos();

      // Filtra só produtos com id definido
      const filteredData = data.filter((p): p is Product => p.id !== undefined);

      setProducts(filteredData);
    } catch {
      setError("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.nome.toLowerCase().includes(term) ||
      (product.codigo_barras?.includes(searchTerm) ?? false) ||
      (product.categoria?.toLowerCase().includes(term) ?? false)
    );
  });

  if (loading) return <p>Carregando produtos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Bem vindo a página produtos!"
        text="Aqui você pode cadastrar novos produtos no seu estoque"
      />
      <SearchBar searchTerm={searchTerm} onChange={setSearchTerm} />
      <ProductTable
        products={filteredProducts}
        onProductUpdated={loadProducts}
      />
    </div>
  );
};

export default Estoque;
