"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ProductTable_1 = require("./Components/ProductTable");
const SearchFilter_1 = require("./Components/SearchFilter");
const api_1 = require("../../services/api");
const header_1 = require("../../components/header");
const Estoque = () => {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    const [products, setProducts] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await (0, api_1.fetchAllProdutos)();
            setProducts(data);
        }
        catch {
            setError("Erro ao carregar produtos");
        }
        finally {
            setLoading(false);
        }
    };
    (0, react_1.useEffect)(() => {
        loadProducts();
    }, []);
    const filteredProducts = products.filter((product) => {
        const term = searchTerm.toLowerCase();
        return (product.nome.toLowerCase().includes(term) ||
            (product.codigo_barras?.includes(searchTerm) ?? false) ||
            (product.categoria?.toLowerCase().includes(term) ?? false));
    });
    if (loading)
        return <p>Carregando produtos...</p>;
    if (error)
        return <p>{error}</p>;
    return (<div className="p-6 space-y-6">
      <header_1.Header title="Bem vindo a página produtos!" text="Aqui você pode cadastrar novos produtos no seu estoque"/>
      <SearchFilter_1.SearchBar searchTerm={searchTerm} onChange={setSearchTerm}/>
      <ProductTable_1.ProductTable products={filteredProducts} onProductUpdated={loadProducts}/>
    </div>);
};
exports.default = Estoque;
