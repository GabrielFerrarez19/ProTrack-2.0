"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cliente = Cliente;
const react_1 = require("react");
const api_1 = require("../../services/api");
const header_1 = require("../../components/header");
const ClientTable_1 = require("./components/ClientTable");
const functions_1 = require("../../utils/functions");
const SearchFilter_1 = require("./components/SearchFilter");
function Cliente() {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    const [clientes, setClientes] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const loadClientes = async () => {
        try {
            setLoading(true);
            const data = await (0, api_1.fetchAllClientes)();
            const clientesNormalizados = data.clientes.map(functions_1.normalizeCliente);
            console.log(clientesNormalizados);
            setClientes(clientesNormalizados);
            console.log(clientesNormalizados);
        }
        catch {
            setError("Erro ao carregar clientes");
        }
        finally {
            setLoading(false);
        }
    };
    (0, react_1.useEffect)(() => {
        loadClientes();
    }, []);
    const filteredClientes = clientes.filter((cliente) => {
        const term = searchTerm.toLowerCase();
        return (cliente.nome.toLowerCase().includes(term) ||
            cliente.cpf.toLowerCase().includes(term) ||
            cliente.email.toLowerCase().includes(term) ||
            cliente.telefoneWhatsapp?.toLowerCase().includes(term) ||
            cliente.telefoneCelular?.toLowerCase().includes(term) ||
            cliente.telefoneResidencial?.toLowerCase().includes(term) ||
            cliente.endereco?.toLowerCase().includes(term) ||
            cliente.cidade?.toLowerCase().includes(term) ||
            cliente.bairro?.toLowerCase().includes(term));
    });
    if (loading)
        return <p>Carregando clientes...</p>;
    if (error)
        return <p>{error}</p>;
    return (<div className="p-6 space-y-6">
      <header_1.Header title="Bem-vindo à página clientes!" text="Aqui você pode visualizar todos os clientes cadastrados no sistema."/>
      <SearchFilter_1.SearchBar searchTerm={searchTerm} onChange={setSearchTerm}/>
      <ClientTable_1.ClientTable clientes={filteredClientes} onClienteUpdated={loadClientes}/>
    </div>);
}
