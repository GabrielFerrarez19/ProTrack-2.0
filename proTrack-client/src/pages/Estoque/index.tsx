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

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await fetchAllProdutos();
        setProducts(data);
      } catch {
        setError("Erro ao carregar produtos");
      } finally {
        setLoading(false);
      }
    }
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
        title="Bem vindo a página cadastro de clientes!"
        text="Aqui você pode cadastrar novos produtos no seu estoque"
      />
      <SearchBar searchTerm={searchTerm} onChange={setSearchTerm} />
      <ProductTable products={filteredProducts} />
    </div>
  );
};

export default Estoque;
