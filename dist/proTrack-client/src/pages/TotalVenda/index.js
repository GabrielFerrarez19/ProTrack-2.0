"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TotalVendas = TotalVendas;
const react_1 = require("react");
const header_1 = require("../../components/header");
const api_1 = require("../../services/api");
const VendasTable_1 = require("./components/VendasTable");
function TotalVendas() {
    const [vendas, setVendas] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const loadVendas = async () => {
        setLoading(true);
        setError(null);
        try {
            // Tipamos fetchAllVendas para sempre retornar VendaResponse[]
            const data = await (0, api_1.fetchAllVendas)();
            setVendas(Array.isArray(data) ? data : []);
        }
        catch (err) {
            console.error("Erro ao buscar vendas:", err);
            setError("Erro ao buscar vendas");
            setVendas([]);
        }
        finally {
            setLoading(false);
        }
    };
    (0, react_1.useEffect)(() => {
        loadVendas();
    }, []);
    return (<div className="p-6 space-y-6">
      <header_1.Header title="Bem vindo à página Total Vendas!" text="Aqui você pode verificar todas as suas vendas"/>

      {loading ? (<p>Carregando vendas...</p>) : error ? (<p className="text-red-500">{error}</p>) : vendas.length === 0 ? (<p>Nenhuma venda encontrada.</p>) : (<VendasTable_1.VendasTable vendas={vendas} onVendaUpdated={loadVendas}/>)}
    </div>);
}
